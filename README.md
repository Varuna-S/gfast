## Gfast 
Gfast is the game information NodeJs application, exposes API endpoints for CRUD operations on game information, this application use fastify framework

users can sign up via - POST /api/users

CRUD operations can be done via - /api/games

any user can perform GET on the games

but only logged in admin users can CREATE UPDATE PATCH DELETE the games

user can be admin by manually setting isAdmin property in the database to true

user can log in via the - POST /api/authn 

logged in user can send a - GET /api/users/me - to get the details of oneself

admin users can GET /api/users to get the details all the users signed up

## API routes
    "/api/authn POST"        -  login
    "/api/users POST"        -  sign up
    "/api/users/me GET"       -  current user details
    "/api/users GET"          -  get all users, admin privileges required for this endpoint
    "/api/games GET"          -  get all games in the database
    "/api/games/:id GET"      -  get the info of game with id - admin required 
    "/api/games POST"         -  insert game information into the database - admin required 
    "/api/games/:id PUT"      -  update game - admin required
    "/api/games/:id PATCH"    -  partial update on game - admin required
    "/api/games/:id DELETE"   -  delete the game with id - admin required

## Core Dependencies
    NodeJs framework    - fastify
    Input validations   - fastify internal ajv and Joi
    Testing framework   - jest
    Database            - MongoDB
    Authorization agent - Open Policy Agent

## Installation and Running
    Prerequisites - NodeJs, MongoDB, Docker, Postman, MongoDB compass, Git 

    Setting up node app
        "git clone https://github.com/Varuna-S/gfast.git"

        "cd gfast"

        "npm install" - (install all dependencies in package.json)

        "$env:gfast_jwtPrivateKey='<private key here>'" - (setting environment variable private key)

        "npm run dev" - (to run the application)

        open postman and import "gfast.postman_collection.json" file to the collections

        (above import creates a collection called gfast, this collection contains requests for the CRUD, signup and login)

        import "gfast.postman_environment.json" file to the collections

        (above import creates a environment called gfast, the authentication token is set in the x-auth-token field of this environment)

    Setting up Open Policy Agent on Docker

        "docker run -p 8181:8181 openpolicyagent/opa run --server --log-level debug"   (setting up OPA in docker container)

        open postman and import "OPA.postman_collection.json" file to the collections

        (above import creates a collection called OPA)

        send the "load the policy" request, policy is in the body of the request

    Sequence of requests

        signup request is inside /api/users POST folder (use MongoDB compass to set isAdmin property of the user to true)

        login request  is inside /api/authn login (this sets the environment variable in postman)

        insert game details request in inside /api/games POST folder  

        any other request under the collection

    Running tests

        "$env:NODE_ENV='test'" - set the node environment to test

        "npm test" - to the run the tests
