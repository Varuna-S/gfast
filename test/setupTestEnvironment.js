const fastify = require('fastify');
const fp = require('fastify-plugin');
const app = require('../app');

module.exports = function setupTestEnvironment(){
    const server = fastify({});
    beforeAll(async () => {
        server.register(fp(app))
        await server.ready();
    });
    afterAll(async () => {
        await server.close()
    });
    return server;
}