// This file contains the Passport authentication logic.

var passport = require('passport');
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var GoogleStrategy = require('passport-google');
var FacebookStrategy = require('passport-facebook');
var funct = require('./functions');

// User serializer & deserializer
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});

// local signin (existing users)
passport.use('local-signin', new LocalStrategy(
    {passReqToCallback: true},
    function(req, username, password, done) {
        funct.localAuth(username, password)
        .then(function(user) {
            if (user) {
                console.log("LOGGED IN AS: " + user.username);
                req.session.success = "You are logged in as " + user.username;
                done(null, user);
            } else {
                console.log("COULD NOT LOG IN");
                req.session.error = "Could not log in. Please try again.";
                done(null, user);
            }
        }).fail(function(err) {
            console.log(err.body);
        });     
    }
));

// local signup (new users)
passport.use('local-signup', new LocalStrategy(
    {passReqToCallback: true},
    function(req, username, password, done) {
        funct.localReg(username, password)
        .then(function(user) {
            if (user) {
                console.log("REGISTERED:" + user.username);
                req.session.success = "Registration successful!";
                done(null, user);
            } else {
                console.log("COULD NOT REGISTER");
                req.session.error = "Username not available. Please try a different username.";
                done(null, user);
            }
        }).fail(function(err) {
            console.log(err.body);
        });
    }
));

module.exports = passport;