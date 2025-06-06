require('dotenv').config();
const invalidatedTokens = new Set();

// JWT authentication strategy

module.exports = {
  invalidatedTokens,
  setupAuth: (server) => {
    server.auth.strategy("jwt_auth_strategy", "jwt", {
      keys: process.env.JWT_SECRET,
      verify: {
        aud: "urn:audience:test",
        iss: "urn:issuer:test",
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400,
        timeSkewSec: 15,
      },
      validate: (artifacts, request) => ({
        isValid: !invalidatedTokens.has(request.headers.authorization?.split(" ")[1]),
        credentials: { id: artifacts.decoded.payload.id },
      }),
    });
    server.auth.default("jwt_auth_strategy");
  }
};
