// Requires necessary modules
const mongoose = require('mongoose');
const chalk = require('chalk');

// MongoDB connection URI
const uri = 'mongodb+srv://ryanfredericksuni:ryanfredericks1324@user.nlhfhky.mongodb.net/cooltechDB';

// Setting Mongoose to use the global Promise library
mongoose.Promise = global.Promise;

// Connecting to MongoDB using Mongoose
mongoose.connect(uri, {
    // Uses the new URL parser for MongoDB connection strings
    useNewUrlParser: true,
    // Uses the new server discovery and monitoring engine
    useUnifiedTopology: true,
});

// Handles connection errors
mongoose.connection.on('error', (error) => {
    // Logs an error message in red
    console.error(chalk.red('Could not connect to the database:', error));
    // Exit the process with an error code
    process.exit(1);
});

// Handles successful database connection
mongoose.connection.once('open', () => {
    console.log(chalk.blue('Successfully connected to the database'));  // Log a success message in blue
});

// Exports the Mongoose instance for other modules
module.exports = mongoose;
