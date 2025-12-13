import { defineConfig } from "shadcn-ui/cli";

export default defineConfig({
  framework: "vite",
  tsconfigPath: "./tsconfig.json",
  components: {
    path: "./src/components",
  },
});
