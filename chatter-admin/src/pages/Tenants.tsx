import { Component } from "solid-js";

import TenantsComponent from "../components/tenants/Tenants";
import { TenantsProvider } from "../services/TenantsService";

const Tenants: Component = () => {
  return (
    <TenantsProvider>
      <TenantsComponent />
    </TenantsProvider>
  );
};

export default Tenants;
