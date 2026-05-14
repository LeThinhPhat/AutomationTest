const { BasePage } = require("./BasePage");

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator("app-dashboard .card");
    this.toastMessage = page.locator("#toast-container");
    this.cartIcon     = page.locator("[routerlink='/dashboard/cart']");
  }

  async waitForProducts() {
    await this.productCards.first().waitFor({ state: "visible", timeout: 20_000 });
  }

  // Dùng filter() thay vì vòng lặp thủ công — tìm card chứa text sản phẩm
  async #findCard(productName) {
    const card = this.productCards.filter({ hasText: new RegExp(productName, "i") });
    if ((await card.count()) === 0) throw new Error(`Product "${productName}" not found`);
    return card.first();
  }

  async addToCartByName(productName) {
    const card = await this.#findCard(productName);
    await card.getByRole("button", { name: "Add To Cart" }).click();
  }

  async clickViewByName(productName) {
    const card = await this.#findCard(productName);
    await card.getByRole("button", { name: "View" }).click();
  }

  async getProductNameByName(productName) {
    const card = await this.#findCard(productName);
    return (await card.locator("h5").first().textContent())?.trim();
  }

  async waitForToast() {
    await this.toastMessage.waitFor({ state: "visible" });
  }

  async goToCart() {
    await this.page.goto("/client/#/dashboard/cart");
  }
}

module.exports = { DashboardPage };
