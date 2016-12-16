var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var localUserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    avatar: String,
    friends: {type: Array, default: []},
    dateCreated: {type: Date, default: Date.now},
    active: {type: Boolean, default: true}
}, {collection: 'localUsers'});

localUserSchema.methods.getUsername = function(cb) {
    return this.username;
};

var localUser = mongoose.model('User', localUserSchema);

module.exports = localUser;