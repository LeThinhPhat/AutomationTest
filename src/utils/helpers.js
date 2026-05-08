const { expect } = require("@playwright/test");

async function expectURLContains(page, partial) {
  await expect(page).toHaveURL(new RegExp(partial));
}

module.exports = { expectURLContains };
