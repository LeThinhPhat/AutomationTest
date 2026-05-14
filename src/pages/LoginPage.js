const { BasePage } = require("./BasePage");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput    = page.locator("#userEmail");
    this.passwordInput = page.locator("#userPassword");
    this.loginButton        = page.getByRole("button", { name: "Login" });
    this.errorToast         = page.locator("#toast-container");
    this.validationMessages = page.locator("app-login .invalid-feedback");
  }

  async goto() {
    await this.navigate("/client");
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

}

module.exports = { LoginPage };
