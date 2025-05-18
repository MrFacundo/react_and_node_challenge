const Hapi = require("@hapi/hapi");
const plugins = require("./plugins.cjs");
const routes = require("./routes/index.cjs");
const { setupAuth } = require("./auth.cjs");
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        additionalHeaders: ["Accept", "Content-Type"],
      },
    },
  });

  // Register plugins
  await server.register(plugins);

  // Setup auth strategy
  setupAuth(server);

  // Register routes
  server.route(routes);

  // Register error handling extension
  server.ext("onPreResponse", require("./extensions/errorHandler.cjs"));

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
