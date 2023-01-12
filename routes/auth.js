const expressJwt = require("express-jwt");
const dotenv = require("dotenv");
dotenv.config();

module.exports = expressJwt({
  secret: process.env.TOKEN_JWT,
  requestProperty: "auth",
  algorithms: ["HS256"],
  getToken: (req) => {
    if (req.headers["x-auth-token"]) {
      return req.headers["x-auth-token"];
    }
    return null;
  },
}).unless({
  path: ["/api/user/login", "/api/user/signup"],
});
