/************* Moduls **************/
// My moduls
var handler = require('./handler')
// Helper moduls
, express = require('express')
, bodyParser = require('body-parser')
, passport = require('./authentication')

, redis = require('redis')
, session = require('express-session')  
, RedisStore = require('connect-redis')(session)
, client  = redis.createClient()

, jwt = require('jsonwebtoken')
, path = require('path')
var app = express();
var role = {
	client : 'client',
	admin : 'admin'
}

/************* MiddleWares **************/
app.use(passport.initialize()); 
// app.use(passport.session());	// dont know why

// to support JSON-encoded bodies
app.use( bodyParser.json() );


// Serve files from ./www directory
app.use(express.static(__dirname + '/public'));
// app.use('/js', express.static(__dirname + '/js'));	// //static/js
// app.use('/css', express.static(__dirname + '/css')); // static/css
// app.use('/views', express.static(__dirname + '/views')); // static/css
// app.use('/bower_components', express.static(__dirname + '/../bower_components'));
// app.use('/partials', express.static(__dirname + '/partials'));


app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new RedisStore({client:client}),
    saveUninitialized: false,
    resave: false
}));


/******************** API ********************/
app.get('/api', handler.getDefaultApiPage);

// route to authenticate the user
app.post('/api/auth', passport.authenticate(  
  'local', {
    session: false	// disable cookies
  }), serialize, generateToken, respond);

// serialize retrieved user from MongoDB and drop all axcept id
//  // please read the Passport documentation on how to implement this. We're now
//   // just serializing the entire 'user' object. It would be more sane to serialize
//   // just the unique user-id, so you can retrieve the user object from the database
//   // in .deserializeUser().
function serialize(req, res, next) {
	req.user = {id : req.user._id, role : req.user.role, username : req.user.user_name}
    next()
}
function generateToken(req, res, next) {  
  	req.token = jwt.sign(req.user, 'jwt secret', {expiresIn : 60*60*2});	//generate token from userId + pass + time
  	next();
}
function respond(req, res) {  
  res.json({
    user: req.user,
    token: req.token
  });
}
//----------
function authenticationMiddleware(authorizedRole) {  
  return function (req, res, next) {
  	var token = req.headers['authorization'];
  	if (!token)	return res.json({success:0,description:'Error: missing authorization header.'})
  	
  	var tokenPart = token.split(' ')[1]
  	var decodedUser = jwt.verify(tokenPart, 'jwt secret');
	if (!decodedUser) return res.json({success:0,description:'Error: user are not authenticated.'})
	if (decodedUser.role=='client' && authorizedRole=='admin') return res.json({success:0,description:'Error: user are not authorized to use this api.'})

	next()
  }
}


// (book)
app.get('/api/get_bookById', authenticationMiddleware(role.admin), handler.get_bookById);
app.get('/api/get_bookByName', authenticationMiddleware(role.admin), handler.get_bookByName);
app.delete('/api/delete_bookById', authenticationMiddleware(role.admin), handler.delete_bookById);
app.put('/api/create_book', authenticationMiddleware(role.admin), handler.create_book);
app.post('/api/update_bookById', authenticationMiddleware(role.admin), handler.update_bookById);
// (genre)
app.get('/api/get_genreById', authenticationMiddleware(role.admin), handler.get_genreById);
app.get('/api/get_genreByName', authenticationMiddleware(role.admin), handler.get_genreByName);
app.delete('/api/delete_genreByName', authenticationMiddleware(role.admin), handler.delete_genreByName);
app.put('/api/create_genre', authenticationMiddleware(role.admin), handler.create_genre);
app.post('/api/update_genreById', authenticationMiddleware(role.admin), handler.update_genreById);
// (client)
app.get('/api/get_allGenres', authenticationMiddleware(role.client), handler.get_allGenres);
app.get('/api/get_bookNamesByGenre', authenticationMiddleware(role.client), handler.get_bookNamesByGenre);
app.get('/api/get_bookDescriptionByBookId', authenticationMiddleware(role.client), handler.get_bookDescriptionByBookId);



// Serve web application
app.get('/', function(req, res, next) {	// /*
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname+'/public'});
});


// (description page)
app.get('/api', handler.getDefaultApiPage);
app.post('/api', handler.getDefaultApiPage);

// (error 404)
app.get('*', handler.getErrorPage );
app.post('*', handler.postErrorPage );








//-------------------------------------
//// Configure server host+port
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 3333);

app.listen(app.get('port'), function(){
  console.log('Express server listening on ' + app.get('host') + ':' + app.get('port'));
});