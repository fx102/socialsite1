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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
})));

mongoose.connect(dbPath, function onMongooseError(err) {
  if (err) throw err;
});

app.get('/', function(req, res){
  res.render('index.jade');
});

app.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

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
    req.session.loggedIn = true;
    req.session.accountId = account._id;
    res.sendStatus(200);
  });
});

app.post('/register', function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;

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

app.get('/accounts/:id/contacts', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.contacts);
  });
});

app.get('/accounts/:id/activity', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.activity);
  });
});

app.get('/accounts/:id/status', function(req, res) {
  console.log(req.params.id);
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.status);
  });
});

app.post('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
                     console.log(accountId);
  models.Account.findById(accountId, function(account) {
    console.log(account);
    status = {
      name: account.name,
      status: req.body.status
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

app.post('/accounts/:id/contact', function(req,res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  var contactId = req.body.contactId;

  // Missing contactId, don't bother going any further
  if ( null == contactId ) {
    res.sendStatus(400);
    return;
  }

  models.Account.findById(accountId, function(account) {
    if ( account ) {
      models.Account.findById(contactId, function(contact) {
        models.Account.addContact(account, contact);

        // Make the reverse link
        models.Account.addContact(contact, account);
        account.save();
      });
    }
  });

  // Note: Not in callback - this endpoint returns immediately and
  // processes in the background
  res.sendStatus(200);
});

app.get('/accounts/:id', function(req, res) {
  var accountId = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account);
  });
});

app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.body.email;
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

app.post('/contacts/find', function(req, res) {
  var searchStr = req.params.searchStr;
  if ( null == searchStr ) {
    res.sendStatus(400);
    return;
  }

  models.Account.findByString(searchStr, function onSearchDone(err,accounts) {
    if (err || accounts.length == 0) {
      res.sendStatus(404);
    } else {
      res.send(accounts);
    }
  });
});

app.delete('/logout', function (req, res) {
    req.session.destroy();
    //must send the status code in order to kick the procedures in .done
    res.sendStatus(200);
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.body.account;
  res.render('resetPassword.jade', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.body.accountId;
  var password = req.body.password;
  if ( null != accountId && null != password ) {
    models.Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.listen(8080);
console.log("SocialNet is listening to port 8080.");
