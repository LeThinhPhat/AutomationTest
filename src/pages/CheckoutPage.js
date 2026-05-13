const { BasePage } = require("./BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput         = page.locator(".payment__shipping .user__name input[type='text']");
    this.cardInput          = page.getByRole("textbox").first();
    this.countryInput       = page.getByPlaceholder("Select Country");
    this.countrySuggestions = page.locator("button.ta-item.list-group-item");
    this.placeOrderBtn      = page.getByText("Place Order");
    this.successMessage     = page.getByRole("heading", { name: /thankyou for the order/i });
  }

  async waitForPage() {
    await this.emailInput.waitFor({ state: "visible", timeout: 15_000 });
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillCard(cardNumber) {
    await this.cardInput.fill(cardNumber);
  }

  async selectCountry(countryText) {
    await this.countryInput.pressSequentially(countryText, { delay: 100 });
    const match = this.countrySuggestions
      .filter({ hasText: new RegExp(countryText, "i") })
      .first();
    await match.waitFor({ state: "visible" });
    await match.click();
  }

  async placeOrder() {
    await this.placeOrderBtn.scrollIntoViewIfNeeded();
    await this.placeOrderBtn.click();
    await this.page.waitForFunction(
      () => window.location.href.includes("thanks"),
      { timeout: 15_000 }
    );
  }

  async getSuccessMessage() {
    await this.successMessage.waitFor({ state: "visible" });
    return this.successMessage.innerText();
  }
}

module.exports = { CheckoutPage };
