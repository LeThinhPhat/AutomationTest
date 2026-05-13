const { apiLoginUrl } = require("../config/envConfig");

const USERS = {
  valid: [
    { email: "lethinhphat7102003@gmail.com", password: "Phat12345" },
    // { email: "johndoe@example.com", password: "John12345" },
    // { email: "janedoe@example.com", password: "Jane12345" },
  ],
  invalid: [
    { email: "invalid@gmail.com", password: "WrongPass" },
    { email: "notexist@test.com", password: "BadPass123" },
    { email: "fake@email.com", password: "NoAccess99" },
  ],
};

const API = {
  loginUrl: apiLoginUrl,
};

const CHECKOUT = [
  {
    email: "lethinhphat7102003@gmail.com",
    card: "4111111111111111",
    country: "Viet",
    expectedCountry: "Vietnam",
  },
  {
    email: "lethinhphat7102003@gmail.com",
    card: "5500005555555559",
    country: "India",
    expectedCountry: "India",
  },
  {
    email: "lethinhphat7102003@gmail.com",
    card: "371449635398431",
    country: "Singap",
    expectedCountry: "Singapore",
  },
];

const URLS = {
  dashboard: "/client/#/dashboard",
};

module.exports = { USERS, API, CHECKOUT, URLS };
