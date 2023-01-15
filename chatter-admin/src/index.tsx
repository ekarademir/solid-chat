/* @refresh reload */
import "./index.scss";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import App from "./App";
import { TransportProvider } from "./services/TransportService";
import { AuthorizationProvider } from "./services/AuthorizationService";

render(
  () => (
    <Router>
      <TransportProvider>
        <AuthorizationProvider>
          <App />
        </AuthorizationProvider>
      </TransportProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
