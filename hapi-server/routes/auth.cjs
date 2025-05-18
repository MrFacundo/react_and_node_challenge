const db = require("../db.cjs");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/helpers.cjs");
const { UserLoginPayload, TokenResponseSchema, MessageResponseSchema } = require("../schemas/index.cjs");
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
				payload: UserLoginPayload,
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
