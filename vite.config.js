import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// VITE_BASE lets the app be hosted under a sub-path (e.g. /reporter/); defaults to root.
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
});
