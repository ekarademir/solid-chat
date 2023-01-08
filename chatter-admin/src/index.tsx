/* @refresh reload */
import "./index.scss";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import App from "./App";
import { TransportProvider } from "./services/TransportService";

render(
  () => (
    <TransportProvider>
      <Router>
        <App />
      </Router>
    </TransportProvider>
  ),
  document.getElementById("root") as HTMLElement
);
