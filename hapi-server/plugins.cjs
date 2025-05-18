const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Jwt = require("@hapi/jwt");
const Pack = require("./package.json");

/*
  Register plugins with the Hapi server:
  - inert
  - vision
  - hapi-swagger
  - hapi/jwt
*/

module.exports = [
	inert,
	vision,
	{
		plugin: HapiSwagger,
		options: {
			info: { title: "API Documentation", version: Pack.version },
			securityDefinitions: {
				jwt: { type: "apiKey", name: "Authorization", in: "header" },
			},
			security: [{ jwt: [] }],
			documentationPath: "/docs",
		},
	},
	Jwt,
];
