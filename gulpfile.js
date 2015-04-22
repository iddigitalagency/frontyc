// Gulp extenral config file
var config = require('./gulpconfig.json');


// Resources files location
var resources_root = config.sources_dir;
var resources_assets = resources_root + 'assets/';
var resources_models = resources_root + 'models/';
var resources_views = resources_root + 'views/';


// Public compilation location
var public_root = config.compilation_dir;
var public_scripts = public_root + 'assets/js/';
var public_styles = public_root + 'assets/css/';


// Gulp plugins
var gjshint = require('gulp-jshint');
var guglify = require('gulp-uglify');
var gconcat = require('gulp-concat');
var grename = require('gulp-rename');
var gutil = require('gulp-util');
var gsass = require('gulp-sass');
var gminifyCss = require('gulp-minify-css');
var gbulkSass = require('gulp-sass-bulk-import');
var del = require('del');


// Gulp
var gulp = require('gulp');


/**
 * collectLibraries collect and return a list of libraries from the config file
 * @param  {array} collection
 * @param  {string} destination
 * @param  {array} libraries
 * @return {array}
 */
function collectLibraries(collection, destination, libraries) {

	var libs = (typeof libraries === 'undefined') ? [] : libraries;

	if (destination != 'default') gutil.log( 'Creating \'' + gutil.colors.cyan(destination + '.js') + '\'' );
	else gutil.log( 'Adding to \'' + gutil.colors.cyan('app.js') + '\'' );

	for (var file_number = 0, len = collection[destination].length; file_number < len; ++file_number)
	{
		libs.push( config.vendor_dir + collection[destination][file_number] );
		gutil.log( gutil.colors.grey(' |--> ' + collection[destination][file_number]) );
	}

	return libs;
}


/**
 * uglycat concat and uglify javascript source files into a destination file
 * @param  {array} sources_files
 * @param  {string} dest_file
 * @return {array}
 */
function uglycat(sources_files, dest_file) {

	if ( dest_file.search('.js') == -1 )
	{
		return gulp.src(sources_files)
		    .pipe(gconcat(dest_file))
		    .pipe(gulp.dest(public_scripts));
	}
	else
	{
		var dest_file_min = dest_file.replace('.js', '.min.js');

		return gulp.src(sources_files)
		    .pipe(gconcat(dest_file))
		    .pipe(gulp.dest(public_scripts))
		    .pipe(grename(dest_file_min))
		    .pipe(guglify())
		    .pipe(gulp.dest(public_scripts));
	}
	
}


/**
 * minicat concat and minify css source files into a destination file
 * @param  {array} sources_files
 * @param  {string} dest_file
 * @return {array}
 */
function minicat(sources_files, dest_file) {

	var dest_file_min = dest_file.replace('.css', '.min.css');

	return gulp.src(sources_files)
	    .pipe(gconcat(dest_file))
	    .pipe(gulp.dest(public_styles))
	    .pipe(grename(dest_file_min))
	    .pipe(gminifyCss({compatibility: 'ie8'}))
	    .pipe(gulp.dest(public_styles));
	
}


// Clean public and tmp folder
gulp.task('clean', function(cb) {

	return del([
		config.tmp_dir +'**/*',
		public_root +'**/*',
		'!'+ public_root +'empty'
	], cb);

});


// Reset public folder, bower libs and node modules
gulp.task('reset', function(cb) {

	return del([
		config.tmp_dir +'**/*',
		public_root +'**/*',
		config.vendor_dir +'bower',
		'node_modules',
		'!'+ public_root +'empty'
	], cb);

});


// Javascript errors detection
gulp.task('jshint', function() {

	return gulp.src(resources_assets + 'scripts/**/*.js')
			.pipe(gjshint())
		    .pipe(gjshint.reporter('default'));

});


// Javascript task
gulp.task('js', ['jshint'], function() {

	// Adding vendors from config
		var main_libs = [ resources_assets + 'scripts/**/*.js' ];
		var vendor_list = config.scripts_vendor;
		
		for (var dest_file in vendor_list)
		{
			if (dest_file != 'default')
			{
				var vendor_libs = collectLibraries(vendor_list, dest_file);

				// Concatenation & Uglifycation of current list
					uglycat(vendor_libs, dest_file);
			}
			else main_libs = collectLibraries(vendor_list, dest_file, main_libs);
		}

	// Concatenation & Uglifycation of main libs (app.js)
		return uglycat(main_libs, 'app.js');

});


// Sass compilation
gulp.task('sass', function() {

	return gulp.src([resources_assets + 'sass/libraries.scss'])
		.pipe(gbulkSass())
	    .pipe(gsass())
	    .pipe(grename('app.css'))
	    .pipe(gulp.dest(public_styles));

});


// Css task
gulp.task('css', ['sass'], function() {

	// Adding vendors from config
		var main_libs = [ public_styles + 'app.css' ];
		var vendor_list = config.styles_vendor;
		
		for (var dest_file in vendor_list)
		{
			if (dest_file != 'default')
			{
				var vendor_libs = collectLibraries(vendor_list, dest_file);

				// Concatenation & Minification of current list
					minicat(vendor_libs, dest_file);
			}
			else main_libs = collectLibraries(vendor_list, dest_file, main_libs);
		}

		// Concatenation & Minification of main libs (app.css)
		return minicat(main_libs, 'app.css');

});


// Copy over files
gulp.task('copy', function() {

	// TODO

});


// Gulp default task
gulp.task('default', ['js', 'css'], function() { });