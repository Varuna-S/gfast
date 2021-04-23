const setupTestEnvironment= require('../test/setupTestEnvironment');
const mongoose = require('mongoose');
const {Game} = require('../models/game');
const {User} = require('../models/user');

const fastify = setupTestEnvironment();

describe('/api/games', () => {
    describe('GET', () => {
        let game;
        let token;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name:"Nioh 2",
                genre:"Action role playing",  
                developerName:"Team Ninja", 
                publisherName:"Sony Interactive Entertainment", 
                gameEngine:"Team Ninja proprietary engine ",
                platform:"PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate:"2020-10-13" 
            });
            await game.save(); 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should return all the games', async () => {
            const response = await fastify.inject({
                url: '/api/games',
                method: 'GET'
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload.some(game => game.name === 'Nioh 2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        let game;
        let token;
        let gameId;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name:"Nioh 2",
                genre:"Action role playing",  
                developerName:"Team Ninja", 
                publisherName:"Sony Interactive Entertainment", 
                gameEngine:"Team Ninja proprietary engine ",
                platform:"PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate:"2020-10-13" 
            });
            await game.save();
            gameId = game._id; 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should return game if id is valid', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'GET'
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('name', game.name);
        });
        it('should return 404 if game not found with id', async () => {
            gameId = new mongoose.Types.ObjectId();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'GET'
            });
            expect(response.statusCode).toBe(404);
        });
    });

    describe('POST /', () => {
        let game;
        let token;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name: "Nioh 2",
                genre: "Action role playing",  
                developerName: "Team Ninja", 
                publisherName: "Sony Interactive Entertainment", 
                gameEngine: "Team Ninja proprietary engine ",
                platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate: "2021-09-13" 
            }); 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should input game if request is valid', async () => {
            const response = await fastify.inject({
                url: `/api/games/`,
                method: 'POST',
                payload: {
                    name: "Nioh 2",
                    genre: "Action role playing",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja proprietary engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-04-13" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('name', game.name);
        });
        it('should return 401 if no token', async () => {
            const response = await fastify.inject({
                url: `/api/games/`,
                method: 'POST',
                payload: {
                    name: "Nioh 2",
                    genre: "Action role playing",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja proprietary engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-04-13" 
                }
            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 403 if user not admin', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: `/api/games/`,
                method: 'POST',
                payload: {
                    name: "Nioh 2",
                    genre: "Action role playing",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja proprietary engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-04-13" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(403);
        });
        it('should return 400 if date is not in the format "YYYY-MM-DD"', async () => {
            const response = await fastify.inject({
                url: `/api/games/`,
                method: 'POST',
                payload: {
                    name: "Nioh 2",
                    genre: "Action role playing",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja proprietary engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "13-04-2020" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(400);
        });
    });

    describe('PUT /:id', () => {
        let game;
        let token;
        let gameId;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name: "Nioh 2",
                genre: "Action role playing",  
                developerName: "Team Ninja", 
                publisherName: "Sony Interactive Entertainment", 
                gameEngine: "Team Ninja proprietary engine ",
                platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate: "2021-03-13" 
            });
            await game.save();
            gameId = game._id; 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should update game if request is valid', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PUT',
                payload: {
                    name: "Nioh 2",
                    genre: "Action RPG",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-03-13" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('name', game.name);
        });
        it('should return 401 if no token', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PUT',
                payload: {
                    name: "Nioh 2",
                    genre: "Action RPG",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-03-13" 
                }    
            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 403 if user not admin', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PUT',
                payload: {
                    name: "Nioh 2",
                    genre: "Action RPG",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-03-13" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(403);
        });
        it('should return 404 if no game found with id', async () => {
            gameId = mongoose.Types.ObjectId();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PUT',
                payload: {
                    name: "Nioh 2",
                    genre: "Action RPG",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "2021-03-13" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if date is not in the format "YYYY-MM-DD"', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PUT',
                payload: {
                    name: "Nioh 2",
                    genre: "Action RPG",  
                    developerName: "Team Ninja", 
                    publisherName: "Sony Interactive Entertainment", 
                    gameEngine: "Team Ninja engine ",
                    platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                    releaseDate: "13-02-2020" 
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE /:id', () => {
        let game;
        let token;
        let gameId;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name: "Nioh 2",
                genre: "Action role playing",  
                developerName: "Team Ninja", 
                publisherName: "Sony Interactive Entertainment", 
                gameEngine: "Team Ninja proprietary engine ",
                platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate: "2021-03-13" 
            });
            await game.save();
            gameId = game._id; 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should delete game if request is valid', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('name', game.name);
        });
        it('should return 401 if no token', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'DELETE'   
            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 403 if user not admin', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(403);
        });
        it('should return 404 if no game found with id', async () => {
            gameId = mongoose.Types.ObjectId();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if date is not in the format "YYYY-MM-DD"', async () => {
            gameId = 'asd';
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(400);
        });
    });

    describe('PATCH /:id', () => {
        let game;
        let token;
        let gameId;
        beforeEach(async () => {
            if(process.env.NODE_ENV === 'test')
            {
                await Game.deleteMany({});
            }
            token = new User({isAdmin:true}).generateAuthToken();
            game = new Game({
                name: "Nioh 2",
                genre: "Action RPG",  
                developerName: "Team Ninja", 
                publisherName: "Sony Interactive Entertainment", 
                gameEngine: "Team Ninja proprietary engine ",
                platform: "PlayStation 4, Microsoft Windows, PlayStation 5",
                releaseDate: "2021-03-13" 
            });
            await game.save();
            gameId = game._id; 
        });
        afterEach(async () => {
            await Game.deleteMany({});
        });
        it('should update game if request is valid', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PATCH',
                payload: {
                    genre: "Action Role Playing",   
                    gameEngine: "Team Ninja engine ",
                },
                headers: {
                    'x-auth-token': token
                }
            });
            const payload = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(payload).toHaveProperty('genre', "Action Role Playing");
        });
        it('should return 401 if no token', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PATCH',
                payload: {
                    genre: "Action Role Playing",   
                    gameEngine: "Team Ninja engine ",
                }    
            });
            expect(response.statusCode).toBe(401);
        });
        it('should return 403 if user not admin', async () => {
            token = new User({isAdmin:false}).generateAuthToken();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PATCH',
                payload: {
                    genre: "Action Role Playing",   
                    gameEngine: "Team Ninja engine ",
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(403);
        });
        it('should return 404 if no game found with id', async () => {
            gameId = mongoose.Types.ObjectId();
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PATCH',
                payload: {
                    genre: "Action Role Playing",   
                    gameEngine: "Team Ninja engine ",
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(404);
        });
        it('should return 400 if date is not in the format "YYYY-MM-DD"', async () => {
            const response = await fastify.inject({
                url: `/api/games/${gameId}`,
                method: 'PATCH',
                payload: {
                    genre: "Action Role Playing",   
                    gameEngine: "Team Ninja engine ",
                    releaseDate: "13-02-2020"
                },
                headers: {
                    'x-auth-token': token
                }
            });
            expect(response.statusCode).toBe(400);
        });
    });
    
});

