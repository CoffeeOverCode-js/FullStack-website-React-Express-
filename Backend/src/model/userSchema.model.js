// Importing the Mongoose library
const mongoose = require('mongoose')

// Extracting the 'Schema' and 'ObjectId' from 'mongoose'
const schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

// Defining the user schema using Mongoose
const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1
    },
    orgUnits: {
        type: Array,
        required: true
    },
    divisions: {
        type: Array,
        required: true
    },
    credentialsID: {
        type: Number,
        required: true
    }
});

// Creating a Mongoose model named 'User'
const User = mongoose.model('User', userSchema, 'user');

// Exporting the User model
module.exports = User;