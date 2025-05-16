const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const knex = require('knex');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package.json');

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    useNullAsDefault: true
});

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'],
                additionalHeaders: ['Accept', 'Content-Type']
            }
        }
    });

    const swaggerOptions = {
        info: {
                title: 'Test API Documentation',
                version: Pack.version,
            },
        };

    await server.register([
        inert,
        vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route({
        method: 'GET',
        path: '/',
        options: {
            response: {
                schema: Joi.object({
                    message: Joi.string().required()
                })
            }
        },
        handler: () => {
            return { message: 'Server is running!' };
        }
    });

    server.route({
        method: 'POST',
        path: '/todos',
        options: {
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    description: Joi.string().required()
                })
            },
            response: {
                schema: Joi.object({
                    id: Joi.number().integer().required(),
                    description: Joi.string().required(),
                    state: Joi.string().valid('INCOMPLETE', 'COMPLETE').required(),
                    createdAt: Joi.date().required(),
                    completedAt: Joi.date().allow(null).required()
                })
            }
        },
        handler: async (request, h) => {
            const { description } = request.payload;
            const [id] = await db('todos').insert({ description });
            const newTodo = await db('todos').where({ id }).first();
            return h.response(newTodo).code(201);
        }
    });

    server.route({
        method: 'GET',
        path: '/todos',
        options: {
            tags: ['api'],
            validate: {
                query: Joi.object({
                    filter: Joi.string().valid('INCOMPLETE', 'COMPLETE').optional(),
                    orderBy: Joi.string().valid('asc', 'desc').optional()
                })
            },
            response: {
                schema: Joi.array().items(
                    Joi.object({
                        id: Joi.number().integer().required(),
                        description: Joi.string().required(),
                        state: Joi.string().valid('INCOMPLETE', 'COMPLETE').required(),
                        createdAt: Joi.date().required(),
                        completedAt: Joi.date().allow(null).required()
                    })
                )
            }
        },
        handler: async (request, h) => {
            const { filter, orderBy } = request.query;
            let query = db('todos');

            if (filter) {
                query = query.where('state', filter);
            }

            const sortField = orderBy === 'asc' || orderBy === 'desc' ? 'description' : 'createdAt';
            const sortOrder = orderBy || 'asc';
            query = query.orderBy(sortField, sortOrder);

            const todos = await query;
            return h.response(todos).code(200);
        }
    });

    server.route({
        method: 'PATCH',
        path: '/todo/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    description: Joi.string().optional(),
                    state: Joi.string().valid('INCOMPLETE', 'COMPLETE').optional()
                }).or('description', 'state')
            },
            response: {
                schema: Joi.object({
                    id: Joi.number().integer().required(),
                    description: Joi.string().required(),
                    state: Joi.string().valid('INCOMPLETE', 'COMPLETE').required(),
                    createdAt: Joi.date().required(),
                    completedAt: Joi.date().allow(null).required()
                }),
                failAction: 'log'
            }
        },
        handler: async (request, h) => {
            const { id } = request.params;
            const updates = request.payload;

            const todo = await db('todos').where({ id }).first();
            if (!todo) {
                return h.response({ error: 'To-do item not found' }).code(404);
            }

            if (updates.state === 'INCOMPLETE' && todo.state === 'COMPLETE') {
                updates.completedAt = null;
            } else if (updates.state === 'COMPLETE' && todo.state === 'INCOMPLETE') {
                updates.completedAt = new Date();
            }

            await db('todos').where({ id }).update(updates);
            const updatedTodo = await db('todos').where({ id }).first();
            return h.response(updatedTodo).code(200);
        }
    });

    server.route({
        method: 'DELETE',
        path: '/todo/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
            },
            response: {
                schema: Joi.any().empty()
            }
        },
        handler: async (request, h) => {
            const { id } = request.params;

            const todo = await db('todos').where({ id }).first();
            if (!todo) {
                return h.response({ error: 'To-do item not found' }).code(404);
            }

            await db('todos').where({ id }).del();
            return h.response().code(204);
        }
    });

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;
        if (response.isBoom && response.output.statusCode === 400) {
            return h.response({
                statusCode: 400,
                error: 'Bad Request',
                message: response.message,
                validation: response.output.payload.validation
            }).code(400);
        }
        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();