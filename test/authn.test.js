const setupTestEnvironment= require('../test/setupTestEnvironment');
const {User} = require('../models/user');
const bcrypt = require('bcrypt');

const fastify = setupTestEnvironment();

describe('/api/authn', () => {
    describe('POST /', () => {
        let user;
        let token;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await User.deleteMany({});
            }
            const password = 'spassword';
            salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = new User({
                name:"varuna",
                email:"varuna@gmail.com",
                password:hashedPassword
            });
            await user.save(); 
        });
        afterEach(async () => {
            await User.deleteMany({});
        });
        it('should login if email and password are verified', async () => {
            const response = await fastify.inject({
                url: '/api/authn',
                method: 'POST',
                payload:{
                    email:"varuna@gmail.com",
                    password:"spassword"
                }
            });
            // const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            // expect(payload).toHaveProperty('name', 'varuna');
        });
        it('should return 401 email doesnt exist', async () => {
            const response = await fastify.inject({
                url: '/api/authn',
                method: 'POST',
                payload:{
                    email:"nonexistant@gmail.com",
                    password:"spassword"
                }
            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 401 if password is wrong', async () => {
            const response = await fastify.inject({
                url: '/api/authn',
                method: 'POST',
                payload:{
                    email:"varuna@gmail.com",
                    password:"wrongpassword"
                }
            });
            expect(response.statusCode).toBe(401);
        });
    });
});