
/*
    Configuration loading
*/

var compilerOpt = require('./config/compiler.js').compilerOpt;
var basePaths = require('./config/paths.js').basePaths;
var paths = require('./config/paths.js').paths;
var vendorFiles = require('./config/vendor.js').vendorFiles;
var nunjucksOpt = require('./config/nunjucks.js').nunjucksOpt;


/*
    Gulp Required Functions
*/

var func = require('./libs/gulpfunc.js');


/*
    Gulp Plugins Autoloader
*/

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var plugins = require('gulp-load-plugins')({
	scope: ['devDependencies'],
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /^gulp(-|\.)/,
    camelize: true
});

var es = require('event-stream');
var pngquant = require('imagemin-pngquant');
var path = require('path');
var remove = require('del');
var stylish = require('jshint-stylish');
var console = plugins.util;


/*
    Events Log
*/

var changeEvent = function(evt) {
    console.log('File', console.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', console.colors.magenta(evt.type));
};


/*
    Project Cleaner (destination folder)
*/

gulp.task('clean', function(cb) {

	return remove([
		basePaths.dest +'**/*',
		'!'+ basePaths.dest +'empty'
	], cb);

});


/*
    Javascript Errors Detector
*/

gulp.task('jshint', function() {

	return gulp.src(paths.scripts.src + '**/*.js')
			.pipe(plugins.jshint())
		    .pipe(plugins.jshint.reporter(stylish));

});


/*
    Javascript Generator
*/ 

gulp.task('js', ['jshint'], function() {
	
	// Adding vendors from config
		var main_libs = [ paths.scripts.src + '**/*.js' ];
		var vendor_list = vendorFiles.scripts;
		
		for (var dest_file in vendor_list) {
			if (dest_file != 'default') {
				var vendor_libs = collectLibraries(vendor_list, dest_file);
				func.uglycat(vendor_libs, dest_file); // Concatenation & Uglifycation of current list
			}
			else main_libs = collectLibraries(vendor_list, dest_file, main_libs);
		}

	// Concatenation & Uglifycation of main libs (app.js)
		return func.uglycat(main_libs, 'app.js');

});

gulp.task('oldjs', ['jshint'], function() {

	// Adding vendors from config
		var main_libs = [ paths.scripts.src + '**/*.js' ];
		var vendor_list = vendorFiles.scripts;
		
		for (var dest_file in vendor_list) {
			if (dest_file != 'default') {
				var vendor_libs = collectLibraries(vendor_list, dest_file);
				func.uglycat(vendor_libs, dest_file); // Concatenation & Uglifycation of current list
			}
			else main_libs = collectLibraries(vendor_list, dest_file, main_libs);
		}

	// Concatenation & Uglifycation of main libs (app.js)
		return func.uglycat(main_libs, 'app.js');

});


/*
    Sass Compilator
*/ 

gulp.task('sass', function() {

	if (compilerOpt.useRubySass) {

		return plugins.rubySass(paths.styles.src + 'libraries.scss', {require: 'sass-globbing', loadPath: paths.styles.src})
			    .on('error', function(err){
			    	new console.PluginError('Ruby Sass', err.message, {showStack: true});
			    })
			    .pipe(plugins.rename('app.css'))
			    .pipe(gulp.dest(paths.styles.dest));

	} else {

		return gulp.src(paths.styles.src + 'libraries.scss')
				.pipe(plugins.sassBulkImport())
				.pipe(plugins.sass())
			    .pipe(plugins.rename('app.css'))
			    .pipe(gulp.dest(paths.styles.dest));

	}

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

gulp.task('cp', function() {

	gulp.src([
		paths.assets.src + '*.*'
	], {base: paths.assets.src})
	.pipe(gulp.dest(basePaths.dest));

	return gulp.src([
				paths.assets.src + '**/*',
				'!' + paths.assets.src + '*.*',
				'!' + paths.images.src,
				'!' + paths.images.src + '**',
				'!' + paths.scripts.src,
				'!' + paths.scripts.src + '**',
				'!' + paths.styles.src,
				'!' + paths.styles.src + '**'
			], {base: basePaths.src})
			.pipe(gulp.dest(basePaths.dest));

});


/*
    Images Compressor
*/ 

gulp.task('img', function () {

    return gulp.src([paths.images.src + '**/*.{gif,jpg,png,svg}'])
        .pipe(plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(paths.images.dest));

});


/*
    Nunjucks Html Compilator
*/ 

gulp.task('tpl', function() {

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

gulp.task('default', ['js', 'css', 'img', 'cp', 'tpl'], function() { });