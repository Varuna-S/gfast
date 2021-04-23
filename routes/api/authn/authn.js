const bcrypt = require('bcrypt');
const {User} = require('../../../models/user');
const _ = require('lodash');
const {loginOptions} = require('../../../routeOptions/authn');

async function routes(fastify, options){
    //Login
    fastify.post('/', loginOptions, async (request, reply) => {
        try{
            const user = await User.findOne({email: request.body.email});
            if(!user)
            return reply.status(401).send('Invalid email or password');
            const isPasswordValid= await bcrypt.compare(request.body.password, user.password);
            if(!isPasswordValid)
                return reply.status(401).send('Invalid email or password');
            const token = user.generateAuthToken();
            reply.header('x-auth-token', token).send(_.pick(user, ['id','name','email']));
        }
        catch(err){
            request.log.info(err);
            throw new Error(err.message);
        }
    });
    
}
    
module.exports = routes;