const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

//mongoose schema for user
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024, //hashed passwords length is greater than the actual password
    },
    isAdmin: {type:Boolean, default: false}
});

//indexing users collection
userSchema.index({'isAdmin': 1, 'email': 1})

//instance method on user object to generate authentication token
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

//mongoose model from user schema
const User = mongoose.model('User', userSchema);



exports.User = User;