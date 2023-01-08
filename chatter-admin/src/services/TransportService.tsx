import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export type TransportContextState = {
  sessionToken: string;
};

export type TransportContextValue = [
  state: TransportContextState,
  actions: {
    getMetaInfo: () => {
      authorization: string;
    };
  }
];

const defaultState: TransportContextState = {
  sessionToken: null,
};

const TransportContext = createContext<TransportContextValue>([
  defaultState,
  {
    getMetaInfo: () => undefined,
  },
]);

export const TransportProvider: ParentComponent<{}> = (props) => {
  const [authenticationState, setTransportState] =
    createStore<TransportContextState>({
      sessionToken: "some token",
    });

  const getMetaInfo = () => {
    return { authorization: authenticationState.sessionToken };
  };

  return (
    <TransportContext.Provider value={[authenticationState, { getMetaInfo }]}>
      {props.children}
    </TransportContext.Provider>
  );
};

export const transportService = () => useContext(TransportContext);
