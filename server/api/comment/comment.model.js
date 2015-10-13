'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  author: String,
  text: String,
  time: Date
});

module.exports = mongoose.model('Comment', CommentSchema);
