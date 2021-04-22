const {signupSchema, getUsersSchema, getMeSchema} = require('../validationSchemas/validation');

//GET /api/users/me
const getMeOptions = {
    schema: getMeSchema
} 

//GET /api/users/
const getOptions = {
   schema: getUsersSchema
}

//POST /api/users signup
const postOptions = {
    schema :signupSchema
}

exports.getMeOptions = getMeOptions;
exports.getOptions = getOptions;
exports.postOptions = postOptions;