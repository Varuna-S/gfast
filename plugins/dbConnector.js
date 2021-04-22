const fastifyPlugin = require('fastify-plugin');
const config = require('config');
const mongoose = require('mongoose');

//db connector plugin
async function dbConnector (fastify, options, next) {
    try{
        const db = config.get('db');
        mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex :true})
            .then(() => fastify.log.info(`Connected to ${db}`));
    }
    catch(err)
    {
        fastify.log.info(err);
        fastify.log.info(`Error connecting to ${config.get('db')}`);
    }
}

// Wrapping a plugin function with fastify-plugin exposes the decorators    
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(dbConnector);