// Importing the Mongoose library
const mongoose = require('mongoose');

// Defining the organization units (OU) schema using Mongoose
const orgUnitsSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    OU_Name: {
        type: String,
        required: true
    },
    credentialsID: {
        type: Array,
        required: true
    }
});

// Creating a Mongoose model named 'OrgUnit'
const OrgUnit = mongoose.model('OrgUnits', orgUnitsSchema, 'ou');

// Exporting the OrgUnit model
module.exports = OrgUnit;