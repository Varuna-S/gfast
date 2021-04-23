const {User} = require('../../../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {getMeOptions, getOptions, postOptions} = require('../../../routeOptions/users');

async function routes(fastify, options){

    //setting the authentication(authn) and authorization(authz) decorators for the route options
    // getMeOptions.preHandler = fastify.auth([fastify.authn],{relation: 'and'});
    // getOptions.preHandler = fastify.auth([fastify.authn, fastify.authz],{relation: 'and'});

    //user details of the current logged in user
    fastify.get('/me', getMeOptions, async (request, reply) => {
      try{
        let user = await User.findOne({_id: request.user._id}).select('-password -__v');
        reply.send(user);
      }
      catch(err){
        throw new Error(err.message);
      } 
      });
    
    //get all users by admin only
    fastify.get('/', getOptions, async (request, reply) => {
      try {
        const users = await User
        .find()
        .sort({name: 1, isAdmin:1})
        .select('-password -__v');
      reply.send(users);
      }
      catch(err){
        throw new Error(err.message);
      }
    });

    //sign up 
    fastify.post('/', postOptions, async (request, reply) => {
      try{
        let user = await User.findOne({email: request.body.email});
        if(user)
          return reply.status(400).send("User already registered with this email");
        user = new User(_.pick(request.body, ['name','email','password']));
        const salt = await bcrypt.genSalt(10);
        user.password= await bcrypt.hash(user.password, salt);
        await user.save();
        reply.send(_.pick(user, ['_id', 'name','email']));
      }
      catch(err){
        throw new Error(err.message);
      }
    });
}

module.exports = routes;