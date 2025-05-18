const db = require("../db.cjs");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/helpers.cjs");
const {
	UserSchema,
	UserCreatePayload,
	UserUpdatePayload,
	TokenResponseSchema,
} = require("../schemas/index.cjs");

module.exports = [
	{
		method: "POST",
		path: "/users",
		options: {
			description: "Creates a new user and returns a credential",
			tags: ["api"],
			auth: false,
			plugins: { "hapi-swagger": { security: [] } },
			validate: {
				payload: UserCreatePayload,
			},
			response: { schema: TokenResponseSchema },
		},
		handler: async (request, h) => {
			const { email, password, name } = request.payload;
			const existingUser = await db("users").where({ email }).first();

			if (existingUser) {
				return h.response({ error: "Email already in use" }).code(400);
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const [id] = await db("users").insert({
				email,
				password: hashedPassword,
				name,
			});

			return { token: generateToken(id) };
		},
	},
	{
		method: "GET",
		path: "/me",
		options: {
			description: "Returns the details of the authenticated user",
			tags: ["api"],
			plugins: { "hapi-swagger": { security: [{ jwt: [] }] } },
			response: { schema: UserSchema },
		},
		handler: async (request, h) => {
			const userId = request.auth.credentials.id;
			const user = await db("users")
				.where({ id: userId })
				.select("id", "email", "name", "createdAt", "updatedAt")
				.first();

			if (!user) {
				return h.response({ error: "User not found" }).code(404);
			}

			return user;
		},
	},
	{
		method: "PATCH",
		path: "/me",
		options: {
			description: "Updates the details of the authenticated user",
			tags: ["api"],
			validate: {
				payload: UserUpdatePayload,
			},
			response: { schema: UserSchema },
		},
		handler: async (request, h) => {
			const updates = { ...request.payload };
			const userId = request.auth.credentials.id;

			if (updates.password) {
				updates.password = await bcrypt.hash(updates.password, 10);
			}

			await db("users").where({ id: userId }).update(updates);
			return await db("users")
				.where({ id: userId })
				.select("id", "email", "name", "createdAt", "updatedAt")
				.first();
		},
	},
];
