import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "@radix-ui/react-select",
      "@radix-ui/react-label",
      "sonner",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
