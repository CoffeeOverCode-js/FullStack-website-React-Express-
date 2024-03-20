// Importing the Mongoose library
const mongoose = require('mongoose')
// Destructuring to extract the `ObjectId` from `mongoose.Types`
const { ObjectId } = mongoose.Types;

// Defining the credential schema using Mongoose
const credentialSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userID: {
        type: ObjectId,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// Creates a Mongoose model named 'Credentials'
const Credentials = mongoose.model('Credential', credentialSchema, 'credentials');

// Exports the Credentials model
module.exports = Credentials;