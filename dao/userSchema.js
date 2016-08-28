var mongoose = require('mongoose');
var Schema = mongoose.Schema;



/* User Schema */
var userSchema = new Schema({
    user_name: String,
    password: String,
    role: String
}, {collection: 'user', _id : false});

exports.userSchema = userSchema;



