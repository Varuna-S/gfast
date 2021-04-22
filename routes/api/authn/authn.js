const bcrypt = require('bcryptjs');
const {User} = require('../../../models/user');
const _ = require('lodash');


async function routes(fastify, options){
    //Login
    fastify.post('/', async (request, reply) => {
        try{
            const user = await User.findOne({email: request.body.email});
            if(!user)
            return response.status(401).send('Invalid email or password');
            const isPasswordValid= await bcrypt.compare(request.body.password, user.password);
            if(!isPasswordValid)
                return response.status(401).send('Invalid email or password');
            const token = user.generateAuthToken();
            reply.header('x-auth-token', token).send(_.pick(user, ['id','name','email']));
        }
        catch(err){
            throw new Error(err.message);
        }
    });
    
}
    
module.exports = routes;