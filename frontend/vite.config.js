import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://craveon-backend.onrender.com/api",
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
});
