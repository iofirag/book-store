var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Book-Genre Schema */
var bookGenreSchema = new Schema({
    name: String,
}, {collection: 'book_genre'});

exports.bookGenreSchema = bookGenreSchema;
