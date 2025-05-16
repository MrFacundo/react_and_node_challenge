import api from '@hapi/hapi';
import Joi from "joi";
import knex from 'knex';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    useNullAsDefault: true
});

const init = async () => {
    const server = api.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['http://localhost:5173'], // Allow requests from the React app
                additionalHeaders: ['Accept', 'Content-Type']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return { message: 'Server is running!' };
        }
    });

    server.route({
        method: 'POST',
        path: '/todos',
        options: {
            validate: {
                payload: Joi.object({
                    description: Joi.string().required()
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
            validate: {
                query: Joi.object({
                    filter: Joi.string().valid('INCOMPLETE', 'COMPLETE').optional(),
                    orderBy: Joi.string().valid('asc', 'desc').optional()
                })
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
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                }),
                payload: Joi.object({
                    description: Joi.string().optional(),
                    state: Joi.string().valid('INCOMPLETE', 'COMPLETE').optional()
                }).or('description', 'state')
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
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required()
                })
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

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();