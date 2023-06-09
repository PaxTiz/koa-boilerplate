import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {

    reporters: ["html", "verbose"],
    include: ["./tests/**/*.test.ts"],
  },
});
