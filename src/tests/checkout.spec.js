const { test, expect } = require("../fixtures/customFixtures");
const { CartPage } = require("../pages/CartPage");
const { CheckoutPage } = require("../pages/CheckoutPage");
const { CHECKOUT } = require("../data/testData");

const PRODUCT_NAME = "ZARA COAT 3";

test.describe("Checkout", () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.addToCartByName(PRODUCT_NAME);
    await dashboardPage.waitForToast();
    await dashboardPage.goToCart();

    const cartPage = new CartPage(dashboardPage.page);
    await cartPage.waitForCart();
    await cartPage.clickCheckout();
  });

  test("Checkout page pre-fills email from account", async ({ dashboardPage }) => {
    const checkoutPage = new CheckoutPage(dashboardPage.page);
    await checkoutPage.waitForPage();
    expect(await checkoutPage.emailInput.inputValue()).toBe(CHECKOUT[0].email);
  });

  test("Country autocomplete filters and reflects full country name", async ({ dashboardPage }) => {
    const checkoutPage = new CheckoutPage(dashboardPage.page);
    await checkoutPage.waitForPage();
    await checkoutPage.selectCountry(CHECKOUT[0].country);
    expect(await checkoutPage.countryInput.inputValue()).toContain(
      CHECKOUT[0].expectedCountry,
    );
  });

  test("Valid card and country places order and shows thank you message", async ({ dashboardPage }) => {
    const checkoutPage = new CheckoutPage(dashboardPage.page);
    await checkoutPage.waitForPage();
    await checkoutPage.fillCard(CHECKOUT[0].card);
    await checkoutPage.selectCountry(CHECKOUT[0].country);
    await checkoutPage.placeOrder();
    const msg = await checkoutPage.getSuccessMessage();
    expect(msg.toLowerCase()).toContain("thankyou for the order.");
  });
});
