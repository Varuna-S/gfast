'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const config = require('config')

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  if(!config.get('jwtPrivateKey'))
      throw new Error("FATAL ERROR - jwtPrivateKey not defined");
  if(!config.get('db'))
      throw new Error("FATAL ERROR - database connection string not defined");
  
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
