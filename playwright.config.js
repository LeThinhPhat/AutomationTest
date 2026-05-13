// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");
const { baseUrl } = require("./src/config/envConfig");

const ENV = process.env.ENV || "test";
const reportDir = ENV === "production" ? "reports/dev" : "reports/tester";

module.exports = defineConfig({
  testDir: "./src/tests",

  // Timeout test (30 giây)
  timeout: 30_000,

  // Retries test
  // retries: process.env.CI ? 2 : 0,
  retries: 0,

  // Parallel test
  // workers: process.env.CI ? 4 : 2,
  workers: 1,

  // Timeout cho expect()
  expect: {
    timeout: 5_000,
  },

  // Reporter
  reporter: [
    ["html", { outputFolder: reportDir, open: "never" }],
    ["list"],
  ],

  use: {
    // URL — resolved from ENV via src/config/envConfig.js
    baseURL: baseUrl,

    // Trace failure
    trace: "on",

    // Screenshot failure
    screenshot: "only-on-failure",

    // record failure
    // video: "retain-on-failure",
    video: "off",

    // Timeout action (click, fill,...)
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  // Browser configurations
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
