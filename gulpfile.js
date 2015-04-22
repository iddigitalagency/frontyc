// Gulp extenral config file
var config = require('./gulpconfig.json');


// Resources files location
var resources_root = config.sources_dir;
var resources_assets = resources_root + 'assets/';
var resources_models = resources_root + 'models/';
var resources_views = resources_root + 'views/';


// Public compilation location
var public_root = config.compilation_dir;
var public_fonts = public_root + 'assets/fonts/';
var public_scripts = public_root + 'assets/js/';
var public_styles = public_root + 'assets/css/';
var public_images = public_root + 'assets/img/';


// Gulp plugins
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var util = require('gulp-util');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var bulkSass = require('gulp-sass-bulk-import');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var nunjucks = require('gulp-nunjucks-html');
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

	if (destination != 'default') util.log( 'Creating \'' + util.colors.cyan(destination) + '\'' );
	else util.log( 'Adding to \'' + util.colors.cyan('default') + '\'' );

	for (var file_number = 0, len = collection[destination].length; file_number < len; ++file_number)
	{
		libs.push( config.vendor_dir + collection[destination][file_number] );
		util.log( util.colors.grey(' |--> ' + collection[destination][file_number]) );
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
		    .pipe(concat(dest_file))
		    .pipe(gulp.dest(public_scripts));
	}
	else
	{
		var dest_file_min = dest_file.replace('.js', '.min.js');

		return gulp.src(sources_files)
		    .pipe(concat(dest_file))
		    .pipe(gulp.dest(public_scripts))
		    .pipe(rename(dest_file_min))
		    .pipe(uglify())
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
	    .pipe(concat(dest_file))
	    .pipe(gulp.dest(public_styles))
	    .pipe(rename(dest_file_min))
	    .pipe(minifyCss({compatibility: 'ie8'}))
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
			.pipe(jshint())
		    .pipe(jshint.reporter('default'));

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
		.pipe(bulkSass())
	    .pipe(sass())
	    .pipe(rename('app.css'))
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


// Copy other files
gulp.task('copy', function() {

	return gulp.src([
			resources_assets + '**/*',
			'!'+ resources_assets + '{images,images/**,sass,sass/**,scripts,scripts/**}'
		], {base: resources_root})
		.pipe(gulp.dest(public_root));

});


// Optimize images
gulp.task('img', function () {

    return gulp.src([resources_assets + 'images/**/*.{gif,jpg,png,svg}'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(public_images));

});


// Render nunjucks view files to Html
gulp.task('nunjucks', function() {

	return gulp.src([
			resources_views + '*.html',
			'!' + resources_views + 'layouts'
		])
		/*.pipe(data(function(file) {
		  return require('./metadata/' + path.basename(file.path) + '.json');
		}))*/
		.pipe(nunjucks({
			searchPaths: [resources_views]
		}))
		.pipe(gulp.dest(public_root));

});


// Gulp default task
gulp.task('default', ['js', 'css', 'img', 'copy', 'nunjucks'], function() { });