var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res, next) {
  res.sendFile('/public/index.html');
});

app.post('/contact', (req, res) => {

  if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.json({ "responseCode": false, "responseDesc": "Please select captcha" });
  }

  var secretKey = "6LeUGbgZAAAAALsW365wbjIiAPvxvEoGCCxO-rLk";
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'];

  request(verificationUrl, function (error, response, body) {

    if (req.body.success !== undefined && !req.body.success) {
      return res.json({ "responseCode": false, "responseDesc": "Failed captcha verification" });
    }

    const url = 'mongodb+srv://admin:CmDUk9U1uZr8cfJz@cluster0.0sw4b.gcp.mongodb.net/portfolio?retryWrites=true&w=majority';
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
      const db = client.db("portfolio");
      console.log('began writing to db');
      db.collection('contact_form').insertOne({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        time: new Date()
      })
        .then(function (result) {
          console.log('Document added');
          client.close();
        })
        .catch(err => {
          console.log(err);
          client.close();
        });

    });

    res.json({ "responseCode": true, "responseDesc": "" });

  });

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.sendFile('public/404.html');
});

module.exports = app;
