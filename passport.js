// This file contains the Passport authentication logic.

var passport = require('passport');
var LocalStrategy = require('passport-local');
//var TwitterStrategy = require('passport-twitter');
//var GoogleStrategy = require('passport-google');
//var FacebookStrategy = require('passport-facebook');
var funct = require('./functions');

// User serializer & deserializer
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// local signin (existing users)
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback: true},
    function(req, username, password, done) {
        funct.localAuth(username, password)
        .then(function(user) {
            if (user) {
                req.session.success = "You are logged in as " + user.username;
                done(null, user);
            } else {
                req.session.error = "Could not log in. Please try again.";
                done(null, user);
            }
        }).fail(function(err) {
            req.session.error = err.body;
        });     
    }
));

// local signup (new users)
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback: true},
    function(req, username, password, done) {
        // get the email from the request, since passport is a jew
        var email = req.body['email'];
        funct.localReg(username, email, password)
        .then(function(user) {
            if (user) {
                req.session.success = "Registration successful!";
                done(null, user);
            } else {
                req.session.error = "Username not available. Please try a different username.";
                done(null, user);
            }
        }).fail(function(err) {
            req.session.error = err.body;
        });
    }
));

module.exports = passport;