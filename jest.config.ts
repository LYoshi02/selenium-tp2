import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testTimeout: 180000,
  maxWorkers: 1
};

export default config;
