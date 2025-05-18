const Joi = require("joi");

const UserSchema = Joi.object({
	id: Joi.number().integer().required(),
	email: Joi.string().email().required(),
	name: Joi.string().required(),
	createdAt: Joi.date().required(),
	updatedAt: Joi.date().required(),
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
	userId: Joi.number().integer().allow(null),
}).label("Todo");

const TodoArraySchema = Joi.array()
	.items(TodoResponseSchema)
	.label("TodoArray");

const TodoCreatePayload = Joi.object({
	description: Joi.string().required(),
}).label("TodoCreatePayload");

const TodoUpdatePayload = Joi.object({
	description: Joi.string().optional(),
	state: Joi.string().valid("INCOMPLETE", "COMPLETE").optional(),
})
	.or("description", "state")
	.label("TodoUpdatePayload");

const UserCreatePayload = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	name: Joi.string().required(),
}).label("UserCreatePayload");

const UserUpdatePayload = Joi.object({
	email: Joi.string().email().optional(),
	password: Joi.string().optional(),
	name: Joi.string().optional(),
})
	.or("email", "password", "name")
	.label("UserUpdatePayload");

module.exports = {
	UserSchema,
	TokenResponseSchema,
	MessageResponseSchema,
	TodoResponseSchema,
	TodoArraySchema,
	TodoCreatePayload,
	TodoUpdatePayload,
	UserCreatePayload,
	UserUpdatePayload,
};
