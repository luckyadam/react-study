'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var app = express();

mongoose.connect('mongodb://localhost/react-comment', {
  db: {
    safe: true
  }
});

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'react-comment-secret',
  resave: true,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    db: 'react-comment'
  })
}));

app.use('/api/comments', require('./server/api/comment'));
app.route('/*')
  .get(function(req, res) {
    res.sendFile(path.join(path.normalize(__dirname), 'public', 'index.html'));
  });

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
