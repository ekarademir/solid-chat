import { Component, lazy } from "solid-js";
import { A, Route, Routes } from "@solidjs/router";

const Home = lazy(() => import("./pages/Home"));
const Tenants = lazy(() => import("./pages/Tenants"));

const App: Component = () => {
  return (
    <div class="columns">
      <div class="column is-1">
        <aside class="menu">
          <ul class="menu-list">
            <li>
              <A href="/">Home</A>
              <A href="/tenants">Tenants</A>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/tenants" component={Tenants} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
