const { test, expect } = require("../fixtures/customFixtures");
const { USERS, API, URLS } = require("../data/testData");
const { expectURLContains } = require("../utils/helpers");

test.describe("Login - UI", () => {
  test("should login successfully with valid credentials", async ({ loginPage, page }) => {
    await loginPage.login(USERS.valid.email, USERS.valid.password);
    await expectURLContains(page, URLS.dashboard);
  });

  test("should show error for invalid credentials", async ({ loginPage }) => {
    await loginPage.login(USERS.invalid.email, USERS.invalid.password);
    await expect(loginPage.errorToast).toBeVisible();
    await expect(loginPage.errorToast).toContainText("Incorrect email or password.");
  });

  test("should not login with empty credentials", async ({ loginPage }) => {
    await loginPage.login("", "");
    await expect(loginPage.validationMessages.filter({ hasText: "Email is required" })).toBeVisible();
    await expect(loginPage.validationMessages.filter({ hasText: "Password is required" })).toBeVisible();
  });
});

test.describe("Login - API", () => {
  test("should return 200 with token and userId for valid credentials", async ({ request }) => {
    const response = await request.post(API.loginUrl, {
      data: {
        userEmail: USERS.valid.email,
        userPassword: USERS.valid.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe("Login Successfully");
    expect(body.userId).toBeTruthy();
    expect(body.token).toBeTruthy();
    expect(typeof body.token).toBe("string");
  });

  test("should return 400 with error message for invalid credentials", async ({ request }) => {
    const response = await request.post(API.loginUrl, {
      data: {
        userEmail: USERS.invalid.email,
        userPassword: USERS.invalid.password,
      },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.message).toBe("Incorrect email or password.");
  });
});
