import {
  createContext,
  createEffect,
  useContext,
  ParentComponent,
} from "solid-js";
import { createStore } from "solid-js/store";
import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import {
  RpcOptions,
  RpcOutputStreamController,
  ServerStreamingCall,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";

const ADMIN_SESSION_KEY = "chatter-admin-session";

export type TransportContextState = {
  sessionToken: string;
};

export type TransportContextValue = [
  state: TransportContextState,
  actions: {
    getMetaInfo: () => {
      authorization: string;
    };
    transport: GrpcWebFetchTransport;
  }
];

const defaultState: TransportContextState = {
  sessionToken: "YARRAK",
};

const TransportContext = createContext<TransportContextValue>([
  defaultState,
  {
    getMetaInfo: () => undefined,
    transport: null,
  },
]);

const loadLocalSession = (): TransportContextState => {
  const localState = localStorage.getItem(ADMIN_SESSION_KEY);
  if (localState) {
    const state: TransportContextState = JSON.parse(localState);
    return state;
  } else {
    return defaultState;
  }
};

const saveLocalSession = (state: TransportContextState) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(state));
};

export const TransportProvider: ParentComponent<{}> = (props) => {
  const [authenticationState, setTransportState] =
    createStore<TransportContextState>(loadLocalSession());

  createEffect(() => {
    saveLocalSession(authenticationState);
  });

  const getMetaInfo = () => {
    return {
      // Guard against null tokens
      authorization: authenticationState.sessionToken || "NEWSESSION",
    };
  };

  const decorateOptions = (options: RpcOptions): RpcOptions => {
    if (!options.meta) {
      options.meta = {};
    }
    options.meta = {
      ...options.meta,
      ...getMetaInfo(),
    };
    return options;
  };

  const transport = new GrpcWebFetchTransport({
    baseUrl: "https://rotatingwave.local:50051",
    format: "binary",
    interceptors: [
      {
        interceptUnary(next, method, input, options) {
          const original = next(method, input, decorateOptions(options));
          return new UnaryCall(
            original.method,
            original.requestHeaders,
            original.request,
            original.headers,
            original.response,
            original.status,
            original.trailers
          );
        },
      },
      {
        interceptServerStreaming(next, method, input, options) {
          const original = next(method, input, decorateOptions(options));
          const response = new RpcOutputStreamController();
          original.responses.onNext((message, error, done) => {
            if (message) response.notifyMessage(message);
            if (error) response.notifyError(error);
            if (done) response.notifyComplete();
          });
          return new ServerStreamingCall(
            original.method,
            original.requestHeaders,
            original.request,
            original.headers,
            response,
            original.status,
            original.trailers
          );
        },
      },
    ],
  });

  return (
    <TransportContext.Provider
      value={[authenticationState, { getMetaInfo, transport }]}
    >
      {props.children}
    </TransportContext.Provider>
  );
};

export const transportService = () => useContext(TransportContext);
