const { test, expect } = require("../fixtures/customFixtures");
const { USERS, API, URLS } = require("../data/testData");
const { expectURLContains } = require("../utils/helpers");

test.describe("Login - UI", () => {
  for (const user of USERS.valid) {
    test(`should login successfully with valid credentials [${user.email}]`, async ({ loginPage, page }) => {
      await loginPage.login(user.email, user.password);
      await expectURLContains(page, URLS.dashboard);
    });
  }

  for (const user of USERS.invalid) {
    test(`should show error for invalid credentials [${user.email}]`, async ({ loginPage }) => {
      await loginPage.login(user.email, user.password);
      await expect(loginPage.errorToast).toBeVisible();
      await expect(loginPage.errorToast).toContainText("Incorrect email or password.");
    });
  }

  test("should not login with empty credentials", async ({ loginPage }) => {
    await loginPage.login("", "");
    await expect(loginPage.validationMessages.filter({ hasText: "Email is required" })).toBeVisible();
    await expect(loginPage.validationMessages.filter({ hasText: "Password is required" })).toBeVisible();
  });
});

test.describe("Login - API", () => {
  for (const user of USERS.valid) {
    test(`should return 200 with token and userId for valid credentials [${user.email}]`, async ({ request }) => {
      const response = await request.post(API.loginUrl, {
        data: {
          userEmail: user.email,
          userPassword: user.password,
        },
      });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.message).toBe("Login Successfully");
      expect(body.userId).toBeTruthy();
      expect(body.token).toBeTruthy();
      expect(typeof body.token).toBe("string");
    });
  }

  for (const user of USERS.invalid) {
    test(`should return 400 with error message for invalid credentials [${user.email}]`, async ({ request }) => {
      const response = await request.post(API.loginUrl, {
        data: {
          userEmail: user.email,
          userPassword: user.password,
        },
      });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.message).toBe("Incorrect email or password.");
    });
  }
});
