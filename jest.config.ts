import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testTimeout: 180000,
  maxWorkers: 1,
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Reporte de Pruebas",
        outputPath: "./output/test-report.html",
        includeFailureMsg: true
      },
    ],
  ],
};

export default config;
