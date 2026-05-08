const { BasePage } = require("./BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput         = page.locator(".payment__shipping .user__name input[type='text']");
    this.cardInput          = page.locator("input.txt").first();
    this.countryInput       = page.getByPlaceholder("Select Country");
    this.countrySuggestions = page.locator("button.ta-item.list-group-item");
    this.placeOrderBtn      = page.locator(".action__submit");
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
    await this.countrySuggestions.first().waitFor({ state: "visible" });

    const options = this.countrySuggestions;
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).innerText();
      if (text.trim().toLowerCase().includes(countryText.toLowerCase())) {
        await options.nth(i).click();
        return;
      }
    }
    await options.first().click();
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
