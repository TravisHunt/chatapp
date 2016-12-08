var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var TwitterStrategy = require('passport-twitter');
var GoogleStrategy = require('passport-google');
var FacebookStrategy = require('passport-facebook');

var index = require('./routes/index');
var users = require('./routes/users');

var config = require('./config');
var funct = require('./functions');

var app = express();

//// Passport

// session setup
passport.serializeUser(function(user, done) {
    console.log("serializing " + user.username);
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    console.log("deserializing " + obj);
    done(null, obj);
});

// local signin (existing users)
passport.use('local-signin', new LocalStrategy({passReqToCallback: true},
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
        })
        .fail(function(err) {
            console.log(err.body);
        });
    }
));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
    var err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
