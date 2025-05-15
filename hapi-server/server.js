import api from '@hapi/hapi';
import joi from "joi"; // should be capitalized

var variable = 'Hello, Hapi!';

const init = async () => {
    const server = api.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return { message: 'Server is running!' };
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();