/* @refresh reload */
import "./index.scss";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import App from "./App";
import { TransportProvider } from "./services/TransportService";

render(
  () => (
    <Router>
      <TransportProvider>
        <App />
      </TransportProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
