import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          apollo: ["@apollo/client", "graphql"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-label", "@radix-ui/react-slot"],
        },
      },
    },
  },
});
