const fastifyPlugin = require('fastify-plugin');
const fastifyAuth = require('fastify-auth');

async function fastifyauth (fastify, options, next) {
    fastify.register(fastifyAuth);
}

module.exports = fastifyPlugin(fastifyauth);