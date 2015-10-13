'use strict';

var express = require('express');
var controller = require('./comment.controller');
var router = express.Router();

router.get('/', controller.all);
router.get('/:id', controller.getOneComment);
router.post('/', controller.createOneComment);

module.exports = router;
