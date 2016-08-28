'use strict';

var UserM = require('../dao').UserM
const passport = require('passport');  
const Strategy = require('passport-local');

passport.use(new Strategy(
  // {
  //   usernameField : 'username',
  //   passwordField : 'password'
  // },
  function(username, password, done) {
    UserM.findOne({ user_name: username,  password: password }, (err, userFounded)=>{
      if (err) return done(err)
      if (!userFounded) return done(null, false);
      done(null, userFounded._doc);
  });
    // database dummy - find user and verify password
    // if(username === 'devils name' && password === '666'){
    //   done(null, {
    //     id: 666,
    //     firstname: 'devils',
    //     lastname: 'name',
    //     email: 'devil@he.ll',
    //     verified: true
    //   });
    // }
    // else {
    //   done(null, false);
    // }
  }
));

module.exports = passport;