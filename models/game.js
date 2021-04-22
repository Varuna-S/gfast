const mongoose = require('mongoose');
const moment = require('moment');

//mongoose schema for game
const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: 1,
        maxlength: 150
    },
    genre: {
        type: String,
        required: [true, 'genre is required'],
        minlength: 1,
        maxlength: 150
    },
    developerName: {
        type: String,
        required: [true, 'developer name is required'],
        minlength: 1,
        maxlength: 150
    },
    publisherName: {
        type: String,
        required: [true, 'publisher name is required'],
        minlength: 1,
        maxlength: 150
    },
    gameEngine: {
        type: String,
        required:  [true, 'game engine name is required'],
        minlength: 1,
        maxlength: 100
    },
    platform: {
        type: String,
        required:  [true, 'platform name is required'],
        minlength: 1,
        maxlength: 175
    },
    releaseDate: {
        type: Date,
        min: '1970-01-01',
        required:  [true, 'release date is required'],
        validate:{
            validator: function(rd){
                dateNow  = Date.now();
                //validates the date, if its within current date
                return  (moment(rd, 'YYYY-MM-DD').isSameOrBefore(dateNow));
            },
            message:'Invalid date - release date should be within current date'
        }
    }
});

//indexing games collection
gameSchema.index({'_id':1,'releaseDate': -1});

// model from game schema
const Game = mongoose.model('Game', gameSchema);

exports.gameSchema = gameSchema;
exports.Game = Game;