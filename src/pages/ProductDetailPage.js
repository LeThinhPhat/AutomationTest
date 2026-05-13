const { BasePage } = require("./BasePage");

class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartBtn = page.getByRole("button", { name: "Add to Cart" });
  }

  async waitForPage() {
    await this.page.waitForFunction(
      () => window.location.href.includes("product-details"),
      { timeout: 15_000 },
    );
    await this.page.waitForLoadState("networkidle", { timeout: 10_000 });
  }

  // URL: .../#/dashboard/product-details/{id}
  getProductIdFromUrl() {
    return this.page.url().match(/product-details\/([^/?#]+)/)?.[1];
  }

  async getProductName() {
    const el = this.page.locator("h2").first();
    await el.waitFor({ state: "visible", timeout: 10_000 });
    return (await el.textContent())?.trim();
  }

  async clickCartIcon() {
    await this.page.locator("[routerlink='/dashboard/cart']").click();
  }

  async addToCart() {
    await this.addToCartBtn.scrollIntoViewIfNeeded();

    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("add-to-cart") && resp.status() === 200,
        { timeout: 15_000 },
      ),
      this.addToCartBtn.click(),
    ]);

    await this.page
      .locator("#toast-container")
      .filter({ hasText: /product added to cart/i })
      .waitFor({ state: "visible", timeout: 10_000 });
  }
}

module.exports = { ProductDetailPage };
