var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});

// renders signin page
router.get('/signin', function(req, res, next) {
    res.render('signin');
});

// sends request through local signup strategy. If successful, takes
// user to home page, otherwise returns to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signin',
}));

// send request through local signin strategy.
router.post('/login', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/signin'
}));

// logs user out of site, deleting them from the session
router.get('/logout', function(req, res, next) {
    var name = req.user.username;
    console.log("LOGGING OUT " + req.user.username);
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully ben logged out.";
});

module.exports = router;
