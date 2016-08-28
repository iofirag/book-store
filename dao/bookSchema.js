var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Book Schema */
var bookSchema = new Schema({
    name: String,
    description: String,
    genre_id: { type: Schema.Types.ObjectId, ref: 'book_genre' }
}, {collection: 'book'});

// Triggers
// bookSchema.pre('save', function (next) {
//   next();
// })
// bookSchema.pre('validate', function (next) {
//   next();
// })
// bookSchema.post('save', function (doc) {
//   console.log('Trigger: new book saved');
// });
// bookSchema.post('find', function(docs) {
//   console.log('Trigger: book has found');
// });


exports.bookSchema = bookSchema;