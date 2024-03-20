// Importing the Mongoose library
const mongoose = require('mongoose')

// Defining the division schema using Mongoose
const divisionSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    divisionName: {
        type: String,
        required: true
    },
    credentialsID: {
        type: Array,
        required: true
    }
})

// Creating a Mongoose model named 'Division'
const Division = mongoose.model('Division', divisionSchema, 'division');

// Exporting the Division model
module.exports = Division;