import { Component, lazy } from "solid-js";
import { A, Route, Routes } from "@solidjs/router";

import { MainMenu, MainMenuItem } from "./components/MainMenu";
import { NotificationsProvider } from "./services/notifications/Notifications";

const Home = lazy(() => import("./pages/Home"));
const Tenants = lazy(() => import("./pages/Tenants"));
const TenantUsers = lazy(() => import("./pages/tenants/Users"));

const App: Component = () => {
  return (
    <NotificationsProvider>
      <div class="columns">
        <div class="column is-2">
          <MainMenu>
            <MainMenuItem>
              <A href="/">Home</A>
            </MainMenuItem>
            <MainMenuItem>
              <A href="/tenants">Tenants</A>
            </MainMenuItem>
          </MainMenu>
        </div>
        <div class="column">
          <Routes>
            <Route path="/" component={Home} />
            <Route path="/tenants" component={Tenants} />
            <Route path="/tenant/:tenant/users" component={TenantUsers} />
          </Routes>
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default App;
