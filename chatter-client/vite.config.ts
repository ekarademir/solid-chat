import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";

export default defineConfig({
  plugins: [
    solidPlugin(),
    devtools({
      autoname: true,
    }),
  ],
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
