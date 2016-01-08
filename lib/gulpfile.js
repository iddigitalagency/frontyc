var gulp 	= require('gulp');
var argv = require('yargs').argv;
var stream 	= require('./core/bootstrap.js').init(gulp, (argv.ftycCwd) ? argv.ftycCwd : false);
