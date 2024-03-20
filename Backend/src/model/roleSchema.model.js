// Importing the Mongoose library
const mongoose = require('mongoose');

// Defining the role schema using Mongoose
const roleSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    roleName: {
        type: String,
        required: true
    }
});

// Creating a Mongoose model named 'Roles'
const Roles = mongoose.model('Roles', roleSchema, 'roles');

// Exporting the Roles model
module.exports = Roles;