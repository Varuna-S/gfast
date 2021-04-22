const fastifyPlugin = require('fastify-plugin');
const jwt = require('jsonwebtoken');
const config = require('config');
var tiny = require('tiny-json-http')

module.exports = fastifyPlugin( function (fastify, options, next) {
  //avoids mutation of the request object after it has already been instantiated
  fastify.decorateRequest('user', null);

  //authentication decorator
  fastify.decorate("authn", function (request, reply, done) {
  
  const token = request.headers['x-auth-token'];
  if(!token)
      return reply.status(401).send({message:'Access Denied. No valid token'});
  try{
  const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  request.user = decoded;
  done();
  }
  catch(ex)
  {
      done(ex);
      return reply.status(401).send('Invalid token');
      
  }
  });

  //authorization decorator
  fastify.decorate("authz", async function (request, reply, done) {
    const token = request.headers['x-auth-token'];
    const apiPath = request.routerPath;
    const method = request.method;
    let result;
    let response;
    //options for the policy eval http request
    const options = {
      url:'http://localhost:8181/v1/data/policy',
      data: {
          "input": {
              "api": apiPath,
              "jwt": token,
              "method": method
          }
      },
      headers:{
          'Content-Type': 'application/json'
      }
    }
    //function to request the OPA api endpoints  
    async function evaluate(){
        try {
          response = await tiny.post(options);          
        }
        catch(err){
            done(new Error("Cannot connect to policy agent"));
        }
        if(response.body.result === undefined)
          done(new Error("No response from policy agent, policy might not have been loaded"));
        result = response.body.result.allow;
    }
    await evaluate();
    if(!result)
      return reply.status(403).send({message:"Unauthorized Request - Forbidden"});
  });
  next();
});