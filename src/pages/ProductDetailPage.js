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

  async addToCart() {
    await this.addToCartBtn.scrollIntoViewIfNeeded();
    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("add-to-cart") && resp.status() === 200,
        { timeout: 10_000 },
      ),
      this.addToCartBtn.click(),
    ]);
    const toast = this.page.locator("#toast-container");
    await toast.waitFor({ state: "visible", timeout: 10_000 });
    await toast.waitFor({ state: "hidden", timeout: 10_000 });
  }
}

module.exports = { ProductDetailPage };
