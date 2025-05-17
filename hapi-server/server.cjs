const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const knex = require("knex");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Jwt = require("@hapi/jwt");
const bcrypt = require("bcrypt");
const Pack = require("./package.json");

const db = knex({
	client: "sqlite3",
	connection: { filename: "./dev.sqlite3" },
	useNullAsDefault: true,
});

const formatToLocalTimestamp = (date) => {
	const d = new Date(date);
	const pad = (n) => (n < 10 ? "0" + n : n);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
		d.getDate()
	)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const invalidatedTokens = new Set();

const init = async () => {
	const server = Hapi.server({
		port: 3000,
		host: "localhost",
		routes: {
			cors: {
				origin: ["http://localhost:5173"],
				additionalHeaders: ["Accept", "Content-Type"],
			},
		},
	});

	await server.register([
		inert,
		vision,
		{
			plugin: HapiSwagger,
			options: {
				info: {
					title: "Test API Documentation",
					version: Pack.version,
				},
				securityDefinitions: {
					jwt: {
						type: "apiKey",
						name: "Authorization",
						in: "header",
					},
				},
				security: [{ jwt: [] }],
			},
		},
		Jwt,
	]);

	server.auth.strategy("jwt_auth_strategy", "jwt", {
		keys: "your_secret_key",
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
			isValid: !invalidatedTokens.has(
				request.headers.authorization?.split(" ")[1]
			),
			credentials: { id: artifacts.decoded.payload.id },
		}),
	});

	server.auth.default("jwt_auth_strategy");

	const UserSchema = Joi.object({
		id: Joi.number().integer().required(),
		email: Joi.string().email().required(),
		name: Joi.string().required(),
		created_at: Joi.date().required(),
		updated_at: Joi.date().required(),
	}).label("User");

	const TokenResponseSchema = Joi.object({
		token: Joi.string().required(),
	}).label("TokenResponse");

	const MessageResponseSchema = Joi.object({
		message: Joi.string().required(),
	}).label("MessageResponse");

	const TodoResponseSchema = Joi.object({
		id: Joi.number().integer().required(),
		description: Joi.string().required(),
		state: Joi.string().valid("INCOMPLETE", "COMPLETE").required(),
		createdAt: Joi.date().required(),
		completedAt: Joi.date().allow(null).required(),
	}).label("Todo");

	const TodoArraySchema = Joi.array()
		.items(TodoResponseSchema)
		.label("TodoArray");

	const routes = [
		{
			method: "GET",
			path: "/",
			options: {
				auth: false,
				response: { schema: MessageResponseSchema },
			},
			handler: () => ({ message: "Server is running!" }),
		},
		{
			method: "POST",
			path: "/todos",
			options: {
				tags: ["api"],
				validate: {
					payload: Joi.object({
						description: Joi.string().required(),
					}).label("TodoCreatePayload"),
				},
				response: { schema: TodoResponseSchema },
			},
			handler: async (request, h) => {
				const { description } = request.payload;
				const [id] = await db("todos").insert({ description });
				const newTodo = await db("todos").where({ id }).first();
				return h.response(newTodo).code(201);
			},
		},
		{
			method: "GET",
			path: "/todos",
			options: {
				tags: ["api"],
				validate: {
					query: Joi.object({
						filter: Joi.string()
							.valid("ALL", "INCOMPLETE", "COMPLETE")
							.optional(),
						orderBy: Joi.string()
							.valid("DESCRIPTION", "CREATED_AT", "COMPLETED_AT")
							.optional(),
					}),
				},
				response: { schema: TodoArraySchema },
			},
			handler: async (request, h) => {
				const { filter = "ALL", orderBy = "CREATED_AT" } =
					request.query;
				let query = db("todos");

				if (filter !== "ALL") {
					query = query.where("state", filter);
				}

				const sortField = {
					DESCRIPTION: "description",
					CREATED_AT: "createdAt",
					COMPLETED_AT: "completedAt",
				}[orderBy];

				query = query.orderBy(sortField, "asc");
				return h.response(await query).code(200);
			},
		},
		{
			method: "PATCH",
			path: "/todo/{id}",
			options: {
				tags: ["api"],
				validate: {
					params: Joi.object({
						id: Joi.number().integer().required(),
					}),
					payload: Joi.object({
						description: Joi.string().optional(),
						state: Joi.string()
							.valid("INCOMPLETE", "COMPLETE")
							.optional(),
					})
						.or("description", "state")
						.label("TodoUpdatePayload"),
				},
				response: { schema: TodoResponseSchema, failAction: "log" },
			},
			handler: async (request, h) => {
				const { id } = request.params;
				const updates = request.payload;
				const todo = await db("todos").where({ id }).first();

				if (!todo) {
					return h
						.response({ error: "To-do item not found" })
						.code(404);
				}

				if (updates.description && todo.state === "COMPLETE") {
					return h
						.response({
							error: "Cannot modify description of a completed item",
						})
						.code(400);
				}

				if (
					updates.state === "INCOMPLETE" &&
					todo.state === "COMPLETE"
				) {
					updates.completedAt = null;
				} else if (
					updates.state === "COMPLETE" &&
					todo.state === "INCOMPLETE"
				) {
					updates.completedAt = formatToLocalTimestamp(new Date());
				}

				await db("todos").where({ id }).update(updates);
				return h
					.response(await db("todos").where({ id }).first())
					.code(200);
			},
		},
		{
			method: "DELETE",
			path: "/todo/{id}",
			options: {
				tags: ["api"],
				validate: {
					params: Joi.object({
						id: Joi.number().integer().required(),
					}),
				},
				response: { schema: Joi.any().empty() },
			},
			handler: async (request, h) => {
				const { id } = request.params;
				const todo = await db("todos").where({ id }).first();

				if (!todo) {
					return h
						.response({ error: "To-do item not found" })
						.code(404);
				}

				await db("todos").where({ id }).del();
				return h.response().code(204);
			},
		},
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
					return h
						.response({ error: "Invalid credentials" })
						.code(401);
				}

				return {
					token: Jwt.token.generate(
						{
							id: user.id,
							aud: "urn:audience:test",
							iss: "urn:issuer:test",
						},
						{ key: "your_secret_key", algorithm: "HS256" }
					),
				};
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
				return h
					.response({ message: "Logged out successfully" })
					.code(200);
			},
		},
		{
			method: "POST",
			path: "/users",
			options: {
				tags: ["api"],
				auth: false,
				plugins: { "hapi-swagger": { security: [] } },
				validate: {
					payload: Joi.object({
						email: Joi.string().email().required(),
						password: Joi.string().required(),
						name: Joi.string().required(),
					}).label("UserCreatePayload"),
				},
				response: { schema: TokenResponseSchema },
			},
			handler: async (request, h) => {
				const { email, password, name } = request.payload;
				const existingUser = await db("users").where({ email }).first();

				if (existingUser) {
					return h
						.response({ error: "Email already in use" })
						.code(400);
				}

				const hashedPassword = await bcrypt.hash(password, 10);
				const [id] = await db("users").insert({
					email,
					password: hashedPassword,
					name,
				});

				return {
					token: Jwt.token.generate(
						{
							id,
							aud: "urn:audience:test",
							iss: "urn:issuer:test",
						},
						{ key: "your_secret_key", algorithm: "HS256" }
					),
				};
			},
		},
		{
			method: "GET",
			path: "/me",
			options: {
				tags: ["api"],
				response: { schema: UserSchema },
			},
			handler: async (request, h) => {
				const userId = request.auth.credentials.id;
				const user = await db("users")
					.where({ id: userId })
					.select("id", "email", "name", "created_at", "updated_at")
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
				tags: ["api"],
				validate: {
					payload: Joi.object({
						email: Joi.string().email().optional(),
						password: Joi.string().optional(),
						name: Joi.string().optional(),
					})
						.or("email", "password", "name")
						.label("UserUpdatePayload"),
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
					.select("id", "email", "name", "created_at", "updated_at")
					.first();
			},
		},
	];

	server.route(routes);

	server.ext("onPreResponse", (request, h) => {
		const response = request.response;
		if (response.isBoom && response.output.statusCode === 400) {
			return h
				.response({
					statusCode: 400,
					error: "Bad Request",
					message: response.message,
					validation: response.output.payload.validation,
				})
				.code(400);
		}
		return h.continue;
	});

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
