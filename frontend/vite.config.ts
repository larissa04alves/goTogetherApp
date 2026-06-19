import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true, dedupe: ["react", "react-dom"] },
  plugins: [
    {
      name: "ignore-well-known",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/.well-known/")) {
            res.statusCode = 204;
            res.end();
            return;
          }
          next();
        });
      },
    },
    tailwindcss(),
    reactRouter(),
  ],
});
