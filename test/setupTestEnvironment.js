const fastify = require('fastify');
const fp = require('fastify-plugin');
const app = require('../app');

module.exports = function setupTestEnvironment(){
    const server = fastify({
        logger: true
    });
    beforeEach(async () => {
        server.register(fp(app))
        await server.ready();
    });
    afterEach(async () => {
        await server.close()
    });
    return server;
}