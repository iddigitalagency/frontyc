/*
    Gulp Project Config Loading
*/

var cfg = require('./gulpconfig.js');
var basePaths = cfg.basePaths;
var vendorFiles = cfg.vendorFiles;
var paths = cfg.paths;


/*
    Gulp Required Functions
*/

require('./gulpfunc.js');


/*
    Gulp Plugins Autoloader
*/

var gulp = require('gulp');

var es = require('event-stream');
var util = require('gulp-util');
var pngquant = require('imagemin-pngquant');
var path = require('path');
var del = require('del');

var plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});


/*
    Gulp --dev
*/

var isProduction = true;
var sassStyle = 'compressed';
var sourceMap = false;

if(util.env.dev === true) {
    sassStyle = 'expanded';
    sourceMap = true;
    isProduction = false;
}


/*
    Events Log
*/

var changeEvent = function(evt) {
    util.log('File', util.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', util.colors.magenta(evt.type));
};


/*
    Project Cleaner (public folder)
*/

gulp.task('clean', function(cb) {

	return del([
		basePaths.dest +'**/*',
		'!'+ basePaths.dest +'empty'
	], cb);

});


/*
    Project Reset (public folder / bower_components / node_modules)
*/

gulp.task('reset', function(cb) {

	return del([
		basePaths.dest +'**/*',
		basePaths.bower,
		basePaths.node,
		'!'+ basePaths.dest +'empty'
	], cb);

});


/*
    Javascript Errors Detector
*/

gulp.task('jshint', function() {

	return gulp.src(paths.scripts.src + '**/*.js')
			.pipe(jshint())
		    .pipe(jshint.reporter('default'));

});


/*
    Javascript Generator
*/ 

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


/*
    Sass Compilator
*/ 

gulp.task('sass', function() {

	return gulp.src([resources_assets + 'sass/libraries.scss'])
		.pipe(bulkSass())
	    .pipe(sass())
	    .pipe(rename('app.css'))
	    .pipe(gulp.dest(public_styles));

});



/*
    Css Generator
*/ 

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


/*
    Files Copy
*/ 

gulp.task('copy', function() {

	return gulp.src([
			resources_assets + '**/*',
			'!'+ resources_assets + '{images,images/**,sass,sass/**,scripts,scripts/**}'
		], {base: resources_root})
		.pipe(gulp.dest(public_root));

});


/*
    Images Compressor
*/ 

gulp.task('img', function () {

    return gulp.src([resources_assets + 'images/**/*.{gif,jpg,png,svg}'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(public_images));

});


/*
    Nunjucks Html Compilator
*/ 

gulp.task('nunjucks', function() {

	return gulp.src([
			resources_views + '*.html',
			'!' + resources_views + 'layouts'
		])
		.pipe(data(function(file) {

			var data = gulp.src(resources_models + '**/*.json')
				.pipe();	
			util.log( require(resources_models + path.basename( file.path, '.html' ) + '.json') );

			return require(resources_models + path.basename( file.path, '.html' ) + '.json');
		}))
		.pipe(nunjucks({
			searchPaths: [resources_views]
		}))
		.pipe(gulp.dest(public_root));

});


/*
    Gulp Default Task
*/ 

gulp.task('default', ['js', 'css', 'img', 'copy', 'nunjucks'], function() { });