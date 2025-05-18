const db = require("../db.cjs");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/helpers.cjs");
const { TokenResponseSchema, MessageResponseSchema } = require("../schemas/index.cjs");
const Joi = require("joi");
const { invalidatedTokens } = require("../auth.cjs");

module.exports = [
	{
		method: "POST",
		path: "/login",
		options: {
			tags: ["api"],
			auth: false,
			plugins: { "hapi-swagger": { security: [] } },
			validate: {
				payload: Joi.object({
					email: Joi.string().email().required(),
					password: Joi.string().required(),
				}),
			},
			response: { schema: TokenResponseSchema },
		},
		handler: async (request, h) => {
			const { email, password } = request.payload;
			const user = await db("users").where({ email }).first();

			if (!user || !(await bcrypt.compare(password, user.password))) {
				return h.response({ error: "Invalid credentials" }).code(401);
			}

			return { token: generateToken(user.id) };
		},
	},
	{
		method: "POST",
		path: "/logout",
		options: {
			tags: ["api"],
			response: { schema: MessageResponseSchema },
		},
		handler: (request, h) => {
			const token = request.headers.authorization?.split(" ")[1];
			if (token) invalidatedTokens.add(token);
			return h.response({ message: "Logged out successfully" }).code(200);
		},
	},
];
