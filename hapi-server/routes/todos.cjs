const db = require("../db.cjs");
const { formatToLocalTimestamp } = require("../utils/helpers.cjs");
const {
	TodoResponseSchema,
	TodoArraySchema,
	TodoCreatePayload,
	TodoUpdatePayload,
} = require("../schemas/index.cjs");
const Joi = require("joi");

module.exports = [
	{
		method: "POST",
		path: "/todos",
		options: {
			tags: ["api"],
			validate: {
				payload: TodoCreatePayload,
			},
			response: { schema: TodoResponseSchema },
		},
		handler: async (request, h) => {
			const { description } = request.payload;
			const userId = request.auth.credentials.id;
			const [id] = await db("todos").insert({ description, userId });
			const newTodo = await db("todos").where({ id, userId }).first();
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
			const { filter = "ALL", orderBy = "CREATED_AT" } = request.query;
			const userId = request.auth.credentials.id;
			let query = db("todos").where({ userId });

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
				params: Joi.object({ id: Joi.number().integer().required() }),
				payload: TodoUpdatePayload,
			},
			response: { schema: TodoResponseSchema, failAction: "log" },
		},
		handler: async (request, h) => {
			const { id } = request.params;
			const userId = request.auth.credentials.id;
			const updates = request.payload;
			const todo = await db("todos").where({ id, userId }).first();

			if (!todo) {
				return h.response({ error: "To-do item not found" }).code(404);
			}

			if (updates.description && todo.state === "COMPLETE") {
				return h
					.response({
						error: "Cannot modify description of a completed item",
					})
					.code(400);
			}

			if (updates.state === "INCOMPLETE" && todo.state === "COMPLETE") {
				updates.completedAt = null;
			} else if (
				updates.state === "COMPLETE" &&
				todo.state === "INCOMPLETE"
			) {
				updates.completedAt = formatToLocalTimestamp(new Date());
			}

			await db("todos").where({ id, userId }).update(updates);
			return h
				.response(await db("todos").where({ id, userId }).first())
				.code(200);
		},
	},
	{
		method: "DELETE",
		path: "/todo/{id}",
		options: {
			tags: ["api"],
			validate: {
				params: Joi.object({ id: Joi.number().integer().required() }),
			},
			response: { schema: Joi.any().empty() },
		},
		handler: async (request, h) => {
			const { id } = request.params;
			const userId = request.auth.credentials.id;
			const todo = await db("todos").where({ id, userId }).first();

			if (!todo) {
				return h.response({ error: "To-do item not found" }).code(404);
			}

			await db("todos").where({ id, userId }).del();
			return h.response().code(204);
		},
	},
];
