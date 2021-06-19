/**
 * Packages Declaration
 */
const createError = require('http-errors');
const path = require('path');
const Ouch = require('ouch');
const logger = require('morgan');
const express = require('express');



/**
 * Create App instance
 */
const app = express();



/**
 * view engine setup
 */
app.set('views', path.join(__dirname, 'assets', 'pug'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.locals.pretty = true;



/**
 * App Level Middleware
 */
app.use(logger(':method :url :status :response-time ms'));



/**
 * All Routing
 */
app.get('/', function(req, res, next) {
  res.render('pages/index');
});

app.get('/:pageId', function(req, res, next) {
	res.render(`pages/${req.params.pageId}`);
});



/**
 * Catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  next(createError(404));
});



/**
 * Error Handler
 */
app.use(function(err, req, res, next) {
	var ouchInstance = (new Ouch).pushHandler(
		new Ouch.handlers.PrettyPageHandler('orange', null, 'sublime')
	);

	ouchInstance.handleException(err, req, res, function (output) {
		console.log('Error handled properly');
	});
});



module.exports = app;