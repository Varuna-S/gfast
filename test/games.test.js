const setupTestEnvironment= require('../test/setupTestEnvironment');

const fastify = setupTestEnvironment();

it('should return 200', async () => {
    const response = await fastify.inject({
        url: '/api/games',
        method: 'GET'
    });
    expect(response.statusCode).toBe(200);
});
