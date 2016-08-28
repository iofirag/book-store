var jwt = require('jsonwebtoken')
var UserM = 	require('../dao').UserM
var BookGenreM = require('../dao').BookGenreM
var BookM = 	require('../dao').BookM

/* Admin api */
// Book functions
exports.create_book = (req,res)=>{	// post
	if (!req.body.name || !req.body.description || !req.body.genre) return res.json({success:0, description:'Error: missing params'})

	var bookData = {
		name : req.body.name,
		description : req.body.description,
		genre : req.body.genre
	}

	BookGenreM.findOne({ name: bookData.genre }, (err1, bookGenreFound)=>{
		if (!!err1) return res.json({success:0, description: err1})
		if (!bookGenreFound) return res.json({success:0, description: 'Error: genre not found'})

		var newBook = new BookM();
		newBook.genre_id = bookGenreFound._id;
		newBook.name = bookData.name;
		newBook.description = bookData.description;

		BookM.create(newBook, function (err2, createdBook) {
			if (err2) return res.json(err2)

			var retrieveBook = {
				description: createdBook.description,
				name: createdBook.name,
				_id: createdBook._id,
				genre: bookGenreFound.name
			}
		  	res.json(retrieveBook)
		});
	});
}
exports.get_bookById = (req,res)=>{	// get
	if (!req.query.bookId) return res.json({success:0, description:'Error: missing params'})

	// Find book
	var bookId = req.query.bookId;
	BookM.findById(bookId, (err1, bookFound)=>{
		if (err1) return res.json({success:0, description: err1})

		// Retrieve genre name from genreId
		BookGenreM.findById(bookFound.genre_id, (err2, genreFound)=>{
			if (err2) return res.json({success:0, description: err2})

			var bookWithGenreName = {
				_id:bookFound._id,
				genre: genreFound.name,
				name: bookFound.name,
				description: bookFound.description
			}
			res.json({success:1, data:bookWithGenreName});
		});
	});
}
exports.get_bookByName = (req,res)=>{ // GET
	if (!req.query.bookName) return res.json({success:0, description:'Error: missing params'})

	BookM.find({ name: req.query.bookName }, (err, bookFound)=>{
		if (err) return res.json({success:0, description: err})

		var genreIdList = []
		for(var i in bookFound){
			genreIdList.push(bookFound[i].genre_id)
		}
		BookGenreM.find()
			.where('_id')
			.in(genreIdList)
			.exec((err, genresFound)=>{
				if (err) return res.json({success:0, description: err})
				
				// Create genres map
				var genresMap = {};
				for(var j in genresFound){
					genresMap[genresFound[j]._id] = genresFound[j].name;
				}
				console.log(genresFound)
				console.log(genresMap)
				// Resove id to name
				var retrieveBooks = [];
				for(var i in bookFound){
					console.log(genresMap[bookFound[i].genre_id])
					var bookItem = {
						_id : bookFound[i]._id,
						genre_id : bookFound[i].genre_id,
						genre : genresMap[bookFound[i].genre_id],
						name : bookFound[i].name,
						description : bookFound[i].description
					}
					retrieveBooks.push(bookItem);
				}
				res.json({success:1, data:retrieveBooks});
			}
		)
	});
}
exports.update_bookById = (req,res)=>{ // post
	if (!req.body._id || !req.body.name || !req.body.description || !req.body.genre) return res.json({success:0, description:'Error: missing params'})

	var bookData = {
		_id: req.body._id,
		name: req.body.name,
		description: req.body.description,
		genre: req.body.genre
	}
	// Find genre id
    BookGenreM.findOne({ name: bookData.genre }, (err1, bookGenreFound)=>{
		if (err1) return res.json({success:0, description: err1})

		var query = { _id : bookData._id };
		BookM.update(query, { 
			name : bookData.name,
			description : bookData.description,
			genre_id : bookGenreFound._id
		}, {}, (err2,update)=>{
			if (err2) return res.json({success:0, description: err2})
			if(!update.ok || update.nModified==0) return res.json({success:2, description:'no need to update'})

			res.json({success: 1, updatedBooks: update.nModified});
		})
	});
}
exports.delete_bookById = (req,res)=>{ // GET
	if (!req.query.bookId) return res.json({success:0, description:'Error: missing params'})

	BookM.findByIdAndRemove(req.query.bookId, (err, bookFounded)=>{
		if (err) return res.json({success:0, description: err})
		res.json({success:1, data:bookFounded});
	});
}
// Genre functions
exports.create_genre = (req,res)=>{	// post
	if (!req.body.name) return res.json({success:0, description:'Error: missing params'})

	var newGenre =  new BookGenreM()
	newGenre.name = req.body.name

	BookGenreM.create(newGenre, (err,createdGenre)=>{
		if (err) return res.json({success:0, description:err})
		res.json({success:1, data:createdGenre})
	});
}
exports.get_genreById = (req,res)=>{	// get
	if (!req.query.genreId) return res.json({success:0, description:'Error: missing params'})

	var genreId = req.query.genreId;
	BookGenreM.findById(genreId, (err, genreFound)=>{
		if (err) return res.json({success:0, description: err})
		res.json({success:1, data:genreFound});
	});
}
exports.get_genreByName = (req,res)=>{ // GET
	if (!req.query.name) return res.json({success:0, description:'Error: missing params'})

	BookGenreM.find({ name: req.query.name }, (err, genreFound)=>{
		if (err) return res.json({success:0, description: err})
		res.json({success:1, data:genreFound});
	});
}
exports.update_genreById = (req,res)=>{ // post
	if (!req.body._id || !req.body.name) return res.json({success:0, description:'Error: missing params'})

	var genreData = {
		_id: req.body._id,
		name: req.body.name
	}

	var query = { _id : genreData._id };
	BookGenreM.update(query, { 
		name : genreData.name,
		genre_id : genreData._id
	}, {}, (err,update)=>{
		if (err) return res.json({success:0, description: err})
		if(!update.ok || update.nModified==0) return res.json({success:2, description:'no need to update'})

		res.json({success: 1, data: update.nModified});
	})
}
exports.delete_genreByName = (req,res)=>{ // GET
	if (!req.query.name) return res.json({success:0, description:'Error: missing params'})

	BookGenreM.remove({ name: req.query.name }, (err, genreFound)=>{
		if (err) return res.json({success:0, description: err})
		if (genreFound.result.n==0) return res.json({success:0, description:'Error: genre not found'})

		res.json({success:1});
	});
}


/* Client api */
// get all book-genres
exports.get_allGenres = (req,res)=>{ // GET
	BookGenreM.find({}, (err, genresFound)=>{
		if (err) return res.json({success:0, description: err})
		res.json({success:1, data:genresFound});
	});
}
// get book names by genre
exports.get_bookNamesByGenre = (req,res)=>{
	if (!req.query.name) return res.json({success:0, description:'Error: missing params'})

	BookGenreM.findOne({ name: req.query.name }, (err, genreFound)=>{
		if (err) return res.json({success:0, description: err})

		console.log('genreFound='+genreFound)
		// Find all books with the same genre Id
		BookM.find({ genre_id: genreFound._id }, (err2, booksFound)=>{
			if (err2) return res.json({success:0, description: err2})
			var booksList = [];
			for(var i in booksFound){
				var bookItem = {
					_id: booksFound[i]._id,
					name: booksFound[i].name,
					description: booksFound[i].description,
					genre: genreFound.name,
					genre_id : genreFound._id
				}
				booksList.push(bookItem);
			}
			res.json({success:1, data:booksList});
		});
	});
}
// get book description by book ID.
exports.get_bookDescriptionByBookId = (req,res)=>{	// get
	if (!req.query.bookId) return res.json({success:0, description:'Error: missing params'})

	var bookId = req.query.bookId;
	BookM.findById(bookId, (err, bookFound)=>{
		if (err) return res.json({success:0, description: err})
		res.json({success:1, data:bookFound.description});
	});
}


/* Default functions */
exports.getDefaultPage = (req,res)=>{
	console.log('/ - '+ new Date().toISOString());
    return res.sendFile(__dirname + '/static/index.html');
}
exports.getDefaultApiPage = (req,res)=>{
	console.log('/api - '+ new Date().toISOString());
    return res.send('<h1>RoundRobin api server</h1>');
}
exports.getErrorPage = (req,res)=>{
	console.log('* - '+Date.now());
	res.send('404 - Not exist page.')
}
exports.postErrorPage = (req,res)=>{
	console.log('* - '+Date.now())
	res.json({description:'Not exist endpoint.'})
}