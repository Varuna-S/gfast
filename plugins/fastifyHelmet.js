const fastifyPlugin = require('fastify-plugin');
const helmet = require('fastify-helmet');

async function fastifyHelmet (fastify, options, next) {
    fastify.register(helmet);
}

module.exports = fastifyPlugin(fastifyHelmet);