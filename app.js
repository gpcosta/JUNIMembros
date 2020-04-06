var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexController = require('./controller/index');
var memberController = require('./controller/memberController');
var projectController = require('./controller/projectController');
var competenceController = require('./controller/competenceController');
var areaController = require('./controller/areaController');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexController);
app.use('/members', memberController);
app.use('/projects', projectController);
app.use('/competences', competenceController);
app.use('/areas', areaController);

module.exports = app;
