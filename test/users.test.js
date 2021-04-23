const setupTestEnvironment= require('../test/setupTestEnvironment');
const {User} = require('../models/user');

const fastify = setupTestEnvironment();

describe('/api/users', () => {
    describe('GET /', () => {
        let user;
        let token;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await User.deleteMany({});
            }
            user = new User({
                name:"varuna",
                email:"varuna@gmail.com",
                password:"spassword",
                isAdmin: true
            });
            token = new User({isAdmin:true}).generateAuthToken();
            await user.save(); 
        });
        afterEach(async () => {
            await User.deleteMany({});
        });
        it('should return all the users', async () => {
            const response = await fastify.inject({
                url: '/api/users',
                method: 'GET',
                headers:{
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload.some(user => user.name === 'varuna')).toBeTruthy();
        });
        it('should return 401 if no valid token', async () => {
            const response = await fastify.inject({
                url: '/api/users',
                method: 'GET',

            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 403 if user not admin', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: '/api/users',
                method: 'GET',
                headers:{
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(403);
        });
    });

    describe('GET /me', () => {
        let user;
        let token;
        let userId;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await User.deleteMany({});
            }
            user = new User({
                name:"varuna",
                email:"varuna@gmail.com",
                password:"spassword",
                isAdmin: true
            });
            await user.save();
            userId = user._id;
            token = new User({_id: userId ,isAdmin:true}).generateAuthToken();
 
        });
        afterEach(async () => {
            await User.deleteMany({});
        });
        it('should return all the users', async () => {
            const response = await fastify.inject({
                url: '/api/users/me',
                method: 'GET',
                headers:{
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
        });
        it('should return 401 if no valid token', async () => {
            const response = await fastify.inject({
                url: '/api/users/me',
                method: 'GET',
            });
            expect(response.statusCode).toBe(401);
        });
    });

    //signup
    describe('POST /', () => {
        let user;
        let token;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await User.deleteMany({});
            }
            user = new User({
                name:"nonadmin",
                email:"nonadmin@gmail.com",
                password:"spassword"
            });
            await user.save(); 
        });
        afterEach(async () => {
            await User.deleteMany({});
        });
        it('should return all the users', async () => {
            const response = await fastify.inject({
                url: '/api/users',
                method: 'POST',
                payload:{
                    name:"varuna",
                    email:"varuna@gmail.com",
                    password:"spassword"
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('name', 'varuna');
        });
        it('should return 400 if no payload', async () => {
            const response = await fastify.inject({
                url: '/api/users',
                method: 'POST'
            });
            expect(response.statusCode).toBe(400);
        });
        it('should return 400 if email has already been registered', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: '/api/users',
                method: 'POST',
                payload:{
                    name:"nonadmin",
                    email:"nonadmin@gmail.com",
                    password:"spassword"
                },
                headers:{
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(400);
        });
    });
});