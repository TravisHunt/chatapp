var bcrypt = require('bcryptjs');
var Q = require('q');
var config = require('./config');
var mongoose = require('mongoose');
var localUser = require('./models/localUser');

mongoose.Promise = Q.Promise;

// MongoDB connection info
var mongodbURL = "mongodb://" + config.mongodbHost + ':27017/chatapp';
var mongodbOptions = config.mongodbOptions || {};

// local-signup strategy
exports.localReg = function(username, email, password) {
    var deferred = Q.defer();
    mongoose.connect(mongodbURL, mongodbOptions);
    localUser.findOne({"username": username}, function(err, user) {
        if (user) {
            deferred.resolve(false);
        } else {
            // create new local user
            var newUser = new localUser({
                username: username,
                email: email,
                password: bcrypt.hashSync(password, 8),
                avatar: "/images/defaultIcon.png"
            });
            // save user to database
            newUser.save(function(err) {
                if (err) {
                    console.log(err.body);
                    deferred.resolve(false);
                } else {
                    deferred.resolve(newUser);
                }
                mongoose.connection.close();
            });
        }
    });
    return deferred.promise;
};

// local-signin strategy
exports.localAuth = function(username, password) {
    var deferred = Q.defer();
    mongoose.connect(mongodbURL);
    localUser.findOne({"username": username}, function(err, user) {
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                deferred.resolve(user);
            } else {
                deferred.resolve(false);
            }
        } else {
            console.log("[ERROR] " + user.username + " not found!");
            deferred.resolve(false);
        }
        mongoose.connection.close();
    });
    return deferred.promise;
};
