import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { tessellatePlugin } from "@tessellatepos/plugin-sdk/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    [tessellatePlugin()]
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@tessellate-pos/common": path.resolve(
        __dirname,
        "./packages/tessellate-pos-common/src/index.ts"
      ),
    },
  },
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  server: {
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
});
