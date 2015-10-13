'use strict';

var Comment = require('./comment.model');

exports.all = function (req, res) {
  Comment
    .find()
    .sort({'time': 'desc'})
    .exec(function (err, comments) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({
        no: 0,
        msg: 'success',
        data: comments
      });
    });
};

exports.getOneComment = function (req, res) {
  var id = req.params.id;
  if (!id) {
    return;
  }
  Comment.findOneById(id).exec(function (err, comment) {
    if (err) {
      return handleError(res, err);
    }

    return res.status(200).json({
      no: 0,
      msg: 'success',
      data: comment
    });
  });
};

exports.createOneComment = function (req, res) {
  var body = req.body;
  var param = {
    author: body.author,
    text: body.text,
    time: new Date().getTime()
  };

  Comment.create(param, function(err, comment) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({
      no: 0,
      msg: 'success',
      data: comment
    });
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
