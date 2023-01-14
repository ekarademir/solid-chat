import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation, useNavigate } from "@solidjs/router";

import { BasicAuthenticationRequest } from "../chat/chat";
import { AuthenticationClient } from "../chat/chat.client";
import { transportService } from "./TransportService";

export type AuthorizationContextState = {};

export type AuthorizationContextValue = [
  state: AuthorizationContextState,
  actions: {
    login: (BasicAuthenticationRequest) => Promise<void>;
  }
];

const defaultState: AuthorizationContextState = {};

const AuthorizationContext = createContext<AuthorizationContextValue>([
  defaultState,
  {
    login: () => undefined,
  },
]);

export const AuthorizationProvider: ParentComponent<{}> = (props) => {
  const [_s, { transport, setSessionToken }] = transportService();
  const authenticationTransport = new AuthenticationClient(transport);
  const [authorizationState, _setAuthorizationState] =
    createStore<AuthorizationContextState>({});

  const navigate = useNavigate();
  const location = useLocation();

  async function login(opts) {
    const pending = authenticationTransport.basicAuthentication(opts);
    const response = await pending.response;
    const token = response.sessionToken;
    setSessionToken(token);
    navigate(location.pathname);
  }

  return (
    <AuthorizationContext.Provider value={[authorizationState, { login }]}>
      {props.children}
    </AuthorizationContext.Provider>
  );
};

export const authorizationService = () => useContext(AuthorizationContext);
