// Resources directories
var src_assets = './resources/assets/';
var src_models = './resources/models/';
var src_views = './resources/views/';
var dir_root = './public/';

// Gulp plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulp = require('gulp');


// 1. Detect errors and potential problems in JavaScript code
// 2. Minification of JavaScript files
gulp.task('javascript', function() {

	return gulp.src(src_assets + 'scripts/*.js')

	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))

	    .pipe(concat('app.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(dir_root + 'assets/js/'));

});


// Sass compilation and minification
gulp.task('sass', function() {

	// todo

});


// Gulp tasks
gulp.task('default', ['javascript'], function() { });