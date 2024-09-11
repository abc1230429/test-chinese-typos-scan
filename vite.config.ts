import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/test-chinese-typos-scan/",
  plugins: [react(), visualizer()],
  resolve: {
    alias: {
      src: "/src",
      lodash: "lodash-es",
    },
  },
});
