const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Jwt = require("@hapi/jwt");
const Pack = require("./package.json");

module.exports = [
  inert,
  vision,
  {
    plugin: HapiSwagger,
    options: {
      info: { title: "Test API Documentation", version: Pack.version },
      securityDefinitions: {
        jwt: { type: "apiKey", name: "Authorization", in: "header" },
      },
      security: [{ jwt: [] }],
    },
  },
  Jwt,
];
