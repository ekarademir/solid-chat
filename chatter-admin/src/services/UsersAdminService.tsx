import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

import {
  FindWithTenantRequest,
  ListWithTenantRequest,
  UserKind,
  UserPassword,
  User,
} from "../chat/chat";
import { transportService } from "./TransportService";
import { UsersAdminClient } from "../chat/chat.client";

export interface DeleteUserOpts {
  username: string;
  tenantName: string;
}

export interface SetPassword extends UserPassword {
  passwordRepeat: string;
}

type UserKindType = { [id: number]: string };

export const UserKindHumanReadable: UserKindType = Object.create(null);

UserKindHumanReadable[UserKind.INVITEE] = "Invitee";
UserKindHumanReadable[UserKind.REGISTERED] = "Registered";
UserKindHumanReadable[UserKind.VISITOR] = "Visitor";

export type UsersAdminContextState = {};

export type UsersAdminContextValue = [
  state: UsersAdminContextState,
  actions: {
    listUsers: (ListWithTenantRequest) => Promise<User[]>;
    newUser: (User) => Promise<User>;
    deleteUser: (DeleteUserOpts) => Promise<User>;
    updateUser: (User) => Promise<User>;
    setPassword: (SetPassword) => Promise<User>;
  }
];

const defaultState: UsersAdminContextState = {};

const UsersAdminContext = createContext<UsersAdminContextValue>([
  defaultState,
  {
    listUsers: () => undefined,
    newUser: () => undefined,
    deleteUser: () => undefined,
    updateUser: () => undefined,
    setPassword: () => undefined,
  },
]);

export const UsersAdminProvider: ParentComponent<{}> = (props) => {
  const [_s, { getMetaInfo, transport }] = transportService();
  const usersAdminTransport = new UsersAdminClient(transport);

  const [usersAdminState, setUsersAdminState] =
    createStore<UsersAdminContextState>({});

  async function listUsers(opts: ListWithTenantRequest) {
    const pending = usersAdminTransport.list(opts);
    const users = [];
    for await (let u of pending.responses) users.push(u);
    return users;
  }

  async function newUser(newUser: User) {
    const pending = usersAdminTransport.create(newUser);
    return (await pending.response).user;
  }

  async function deleteUser(opts: DeleteUserOpts) {
    const req: FindWithTenantRequest = {
      tenantName: opts.tenantName,
      param: { findOneof: { oneofKind: "username", username: opts.username } },
    };
    const pending = usersAdminTransport.delete(req);
    return (await pending.response).user;
  }

  async function updateUser(opts: User) {
    const pending = usersAdminTransport.update(opts);
    return (await pending.response).user;
  }

  async function setPassword(opts: SetPassword) {
    if (opts.password !== opts.passwordRepeat) {
      throw new Error("Passwords don't match");
    }
    const pending = usersAdminTransport.setPassword(opts);
    return (await pending.response).user;
  }

  return (
    <UsersAdminContext.Provider
      value={[
        usersAdminState,
        {
          listUsers,
          newUser,
          deleteUser,
          updateUser,
          setPassword,
        },
      ]}
    >
      {props.children}
    </UsersAdminContext.Provider>
  );
};

export const usersAdminService = () => useContext(UsersAdminContext);
