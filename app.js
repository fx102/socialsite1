//server side, start of the program

//when user require(...), methods within the moodule become accessible
var express     = require("express"),
    app         = express(),
    nodemailer  = require('nodemailer'),
    session     = require('express-session'),
    dbPath      = 'mongodb://localhost/nodebackbone'
    bodyParser  = require('body-parser'),
    methodOverride = require('method-override'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose'),
    //https://www.npmjs.com/package/raw-body
    getRawBody = require('raw-body'),
    cookieParser = require('cookie-parser'),
    typer = require('media-typer');

var config = {
  mail: require('./config/mail')
};

// Import the models
var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer)
};

//from Express 4.x onwards, app.configure can be removed
//app.configure(function(){});
app.set('view engine', 'jade');
app.use(methodOverride());
app.use(bodyParser.json());
//was limiting the body size with raw-body/media-typers
app.use(bodyParser.raw({ limit: '1mb' }));
// parse application/x-www-form-urlencoded
//?
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//Show all errors in development
app.use( errorhandler({ dumpExceptions: true, showStack: true }));

app.use(cookieParser());
app.use(session(({
  secret: 'keyboard cat'
})));

mongoose.connect(dbPath, function onMongooseError(err) {
  if (err) throw err;
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.post('/login', function(req, res) {
  console.log('login request');
  var email = req.params.email;
  var password = req.params.password;

  if ( null == email || email.length < 1
      || null == password || password.length < 1 ) {
    res.sendStatus(400);
    return;
  }

  models.Account.login(email, password, function(account) {
    if ( !account ) {
      res.sendStatus(401);
      return;
    }
    console.log('login was successful');
    req.session.loggedIn = true;
    req.session.accountId = account._id;
    res.sendStatus(200);
  });
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
       || null == password || password.length < 1 ) {
    res.sendStatus(400);
    return;
  }

  models.Account.register(email, password, firstName, lastName);
  res.sendStatus(200);
});

app.get('/account/authenticated', function(req, res) {
  if ( req.session.loggedIn ) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/accounts/:id/activity', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.sendStatus(account.activity);
  });
});

app.get('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.sendStatus(account.status);
  });
});

app.post('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    status = {
      name: account.name,
      status: req.param('status', '')
    };
    account.status.push(status);

    // Push the status to all friends
    account.activity.push(status);
    account.save(function (err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
  });
  res.sendStatus(200);
});

app.get('/accounts/:id', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.sendStatus(account);
  });
});

app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.sendStatus(400);
    return;
  }

  models.Account.forgotPassword(email, resetPasswordUrl, function(success){
    if (success) {
      res.sendStatus(200);
    } else {
      // Username or password not found
      res.sendStatus(404);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if ( null != accountId && null != password ) {
    models.Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.listen(8080);
console.log("SocialNet is listening to port 8080.");
