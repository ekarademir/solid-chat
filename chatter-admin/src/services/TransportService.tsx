import { GrpcWebFetchTransport } from "@protobuf-ts/grpcweb-transport";
import {
  RpcError,
  RpcOptions,
  RpcOutputStreamController,
  ServerStreamingCall,
  UnaryCall,
} from "@protobuf-ts/runtime-rpc";
import {
  createContext,
  createEffect,
  useContext,
  ParentComponent,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useNavigate } from "@solidjs/router";

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
  sessionToken: "NEWSESSION",
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

  const maybeLogin = (err: Error | RpcError) => {
    // const navigate = useNavigate();
    console.error(err);
    if (err instanceof RpcError) {
      if (err.code === "UNAUTHORIZED") {
        // navigate("/login", { replace: true });
        return null;
      }
    }
    return err;
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

          const response = original.response.catch((e) => {
            return maybeLogin(e);
          });

          return new UnaryCall(
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
      {
        interceptServerStreaming(next, method, input, options) {
          const original = next(method, input, decorateOptions(options));
          const response = new RpcOutputStreamController();
          original.responses.onNext((message, error, done) => {
            if (message) response.notifyMessage(message);
            if (error) maybeLogin(error) || response.notifyError(error);
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
