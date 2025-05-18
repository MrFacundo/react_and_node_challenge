const todoRoutes = require("./todos.cjs");
const userRoutes = require("./users.cjs");
const authRoutes = require("./auth.cjs");

const baseRoute = {
	method: "GET",
	path: "/",
	options: {
		auth: false,
		response: {
			schema: require("../schemas/index.cjs").MessageResponseSchema,
		},
	},
	handler: () => ({ message: "Server is running!" }),
};

module.exports = [baseRoute, ...todoRoutes, ...userRoutes, ...authRoutes];
