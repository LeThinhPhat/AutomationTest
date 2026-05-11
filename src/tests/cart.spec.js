const { test, expect } = require("../fixtures/customFixtures");
const { CartPage } = require("../pages/CartPage");
const { ProductDetailPage } = require("../pages/ProductDetailPage");
const { CheckoutPage } = require("../pages/CheckoutPage");
const { CHECKOUT } = require("../data/testData");

const PRODUCT_NAME = "ZARA COAT 3";

test.describe("Shopping Cart", () => {
  test("Add product to cart from dashboard and verify it appears in cart", async ({
    dashboardPage,
  }) => {
    await dashboardPage.addToCartByName(PRODUCT_NAME);
    await dashboardPage.waitForToast();

    await dashboardPage.goToCart();

    const cartPage = new CartPage(dashboardPage.page);
    await cartPage.waitForCart();
    expect(await cartPage.hasProduct(PRODUCT_NAME)).toBe(true);
  });

  test("View product detail, add to cart, and verify product appears in cart", async ({
    dashboardPage,
  }) => {
    await dashboardPage.waitForProducts();
    await dashboardPage.clickViewByName(PRODUCT_NAME);

    const productDetailPage = new ProductDetailPage(dashboardPage.page);
    await productDetailPage.waitForPage();
    expect(productDetailPage.getProductIdFromUrl()).toBeTruthy();

    await productDetailPage.addToCart();
    await dashboardPage.goToCart();

    const cartPage = new CartPage(dashboardPage.page);
    await cartPage.waitForCart();
    expect(await cartPage.hasProduct(PRODUCT_NAME)).toBe(true);
    expect(await cartPage.hasItemNumber()).toBe(true);
  });

  test("Checkout product and fill shipping form with country autocomplete", async ({
    dashboardPage,
  }) => {
    await dashboardPage.addToCartByName(PRODUCT_NAME);
    await dashboardPage.waitForToast();

    await dashboardPage.goToCart();
    const cartPage = new CartPage(dashboardPage.page);
    await cartPage.waitForCart();
    expect(await cartPage.hasProduct(PRODUCT_NAME)).toBe(true);

    await cartPage.clickCheckout();

    const checkoutPage = new CheckoutPage(dashboardPage.page);
    await checkoutPage.waitForPage();
    await checkoutPage.fillEmail(CHECKOUT.email);
    await checkoutPage.fillCard(CHECKOUT.card);
    await checkoutPage.selectCountry(CHECKOUT.country);

    expect(await checkoutPage.countryInput.inputValue()).toContain(
      CHECKOUT.expectedCountry,
    );

    await checkoutPage.placeOrder();
    const msg = await checkoutPage.getSuccessMessage();
    expect(msg.toLowerCase()).toContain("thankyou for the order.");
  });
});
