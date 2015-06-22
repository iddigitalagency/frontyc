
/*
 Config folder
 */

var fs = require('fs');

if (fs.existsSync('./config/external.js')) {
	var configPath = require('./config/external.js').cfg.configPath;
} else {
	var configPath = './config/';
}


/*
 Configuration loading
 */

var compilerOpt = require(configPath + 'compiler.js').compilerOpt;
var vendorFiles = require(configPath + 'vendor.js').vendorFiles;
var projectPaths = require(configPath + 'paths.js');
var basePaths = projectPaths.basePaths;
var paths = projectPaths.paths;
var root_dir = projectPaths.root_dir;


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
var tmpjsondata = 'compiled_data.json';
var runSequence = require('run-sequence');


/*
 Events Log
 */

var errorMessage = function(message) { console.log(console.colors.bgYellow(message)); };
var successMessage = function(message) { console.log(console.colors.bgGreen(message)); };
var infoMessage = function(message) { console.log(console.colors.bgBlue(message)); };
var neutralMessage = function(message) { console.log(console.colors.bgBlack(message)); };

var fileChangeEvent = function(evt) {
	var fileChanged = evt.path;
	var baseSrc = basePaths.src.replace(root_dir, '');

	fileChanged = fileChanged.split( baseSrc );
	fileChanged = fileChanged[1];

	if (evt.type == 'deleted') {
		var fileToRemove = basePaths.dest + fileChanged;
		var fileToRemoveBaseDir = fileToRemove.replace(/\\/g,'/').replace(/\/[^\/]*$/, '').replace(/\\/g,'/').replace( /.*\//, '' );

		// If base dir is equal to root folder
		if (fileToRemoveBaseDir == 'assets')
			fileToRemove = fileToRemove.replace('assets', '');

		remove(fileToRemove, {force: true});
	}

	infoMessage('File '+ baseSrc + fileChanged + ' was ' + evt.type);
};

/*
 Useful functions
 */

var parentSearch = function _parentSearch(arr, child) {
	var child = child.replace(/^.*[\\\/]/, '');

	for (var key in arr) {
		for (var i=0; i<arr[key].length; i++) {
			if (arr[key][i].replace(/^.*[\\\/]/, '') === child) {
				var obj = {};
				obj[key] = arr[key];
				return obj;
			}
		}
	}

	return {};
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

var vendorCompilation = function _vendorCompilation(vendorList, fileType) {
	var _ext = fileType;

	for (var destFile in vendorList)
	{
		var destFileMin = destFile.replace('.'+_ext, '.min.'+_ext);
		var requireMinify = ( destFile.search('.'+_ext) == -1 || destFile.search('.min.'+_ext) != -1 ) ? false : true;

		// Log file generation
		infoMessage('Creating \'' + destFile + '\'');

		// Log file minification
		if (requireMinify) infoMessage('Minifying \'' + destFileMin + '\'');

		// Log child files
		for (var n = 0, len = vendorList[destFile].length; n < len; ++n)
			neutralMessage(' |--> ' + vendorList[destFile][n]);

		if (_ext == 'js') {
			var stream = gulp.src(vendorList[destFile])
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.concat(destFile))
				.pipe(gulp.dest(paths.scripts.dest))
				.pipe(gulpif(requireMinify, plugins.rename(destFileMin)))
				.pipe(gulpif(requireMinify, plugins.uglify()))
				.pipe(gulpif(requireMinify, gulp.dest(paths.scripts.dest)));
		} else {
			var stream = gulp.src(vendorList[destFile])
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.concat(destFile))
				.pipe(gulp.dest(paths.styles.dest))
				.pipe(gulpif(requireMinify, plugins.rename(destFileMin)))
				.pipe(gulpif(requireMinify, plugins.minifyCss()))
				.pipe(gulpif(requireMinify, gulp.dest(paths.styles.dest)));
		}
	}

	return stream;
};


gulp.task('js', ['concatjs'], function() {

	var jsVendorList = JSON.parse(JSON.stringify(vendorFiles.scripts));
	jsVendorList['app.js'].unshift(paths.scripts.dest + 'app.js');

	if (typeof changedFile.file !== 'undefined') {
		jsVendorList = parentSearch(jsVendorList, changedFile.file);
	}

	return vendorCompilation(jsVendorList, 'js');

});


/*
 Sass Compilator
 */

gulp.task('sass', function() {

	if (compilerOpt.useRubySass) {

		// Sass compilation using ruby sass gem
		return plugins.rubySass(paths.styles.src + 'libraries.scss', {require: 'sass-globbing', loadPath: paths.styles.src})
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					errorMessage(err);
					this.emit('end');
				}
			}))
			.pipe(plugins.rename('app.css'))
			.pipe(gulp.dest(paths.styles.dest));

	} else {

		// Sass compilation using libsass library
		return gulp.src(paths.styles.src + 'libraries.scss')
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					errorMessage(err);
					this.emit('end');
				}
			}))
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

	var cssVendorList = JSON.parse(JSON.stringify(vendorFiles.styles));
	cssVendorList['app.css'].unshift(paths.styles.dest + 'app.css');
	return vendorCompilation(cssVendorList, 'css');

});


/*
 Files Copy
 */

gulp.task('cp', function() {

	gulp.src([
			basePaths.assets.src + '*.*'
		], {base: basePaths.assets.src})
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				errorMessage(err);
				this.emit('end');
			}
		}))
		.pipe(gulp.dest(basePaths.dest));

	return gulp.src([
			basePaths.assets.src + '**/*',
			'!' + basePaths.assets.src + '*.*',
			'!' + paths.images.src,
			'!' + paths.images.src + '**',
			'!' + paths.scripts.src,
			'!' + paths.scripts.src + '**',
			'!' + paths.styles.src,
			'!' + paths.styles.src + '**'
		], {base: basePaths.assets.src})
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				errorMessage(err);
				this.emit('end');
			}
		}))
		.pipe(gulp.dest(basePaths.assets.dest));

});


/*
 Images Compressor
 */

gulp.task('img', function () {

	return gulp.src([paths.images.src + '**/*.{gif,jpg,png,svg}'])
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				errorMessage(err);
				this.emit('end');
			}
		}))
		.pipe(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})
		.on('error', function(err) {
			errorMessage(err);
			this.emit('end');
		}))
		.pipe(gulp.dest(paths.images.dest));

});


/*
 Data Reader From Json Model Files
 */

gulp.task('getdatafrommodel', function() {

	if (compilerOpt.enablePreview) {
		return gulp.src([paths.nunjucks.data + '**/*.json', '!' + paths.nunjucks.data + 'compiled_data.json'])
			.pipe(plugins.jsoncombine(tmpjsondata, function(data){
				return new Buffer(JSON.stringify(data));
			}).on('error', function(err) {
				errorMessage(err);
				this.emit('end');
			}))
			.pipe(gulp.dest(paths.nunjucks.data));
	}

});


/*
 Nunjucks Html Compilator
 */

gulp.task('nunjucks', ['getdatafrommodel'], function() {

	if (compilerOpt.enablePreview) {

		return gulp.src([
				paths.nunjucks.src + '*' + compilerOpt.tplFormat,
				'!' + paths.nunjucks.src + 'layouts'
			])
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					errorMessage(err);
					this.emit('end');
				}
			}))
			.pipe(plugins.data(function(file) {
				var flux = fs.readFileSync(paths.nunjucks.data + tmpjsondata, 'utf-8');
				return JSON.parse(flux);
			}))
			.pipe(plugins.nunjucksHtml({
				searchPaths: [paths.nunjucks.src],
				setUp: function(env) {
					env.addFilter('asset', function(path) {
						return paths.nunjucks.assets + path;
					});
					return env;
				}
			}).on('error', function(err) {
				errorMessage(err);
				this.emit('end');
			}))
			.pipe(plugins.extReplace('.html'))
			.pipe(gulp.dest(paths.nunjucks.dest));
	}

});


/*
 Nunjucks Html Compilator Including Data
 */

gulp.task('static', ['nunjucks'], function(cb) {

	if (compilerOpt.enablePreview) {
		remove(paths.nunjucks.data + tmpjsondata, {force: true}, cb);
	}

});


/*
 Template Engine Format Converter
 */

gulp.task('tpl', function() {

	var argv = require('yargs')
		.usage('Usage: $0 --file [path]')
		.demand(['file'])
		.argv;

	if (argv.file != undefined && argv.file !== true)
	{
		var fileToConvert = paths.nunjucks.src + argv.file;

		if (fs.existsSync(fileToConvert))
		{
			// Load current converter
			var replaceThis = require('converters/'+ compilerOpt.tplConverter.converter +'.js').converter;

			// Log file conversion
			infoMessage('Converting \'' + argv.file + '\'');

			var convertDest = basePaths.dest + compilerOpt.tplConverter.outputPath;
			var replaceSpecific = compilerOpt.tplConverter.converterAddon;

			return 	gulp.src(fileToConvert)
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.batchReplace(replaceThis))
				.pipe(plugins.batchReplace(replaceSpecific))
				.pipe(plugins.extReplace(compilerOpt.tplConverter.outputFormat))
				.pipe(gulpif(compilerOpt.tplConverter.filesRenaming[argv.file] != undefined, plugins.rename(function (path) {
					path.basename = compilerOpt.tplConverter.filesRenaming[argv.file];
					path.extname = '';
				})))
				.pipe(gulpif(compilerOpt.tplConverter.injectView[path.basename(argv.file, compilerOpt.tplFormat) + compilerOpt.tplConverter.outputFormat] != undefined, plugins.htmlExtend({
					annotations: false,
					verbose: false,
					root: convertDest
				})))
				.pipe(gulpif(compilerOpt.tplConverter.filesRenaming[argv.file] != undefined, gulp.dest(convertDest), gulp.dest(convertDest + path.dirname(argv.file) + '/')));
		}
		else
		{
			errorMessage('File '+ argv.file +' doesn\'t exist !');
		}
	}
	else
	{
		errorMessage('Invalid argument --file !');
	}

});


/*
 Watcher
 */

var changedFile = {};

gulp.task('watch', ['default'], function(){

	gulp.watch(paths.styles.src + '**/*', ['css']).on('change', function(file) {
		fileChangeEvent(file);
	});

	gulp.watch(paths.scripts.src + '**/*', function(file) {
		changedFile['file'] = file.path;
		runSequence('js');
		fileChangeEvent(file);
	});

	gulp.watch(paths.images.src + '**/*', ['img']).on('change', function(file) {
		fileChangeEvent(file);
	});

	if (compilerOpt.enablePreview) {
		gulp.watch([
			paths.nunjucks.src + '**/*',
			paths.nunjucks.data + '**/*',
			'!' + paths.nunjucks.data + tmpjsondata
		], ['static']).on('change', function(evt) {
			fileChangeEvent(evt);
		});
	}

	gulp.watch([
		basePaths.assets.src + '*.*'
	], ['cp']).on('change', function(file) {
		fileChangeEvent(file);
	});

	gulp.watch([
		basePaths.assets.src + '**/*',
		'!' + paths.images.src,
		'!' + paths.images.src + '**',
		'!' + paths.scripts.src,
		'!' + paths.scripts.src + '**',
		'!' + paths.styles.src,
		'!' + paths.styles.src + '**'
	], ['cp']).on('change', function(file) {
		fileChangeEvent(file);
	});

	successMessage("Let's write some code ! Frontyc watcher is waiting for you...");

});


/*
 Gulp Default Task
 */

gulp.task('default', ['js', 'css', 'img', 'cp', 'static'], function() {});
