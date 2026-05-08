const USERS = {
  valid: {
    email: "lethinhphat7102003@gmail.com",
    password: "Phat12345",
  },
  invalid: {
    email: "invalid@gmail.com",
    password: "WrongPass",
  },
};

const API = {
  loginUrl: "https://rahulshettyacademy.com/api/ecom/auth/login",
};

const CHECKOUT = {
  email: "lethinhphat7102003@gmail.com",
  card: "4111111111111111",
  country: "Viet",
  expectedCountry: "Vietnam",
};

const URLS = {
  dashboard: "/client/#/dashboard",
};

module.exports = { USERS, API, CHECKOUT, URLS };
