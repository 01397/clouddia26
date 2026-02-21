import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Explicitly set the host to avoid Dev Container's port forwarding issues
    host: '127.0.0.1'
  },
});
