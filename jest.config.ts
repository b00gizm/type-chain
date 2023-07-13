import path from "path"

const rootDirector = path.resolve(__dirname, ".")

export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 70,
      function: 80,
      lines: 80,
      statements: 80,
    },
  },
  globals: {},
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@tests/(.*)": "<rootDir>/__tests__/$1",
  },
  reporters: [
    "default",
    [
      path.resolve(rootDirector, "node_modules", "jest-html-reporter"),
      {
        outputPath: "test-report.html",
      },
    ],
  ],
  rootDir: rootDirector,
  roots: [rootDirector],
  setupFilesAfterEnv: [`${rootDirector}/__tests__/setup.ts`],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/build",
    `${rootDirector}/__tests__/fixtures`,
    `${rootDirector}/__tests__/setup.ts`,
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: ["(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$"],
}
