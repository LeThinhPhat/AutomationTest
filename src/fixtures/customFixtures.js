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

    // Listener phải đăng ký trước login để không miss response
    const productsLoaded = page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/ecom/product/get-all-products") &&
        resp.status() === 200,
      { timeout: 20_000 }
    );

    await loginPage.login(USERS.valid[0].email, USERS.valid[0].password);
    await productsLoaded;

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.waitForProducts();
    await page.locator("#toast-container").waitFor({ state: "hidden", timeout: 10_000 });

    await use(dashboardPage);

    // Teardown: xoá cart server-side sau mỗi test để tránh data leak sang test kế tiếp
    await clearCart(page);
  },
});

async function clearCart(page) {
  await page.goto("/client/#/dashboard/cart");
  await page.waitForLoadState("networkidle");
  const deleteBtn = page.locator(".cartSection button.btn-danger");
  while ((await deleteBtn.count()) > 0) {
    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes("remove-from-cart") && resp.ok(),
        { timeout: 10_000 },
      ),
      deleteBtn.first().click({ force: true }),
    ]);
    await page.waitForLoadState("networkidle");
  }
}

module.exports = { test, expect };
