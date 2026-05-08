const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartSection  = page.locator(".cartSection");
    this.checkoutBtn  = page.getByRole("button", { name: "Checkout" });
  }

  async waitForCart() {
    await this.page.waitForFunction(
      () => window.location.href.includes("cart"),
      { timeout: 15_000 }
    );
    await this.page.waitForLoadState("networkidle", { timeout: 15_000 });
  }

  async hasProduct(productName) {
    try {
      // expect().toBeVisible() retry tự động — đáng tin hơn waitFor + catch
      await expect(
        this.cartSection.locator("h3").filter({ hasText: new RegExp(productName, "i") })
      ).toBeVisible({ timeout: 15_000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasItemNumber() {
    return this.page.locator(".itemNumber").first().isVisible();
  }

  async clickCheckout() {
    await this.checkoutBtn.click();
    await this.page.waitForFunction(
      () => window.location.href.includes("order"),
      { timeout: 15_000 }
    );
  }
}

module.exports = { CartPage };
