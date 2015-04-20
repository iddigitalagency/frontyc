// Resources directories
var src_assets = './resources/assets/';
var src_models = './resources/models/';
var src_views = './resources/views/';
var dir_root = './public/';

// Gulp plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulp = require('gulp');


gulp.task('javascript', function() {

	return gulp.src(src_assets + 'scripts/*.js')

		// Errors detection
	    .pipe(jshint())
	    .pipe(jshint.reporter('default'))

	    // Concatenation
	    .pipe(concat('app.js'))
	    .pipe(gulp.dest(dir_root + 'assets/js/'))

	    // Minification
	    .pipe(rename('app.min.js'))
	    .pipe(uglify())
	    .pipe(gulp.dest(dir_root + 'assets/js/'));

});


gulp.task('sass', function() {

	// todo

});


// Gulp tasks
gulp.task('default', ['javascript'], function() { });