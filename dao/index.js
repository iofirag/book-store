var mongoose = require('mongoose');

//configuring connection to mongoLab
var connection = mongoose.connect('mongodb://admin:1234@ds044229.mlab.com:44229/roundrobin');


// Import schema modules
var userSchema = require('./userSchema').userSchema;
var bookGenreSchema = require('./bookGenreSchema').bookGenreSchema;
var bookSchema = require('./bookSchema').bookSchema;

// decleare alias name for the imported schemas
mongoose.model('UserM' , userSchema);
mongoose.model('BookGenreM' , bookGenreSchema);
mongoose.model('BookM' , bookSchema);

// Export schemas
exports.UserM = mongoose.model('UserM');
exports.BookGenreM = mongoose.model('BookGenreM');
exports.BookM = mongoose.model('BookM');








// Save connection object
var conn = mongoose.connection;

// Mongoose error message output
conn.on('error', console.error.bind(console, 'connection error:'));

// Once a connection is initiated - do the following
conn.once('open' , ()=>{
	console.log('connected');
});




// When the node process is terminated (Ctrl+c is pressed) , close the connection to the DB.
process.on('SIGINT', ()=>{
  mongoose.connection.close( ()=>{
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});