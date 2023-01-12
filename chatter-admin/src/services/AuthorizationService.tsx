import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

import {
  BasicAuthenticationRequest,
  BasicAuthenticationResponse,
} from "../chat/chat";
import { AuthenticationClient } from "../chat/chat.client";
import { transportService } from "./TransportService";

export type AuthorizationContextState = {};

export type AuthorizationContextValue = [
  state: AuthorizationContextState,
  actions: {}
];

const defaultState: AuthorizationContextState = {};

const AuthorizationContext = createContext<AuthorizationContextValue>([
  defaultState,
  {},
]);

export const AuthorizationProvider: ParentComponent<{}> = (props) => {
  const [authorizationState, setAuthorizationState] =
    createStore<AuthorizationContextState>({});

  return (
    <AuthorizationContext.Provider value={[authorizationState, {}]}>
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const authorizationService = () => useContext(AuthorizationContext);
