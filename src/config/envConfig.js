const ENV = process.env.ENV || "test";

const configs = {
  test: {
    baseUrl: "https://rahulshettyacademy.com",
    apiLoginUrl: "https://rahulshettyacademy.com/api/ecom/auth/login",
  },
  production: {
    baseUrl: "https://prod.rahulshettyacademy.com",
    apiLoginUrl: "https://prod.rahulshettyacademy.com/api/ecom/auth/login",
  },
};

module.exports = configs[ENV];
