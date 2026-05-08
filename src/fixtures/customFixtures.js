const { test: base, expect } = require("@playwright/test");
const { LoginPage } = require("../pages/LoginPage");
const { DashboardPage } = require("../pages/DashboardPage");
const { USERS } = require("../data/testData");

const test = base.extend({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Register response listener BEFORE login so we don't miss the products request
    const productsLoaded = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/ecom/product/get-all-products") &&
        resp.status() === 200,
      { timeout: 20_000 }
    );

    await loginPage.login(USERS.valid.email, USERS.valid.password);

    // Ensure products API has responded before proceeding
    await productsLoaded;

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForProducts();
    // Wait for login toast to disappear so it doesn't interfere with subsequent toast checks
    await page.locator("#toast-container").waitFor({ state: "hidden", timeout: 10_000 });
    await use(dashboardPage);
  },
});

module.exports = { test, expect };
