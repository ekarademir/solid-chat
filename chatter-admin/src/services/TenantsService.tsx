import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

import { ListRequest, Tenant } from "../chat/chat";
import { TenantsClient } from "../chat/chat.client";
import { transportService } from "./TransportService";

export type TenantsContextState = {};

export type TenantsContextValue = [
  state: TenantsContextState,
  actions: {
    listTenants: (ListRequest) => Promise<Tenant[]>;
    newTenant: (string) => Promise<Tenant>;
    deleteTenant: (string) => Promise<Tenant>;
  }
];

const defaultState: TenantsContextState = {};

const TenantsContext = createContext<TenantsContextValue>([
  defaultState,
  {
    listTenants: () => undefined,
    newTenant: () => undefined,
    deleteTenant: () => undefined,
  },
]);

export const TenantsProvider: ParentComponent<{}> = (props) => {
  const [_s, { transport }] = transportService();
  const tenantsTransport = new TenantsClient(transport);

  const [tenantsState, _setTenantsState] = createStore<TenantsContextState>({});

  async function listTenants(opts: ListRequest) {
    const pending = tenantsTransport.list(opts);
    const tenants = [];
    for await (let t of pending.responses) tenants.push(t);
    return tenants;
  }

  async function newTenant(name: string) {
    const pending = tenantsTransport.create({
      name,
      id: 0,
    });
    return (await pending.response).tenant;
  }

  async function deleteTenant(name: string) {
    const pending = tenantsTransport.delete({
      param: { findOneof: { oneofKind: "name", name } },
    });
    return (await pending.response).tenant;
  }

  return (
    <TenantsContext.Provider
      value={[
        tenantsState,
        {
          listTenants,
          newTenant,
          deleteTenant,
        },
      ]}
    >
      {props.children}
    </TenantsContext.Provider>
  );
};

export const tenantsService = () => useContext(TenantsContext);
