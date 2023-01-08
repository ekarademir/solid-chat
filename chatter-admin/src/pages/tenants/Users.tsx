import { Component } from "solid-js";

import UsersComponent from "../../components/tenants/Users";
import { UsersAdminProvider } from "../../services/UsersAdminService";

const Users: Component = () => {
  return (
    <UsersAdminProvider>
      <UsersComponent />
    </UsersAdminProvider>
  );
};

export default Users;
