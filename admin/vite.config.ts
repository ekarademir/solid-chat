import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 8000,
    host: "rotatingwave.local",
    https: {
      key: "../ssl/key.pem",
      cert: "../ssl/cert.pem",
    },
  },
  build: {
    target: "esnext",
  },
});
