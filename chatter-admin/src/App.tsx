import { Component, lazy } from "solid-js";
import { A, Route, Routes } from "@solidjs/router";

import { MainMenu, MainMenuItem } from "./components/MainMenu";
import { NotificationsProvider } from "./services/notifications/Notifications";

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
            <Route path="/" component={lazy(() => import("./pages/Home"))} />
            <Route path="/tenants">
              <Route
                path="/"
                component={lazy(() => import("./pages/Tenants"))}
              />
              <Route
                path="/:tenant/users"
                component={lazy(() => import("./pages/tenants/Users"))}
              />
            </Route>
          </Routes>
        </div>
      </div>
    </NotificationsProvider>
  );
};

export default App;
