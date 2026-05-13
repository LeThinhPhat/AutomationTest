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

    // Step 1: Get product name from dashboard, then click View
    const dashboardProductName =
      await dashboardPage.getProductNameByName(PRODUCT_NAME);
    await dashboardPage.clickViewByName(PRODUCT_NAME);

    // Step 2: Verify product detail page shows same name as on dashboard
    const productDetailPage = new ProductDetailPage(dashboardPage.page);
    await productDetailPage.waitForPage();
    const detailProductName = await productDetailPage.getProductName();
    expect(detailProductName).toContain(dashboardProductName);

    await productDetailPage.addToCart();

    // Step 3: Click cart icon in navbar
    await productDetailPage.clickCartIcon();

    const cartPage = new CartPage(dashboardPage.page);
    await cartPage.waitForCart();
    expect(await cartPage.hasProduct(PRODUCT_NAME)).toBe(true);

    // Step 4: Checkout
    const checkout = CHECKOUT[0];
    await cartPage.clickCheckout();

    const checkoutPage = new CheckoutPage(dashboardPage.page);
    await checkoutPage.waitForPage();
    await checkoutPage.fillEmail(checkout.email);
    await checkoutPage.fillCard(checkout.card);
    await checkoutPage.selectCountry(checkout.country);
    expect(await checkoutPage.countryInput.inputValue()).toContain(
      checkout.expectedCountry,
    );
    await checkoutPage.placeOrder();
    const msg = await checkoutPage.getSuccessMessage();
    expect(msg.toLowerCase()).toContain("thankyou for the order.");
  });

  for (const checkout of CHECKOUT) {
    test(`Checkout product with card ending ${checkout.card.slice(-4)} shipping to ${checkout.expectedCountry}`, async ({
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
      await checkoutPage.fillEmail(checkout.email);
      await checkoutPage.fillCard(checkout.card);
      await checkoutPage.selectCountry(checkout.country);

      expect(await checkoutPage.countryInput.inputValue()).toContain(
        checkout.expectedCountry,
      );

      await checkoutPage.placeOrder();
      const msg = await checkoutPage.getSuccessMessage();
      expect(msg.toLowerCase()).toContain("thankyou for the order.");
    });
  }
});
