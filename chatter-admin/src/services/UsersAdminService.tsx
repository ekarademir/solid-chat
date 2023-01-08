import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export type UsersAdminContextState = {};

export type UsersAdminContextValue = [
  state: UsersAdminContextState,
  actions: {}
];

const defaultState: UsersAdminContextState = {};

const UsersAdminContext = createContext<UsersAdminContextValue>([
  defaultState,
  {},
]);

export const UsersAdminProvider: ParentComponent<{}> = (props) => {
  const [usersAdminState, setUsersAdminState] =
    createStore<UsersAdminContextState>({});

  return (
    <UsersAdminContext.Provider value={[usersAdminState, {}]}>
      {props.children}
    </UsersAdminContext.Provider>
  );
};

export const usersAdminService = () => useContext(UsersAdminContext);
