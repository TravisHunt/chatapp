var bcrypt = require('bcryptjs');
var Q = require('q');
var config = require('./config')

// MongoDB connection info
var mongodbURL = "mongodb://" + config.mongodbHost + ':27017/users';
var MongoClient = require('mongodb').MongoClient;

// used in local-signup strategy
exports.localReg = function(username, password) {
    var deferred = Q.defer();
    
    MongoClient.connect(mongodbURL, function(err, db) {
        var collection = db.collection('localUsers');
        
        // check if username is already assigned
        collection.findOne({'username': username})
          .then(function(result) {
            if (result != null) {
                console.log("USERNAME ALREADY EXISTS:", result.username);
                deferred.resolve(false);
            } else {
                var user = {
                    "username": username,
                    "password": bcrypt.hashSync(password, 8),
                    "avatar": "/images/defaultIcon.png",
                }
                console.log("CREATING USER:", username);
                
                collection.insert(user)
                  .then(function() {
                    db.close();
                    deferred.resolve(user);
                });
            }
        });
    });
    return deferred.promise;
};

exports.localAuth = function(username, password) {
    var deferred = Q.defer();
    
    MongoClient.connect(mongodbURL, function(err, db) {
        var collection = db.collection('localUsers');
        
        collection.findOne({'username': username})
          .then(function(result) {
            if (result == null) {
                console.log("USERNAME NOT FOUND:", username);
                deferred.resolve(false);
            } else {
                console.log("FOUND USER: " + result.username);
                if (bcrypt.compareSync(password, result.password)) {
                    deferred.resolve(result);
                } else {
                    console.log("AUTHENTICATION FAILED");
                    deferred.resolve(false);
                }
            }
            db.close();
        });
    });
    return deferred.promise;
};