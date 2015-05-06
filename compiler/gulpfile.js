
/*
    Config folder
*/

var configPath = './config/';


/*
    Configuration loading
*/

var compilerOpt = require(configPath + 'compiler.js').compilerOpt;
var vendorFiles = require(configPath + 'vendor.js').vendorFiles;
var nunjucksOpt = require(configPath + 'nunjucks.js').nunjucksOpt;
var projectPaths = require(configPath + 'paths.js');
var basePaths = projectPaths.basePaths;
var paths = projectPaths.paths;


/*
    Gulp Required Functions
*/

//var func = require('./libs/functions.js');


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
var replace = plugins.replace;
var gulpif = plugins.if;
var fs = require('fs');
var tmpjsondata = 'compiled_data.json';


/*
    Events Log
*/

var changeEvent = function(evt) {
    console.log('File', console.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', console.colors.magenta(evt.type));
    
    if (evt.type == 'deleted') {
    	console.log('debug::evt.path - ' + evt.path);
    	//remove(basePaths.src, {force: true})
    }
};


/*
    Project Cleaner (destination folder)
*/

gulp.task('clean', function() {

	return remove([
		basePaths.dest +'**/*',
		'!'+ basePaths.dest +'empty'
	], {force: true});

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
    Javascript Concat
*/

gulp.task('concatjs', ['jshint'], function() {

	return gulp.src(paths.scripts.src + '**/*.js')
		    .pipe(plugins.concat('app.js'))
		    .pipe(gulp.dest(paths.scripts.dest));

});


/*
    Javascript Generator
*/ 

gulp.task('js', ['concatjs'], function() {
	
	var vendorList = vendorFiles.scripts;
	vendorList['app.js'].unshift(paths.scripts.dest + 'app.js');

	for (var destFile in vendorList) {
		var destFileMin = destFile.replace('.js', '.min.js');
		var requireUglify = ( destFile.search('.js') == -1 || destFile.search('.min.js') != -1 ) ? false : true;

		console.log( 'Creating \'' + console.colors.cyan(destFile) + '\'' );
		if (requireUglify) console.log( 'Uglifying \'' + console.colors.yellow(destFileMin) + '\'' );

		for (var n = 0, len = vendorList[destFile].length; n < len; ++n)
			console.log( console.colors.grey(' |--> ' + vendorList[destFile][n]) );

		var stream = gulp.src(vendorList[destFile])
					.pipe(plugins.concat(destFile))
				    .pipe(gulp.dest(paths.scripts.dest))
				    .pipe(gulpif(requireUglify, plugins.rename(destFileMin)))
				    .pipe(gulpif(requireUglify, plugins.uglify()))
				    .pipe(gulpif(requireUglify, gulp.dest(paths.scripts.dest)));
	}

	return stream;

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
	
	var vendorList = vendorFiles.styles;
	vendorList['app.css'].unshift(paths.styles.dest + 'app.css');

	for (var destFile in vendorList) {
		var destFileMin = destFile.replace('.css', '.min.css');
		var requireMinify = ( destFile.search('.css') == -1 || destFile.search('.min.css') != -1 ) ? false : true;

		console.log( 'Creating \'' + console.colors.cyan(destFile) + '\'' );
		if (requireMinify) console.log( 'Minifying \'' + console.colors.yellow(destFileMin) + '\'' );

		for (var n = 0, len = vendorList[destFile].length; n < len; ++n)
			console.log( console.colors.grey(' |--> ' + vendorList[destFile][n]) );

		var stream = gulp.src(vendorList[destFile])
					.pipe(plugins.concat(destFile))
				    .pipe(gulp.dest(paths.styles.dest))
				    .pipe(gulpif(requireMinify, plugins.rename(destFileMin)))
				    .pipe(gulpif(requireMinify, plugins.minifyCss()))
				    .pipe(gulpif(requireMinify, gulp.dest(paths.styles.dest)));
	}

	return stream;

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
				'!' + paths.images.src + '*',
				'!' + paths.scripts.src,
				'!' + paths.scripts.src + '*',
				'!' + paths.styles.src,
				'!' + paths.styles.src + '*'
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
	Data Reader From Json Model Files
*/

gulp.task('getdatafrommodel', function() {

	if (compilerOpt.useNunjucks) {
		return gulp.src([paths.nunjucks.data + '**/*.json', '!' + paths.nunjucks.data + 'compiled_data.json'])
				.pipe(plugins.jsoncombine(tmpjsondata, function(data){
					return new Buffer(JSON.stringify(data));
				}))
				.pipe(gulp.dest(paths.nunjucks.data));
	}

});


/*
    Nunjucks Html Compilator
*/ 

gulp.task('nunjucks', ['getdatafrommodel'], function() {

	if (compilerOpt.useNunjucks) {

		var relativeAssetsPath = 'assets/';

		return gulp.src([
					paths.nunjucks.src + '*' + nunjucksOpt.tplFormat,
					'!' + paths.nunjucks.src + 'layouts'
				])
				/*.pipe(replace(/\{\{ asset\([^\'](.*)[^\']\) \}\}/g, relativeAssetsPath + '$1'))*/
				.pipe(plugins.data(function(file) {
					var flux = fs.readFileSync(paths.nunjucks.data + tmpjsondata, 'utf-8');
					return JSON.parse(flux);
				}))
				.pipe(plugins.nunjucksHtml({
					searchPaths: [paths.nunjucks.src],
					setUp: function(env) {
						env.addFilter('asset', function(path) {
							return relativeAssetsPath + path;
						});
						return env;
					}
				}))
				.on('error', function(err) {
					console.log(err);// err is the error thrown by the Nunjucks compiler.
				})
				.pipe(gulp.dest(paths.nunjucks.dest));
	}	

});





/*
    Nunjucks Html Compilator Including Data
*/ 

gulp.task('tpl', ['nunjucks'], function(cb) {

	if (compilerOpt.useNunjucks) {
		remove(paths.nunjucks.data + tmpjsondata, {force: true}, cb);
	}

});


/*
    Watcher
*/ 

gulp.task('watch', ['default'], function(){

    gulp.watch(paths.styles.src + '**/*', ['css']).on('change', function(evt) {
        changeEvent(evt);
    });

    gulp.watch(paths.scripts.src + '**/*', ['js']).on('change', function(evt) {
        changeEvent(evt);
    });

    gulp.watch(paths.images.src + '**/*', ['img']).on('change', function(evt) {
        changeEvent(evt);
    });

    if (compilerOpt.useNunjucks) {
	    gulp.watch([
			paths.nunjucks.src + '**/*',
			paths.nunjucks.data + '**/*',
			'!' + paths.nunjucks.data + tmpjsondata
		], ['tpl']).on('change', function(evt) {
	        changeEvent(evt);
	    });
	}

    gulp.watch([
		paths.assets.src + '**/*',
		'!' + paths.assets.src + '*.*',
		'!' + paths.images.src,
		'!' + paths.images.src + '*',
		'!' + paths.scripts.src,
		'!' + paths.scripts.src + '*',
		'!' + paths.styles.src,
		'!' + paths.styles.src + '*'
	], ['cp']).on('change', function(evt) {
        changeEvent(evt);
    });

});


/*
    Gulp Default Task
*/ 

gulp.task('default', ['js', 'css', 'img', 'cp', 'tpl'], function() {});
