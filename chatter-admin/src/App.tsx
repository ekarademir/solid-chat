import { Component, lazy } from "solid-js";
import { A, Route, Routes } from "@solidjs/router";
import { BiRegularExit } from "solid-icons/bi";

import { MainMenu, MainMenuItem } from "./components/MainMenu";
import { NotificationsProvider } from "./services/notifications/Notifications";
import { authorizationService } from "./services/AuthorizationService";

const App: Component = () => {
  const [_s, { logout }] = authorizationService();
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
            <MainMenuItem>
              <button
                class="button is-link is-inverted"
                onClick={() => logout()}
              >
                <span class="icon">
                  <BiRegularExit />
                </span>
                <span>Logout</span>
              </button>
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
