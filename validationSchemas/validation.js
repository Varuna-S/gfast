const Joi = require('joi').extend(require('@joi/date'));
Joi.objectId = require('joi-objectid')(Joi);

gameInputProperties = {
    name: {type: 'string', minLength:1, maxLength: 150},
    genre: {type: 'string', minLength:1, maxLength: 150},
    developerName:{type: 'string', minLength:1, maxLength: 150},
    publisherName:{type: 'string', minLength:1, maxLength: 150},
    gameEngine:{type: 'string', minLength:1, maxLength: 100},
    platform:{type: 'string', minLength:1, maxLength: 175},
    releaseDate:{type: 'string', format: 'date'}
};

const signupBodySchema = {
    type: 'object',
    properties: {
        name:{type:'string', minLength:3, maxLength:50},
        email:{type:'string', format: 'email',minLength:6, maxLength:255},
        password:{type:'string', minLength:8, maxLength:255}
    }
}

//Joi schema for validating id in params along with body as well
const paramsSchema = {
        id: Joi.objectId().required()  
}
const requestBodyJoiSchema = {
    name: Joi.string().min(1).max(150).required(),
    genre: Joi.string().min(1).max(150).required(),
    developerName: Joi.string().min(1).max(150).required(),
    publisherName: Joi.string().min(1).max(150).required(),
    gameEngine: Joi.string().min(1).max(100).required(),
    platform: Joi.string().min(1).max(175).required(),
    releaseDate: Joi.date().format('YYYY-MM-DD').utc().max('now').required()
}
const patchRequestBodyJoiSchema = {
    name: Joi.string().min(1).max(150),
    genre: Joi.string().min(1).max(150),
    developerName: Joi.string().min(1).max(150),
    publisherName: Joi.string().min(1).max(150),
    gameEngine: Joi.string().min(1).max(100),
    platform: Joi.string().min(1).max(175),
    releaseDate: Joi.date().format('YYYY-MM-DD').utc().max('now')
}

//input validation schema for the routes and their serialization output schema
const getRequestSchema = {
    params: Joi.object().keys(paramsSchema).required(),
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type:'string'},
                ...gameInputProperties,
                __v:{type: 'number'}
            }
        } 
    }
}
const postRequestSchema = {
    body: Joi.object().keys(requestBodyJoiSchema).required(),
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type:'string'},
                ...gameInputProperties,
                __v:{type: 'number'}
            }
        } 
    }
}
const  putRequestSchema = {
    body: Joi.object().keys(requestBodyJoiSchema).required(),
    params : Joi.object().keys(paramsSchema).required(),
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type:'string'},
                ...gameInputProperties,
                __v:{type: 'number'}
            }
        } 
    }
}
const  patchRequestSchema ={
    body: Joi.object().keys(patchRequestBodyJoiSchema).required(),
    params : Joi.object().keys(paramsSchema).required(),
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type:'string'},
                ...gameInputProperties,
                __v:{type: 'number'}
            }
        } 
    }
}
const  deleteRequestSchema ={
    params : Joi.object().keys(paramsSchema).required(),
    response: {
        200: {
            type: 'object',
            properties: {
                _id: { type:'string'},
                ...gameInputProperties,
                __v:{type: 'number'}
            }
        } 
    }
}
const signupSchema = {
    body: signupBodySchema,
    response: {
        200: {
            type: 'object',
            properties: { 
                _id: { type: 'string'},
                name:{ type: 'string'},
                email: { type: 'string', format: 'email'}
            }
        }
    }
}
const getUsersSchema = {
    response: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties:{
                    _id: { type: 'string'},
                    name:{ type: 'string'},
                    email: { type: 'string'},
                    isAdmin:{type: 'boolean'}
                }
            } 
        }
    }
}
const getMeSchema = {
    response: {
        200: {
            type: 'object',
            properties:{
                _id: { type: 'string'},
                name:{ type: 'string'},
                email: { type: 'string'},
                isAdmin:{type: 'boolean'}
            }
        } 
    }
}

// /api/games
exports.getRequestSchema = getRequestSchema;
exports.postRequestSchema = postRequestSchema;
exports.putRequestSchema = putRequestSchema;
exports.patchRequestSchema = patchRequestSchema;
exports.deleteRequestSchema = deleteRequestSchema;
// / api/users
exports.signupSchema = signupSchema;
exports.getUsersSchema = getUsersSchema;
exports.getMeSchema = getMeSchema;