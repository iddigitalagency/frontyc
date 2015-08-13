
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
var argv = require('yargs').argv;
var sourcemaps = require('gulp-sourcemaps');


/*
 uniqid
 */

var __uniqid = new Date().getTime();


/*
 --dev mode
 */

var __dev = (argv.dev) ? true : false;


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
		var fileToRemoveBaseDir = path.basename( path.dirname(fileToRemove) );

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

		// Clean assets (images, scripts, styles)
		basePaths.assets.dest +'**/*',

		// Clean nunjucks static preview
		paths.nunjucks.dest +'**/*'

	], {force: true});

});


/*
 Javascript Errors Detector
 */

gulp.task('jshint', function() {

	if(__dev) {
		return stream = gulp.src(paths.scripts.src + '**/*.js')
			.pipe(plugins.jshint())
			.pipe(plugins.jshint.reporter(stylish));
	}

});


/*
 Javascript Generator
 */

var vendorCompilation = function _vendorCompilation(vendorList, fileType) {
	var stream;
	var _ext = fileType;

	for (var destFile in vendorList)
	{
		var destFileMin = destFile.replace('.'+_ext, '.min.'+_ext);
		var requireMinify = ( destFile.search('.'+_ext) == -1 || destFile.search('.min.'+_ext) != -1 || __dev == true) ? false : true;

		// Log file generation
		infoMessage('Creating \'' + destFile + '\'');

		// Log file minification
		if (requireMinify) infoMessage('Minifying \'' + destFileMin + '\'');

		// Log child files
		for (var n = 0, len = vendorList[destFile].length; n < len; ++n)
			neutralMessage(' |--> ' + vendorList[destFile][n]);

		if (_ext == 'js') {
			// Remove old version of the file
			if (requireMinify) remove(paths.scripts.dest + destFileMin.replace('.min', '.min-*'), {force: true});

			stream = gulp.src(vendorList[destFile])
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.concat(destFile))
				.pipe(gulpif(requireMinify, plugins.rename(destFileMin)))
				.pipe(gulpif(requireMinify, plugins.uglify()))
				.pipe(gulpif(requireMinify, plugins.hash()))
				.pipe(gulp.dest(paths.scripts.dest))
				.pipe(gulpif(requireMinify, plugins.hash.manifest('js-manifest.json', true)))
				.pipe(gulpif(requireMinify, gulp.dest(basePaths.assets.dest)));
		} else {
			// Remove old version of the file
			if (requireMinify) remove(paths.styles.dest + destFileMin.replace('.min', '.min-*'), {force: true});

			stream = gulp.src(vendorList[destFile])
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.concat(destFile))
				.pipe(gulpif(requireMinify, plugins.rename(destFileMin)))
				.pipe(gulpif(requireMinify, plugins.minifyCss()))
				.pipe(gulpif(requireMinify, plugins.hash()))
				.pipe(gulpif(requireMinify, gulp.dest(paths.styles.dest)))
				.pipe(gulpif(requireMinify, plugins.hash.manifest('css-manifest.json', true)))
				.pipe(gulpif(requireMinify, gulp.dest(basePaths.assets.dest)));
		}
	}

	return stream;
};


gulp.task('js', ['jshint'], function() {

	remove(basePaths.assets.dest + 'js-manifest.json', {force: true});
	var jsVendorList = JSON.parse(JSON.stringify(vendorFiles.scripts));

	// Add user scripts
	fs.readdirSync(paths.scripts.src).filter(function(_unknown) {
		var currentPath = path.join(paths.scripts.src, _unknown);
		var currentUnknown = path.basename(currentPath);

		// Add scripts to respective .js file
		if (fs.statSync(currentPath).isDirectory()) {
			var scriptsList = (typeof jsVendorList[currentUnknown + '.js'] !== 'undefined') ? jsVendorList[currentUnknown + '.js'] : [];

			// All scripts inside directory
			fs.readdirSync(currentPath).filter(function(_file) {
				var currentSubPath = path.join(paths.scripts.src, _unknown, _file);

				if (!fs.statSync(currentSubPath).isDirectory()) {
					var currentFile = path.basename(currentSubPath);
					scriptsList.push(paths.scripts.src + currentUnknown + '/' + currentFile);
				}
			});

			jsVendorList[currentUnknown + '.js'] = scriptsList;
		}
		// Add scripts to app.js
		else {
			jsVendorList['app.js'].push(paths.scripts.src + currentUnknown);
		}
	});

	// If only one file modified, vendorList is overwritten
	if (typeof changedFile.file !== 'undefined') {
		jsVendorList = parentSearch(jsVendorList, changedFile.file);
	}

	// Run concat and minify
	return vendorCompilation(jsVendorList, 'js');

});


/*
 Sass Compilator
 */

gulp.task('sass', function() {

	if (compilerOpt.useRubySass) {

		// Sass compilation using ruby sass gem
		return plugins.rubySass(paths.styles.src + 'libraries.scss', {require: 'sass-globbing', loadPath: paths.styles.src, sourcemap: true })
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					errorMessage(err);
					this.emit('end');
				}
			}))
			.pipe(plugins.rename('app.css'))
			.pipe(gulpif(__dev, sourcemaps.write('./')))
			.pipe(gulp.dest(paths.styles.dest));

	} else {

		// Sass compilation using libsass library
		return gulp.src(paths.styles.src + 'libraries.scss')
			.pipe(sourcemaps.init())
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					errorMessage(err);
					this.emit('end');
				}
			}))
			.pipe(plugins.sassBulkImport())
			.pipe(plugins.sass())
			.pipe(plugins.rename('app.css'))
			.pipe(gulpif(__dev, sourcemaps.write('./')))
			.pipe(gulp.dest(paths.styles.dest));

	}

});


/*
 Css Generator
 */

gulp.task('css', ['sass'], function() {

	remove(basePaths.assets.dest + 'css-manifest.json', {force: true});
	var cssVendorList = JSON.parse(JSON.stringify(vendorFiles.styles));
	cssVendorList['app.css'].push(paths.styles.dest + 'app.css');
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
 Root Files Copy
 */

gulp.task('cpfiles', function() {

	var stream, destPath;
	var filesVendorList = JSON.parse(JSON.stringify(vendorFiles.files));

	for (var destGroup in filesVendorList) {

		for (var destFile in filesVendorList[destGroup]) {

			stream = gulp.src(filesVendorList[destGroup][destFile], {base: path.dirname(filesVendorList[destGroup][destFile])})
								.pipe(plugins.plumber({
									errorHandler: function (err) {
										errorMessage(err);
										this.emit('end');
									}
								}))
								.pipe(gulp.dest(basePaths.assets.dest + '/' + destGroup));
		}

	}

	return stream;

});


/*
 Root Files Copy
 */

gulp.task('cproot', function() {

	return gulp.src([
			basePaths.src + 'root/.htaccess',
			basePaths.src + 'root/**/*'
		], {base: basePaths.src + 'root/'})
		.pipe(plugins.plumber({
			errorHandler: function (err) {
				errorMessage(err);
				this.emit('end');
			}
		}))
		.pipe(gulp.dest(basePaths.dest));

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
						var assetsDir = basePaths.assets.dest.replace(root_dir, '');

						var _asset = paths.nunjucks.assets + path;
							_asset = _asset.replace(assetsDir+'../', '');

						if (!__dev) {
							var cssmanifest = JSON.parse(fs.readFileSync(basePaths.assets.dest + 'css-manifest.json', 'utf8'));
							var jsmanifest = JSON.parse(fs.readFileSync(basePaths.assets.dest + 'js-manifest.json', 'utf8'));

							var cssDir = paths.styles.dest.replace(basePaths.assets.dest, '');
							var jsDir = paths.scripts.dest.replace(basePaths.assets.dest, '');

							if ( typeof cssmanifest[_asset.replace(paths.nunjucks.assets + cssDir, '')] !== 'undefined' )
								_asset = _asset.replace( path , cssDir+cssmanifest[_asset.replace(paths.nunjucks.assets + cssDir, '')] );

							if ( typeof jsmanifest[_asset.replace(paths.nunjucks.assets + jsDir, '')] !== 'undefined' )
								_asset = _asset.replace( path , jsDir+jsmanifest[_asset.replace(paths.nunjucks.assets + jsDir, '')] );
						}

						return _asset;
					});
					return env;
				}
			}).on('error', function(err) {
				errorMessage(err);
				this.emit('end');
			}))
			.pipe(gulpif(__dev, plugins.batchReplace([ ['.min.js', '.js'], ['.min.css', '.css'] ])))
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

var processConversion = function(fileToConvert, _file) {

	// Load current converter
	var replaceThis = require('./converters/'+ compilerOpt.tplConverter.converter +'.js')(_file);

	// Log file conversion
	infoMessage('Converting \'' + _file + '\'');

	var convertDest = basePaths.dest + compilerOpt.tplConverter.outputPath;
	var replaceSpecific = compilerOpt.tplConverter.converterAddon;

	return gulp.src(fileToConvert)
				.pipe(plugins.plumber({
					errorHandler: function (err) {
						errorMessage(err);
						this.emit('end');
					}
				}))
				.pipe(plugins.batchReplace(replaceThis))
				.pipe(plugins.batchReplace(replaceSpecific))
				.pipe(plugins.extReplace(compilerOpt.tplConverter.outputFormat))
				.pipe(gulpif(compilerOpt.tplConverter.filesRenaming[_file] != undefined, plugins.rename(function (path) {
					path.basename = compilerOpt.tplConverter.filesRenaming[_file];
					path.extname = '';
				})))
				.pipe(gulpif(compilerOpt.tplConverter.injectView[path.basename(_file, compilerOpt.tplFormat) + compilerOpt.tplConverter.outputFormat] != undefined, plugins.htmlExtend({
					annotations: false,
					verbose: false,
					root: convertDest
				})))
				.pipe(gulpif(compilerOpt.tplConverter.filesRenaming[_file] != undefined, gulp.dest(convertDest), gulp.dest(convertDest + path.dirname(_file) + '/')));

};

gulp.task('tpl', function() {

	var param = require('yargs')
		.usage('Usage: $0 --file [path] / $0')
		.argv;

	if (param.file != undefined && param.file !== true && path.basename(param.file) !== '*')
	{
		var fileToConvert = paths.nunjucks.src + param.file;

		if (fs.existsSync(fileToConvert)) return processConversion(fileToConvert, param.file);
		else errorMessage('File '+ param.file +' doesn\'t exist !');
	}
	else
	{
		var stream;
		var convertDir = (param.file === undefined) ? paths.nunjucks.src : paths.nunjucks.src + path.dirname(param.file) + '/';

		// If conversion occurs on a folder
		fs.readdirSync(convertDir).filter(function(_path) {
			if (_path !== 'layouts') {

				// If there is a subfolder
				if ( fs.statSync(convertDir + _path).isDirectory() ) {
					fs.readdirSync(convertDir + _path).filter(function(_file) {
						stream = processConversion(convertDir + _path + '/' + _file, _path + '/' + _file);
					});
				}
				// If there is no subfolder
				else {
					if (path.basename(convertDir) !== path.basename(paths.nunjucks.src))
						stream = processConversion(convertDir + _path, path.basename(convertDir) + '/' + _path);
					else
						stream = processConversion(convertDir + _path, _path);
				}

			}
		});

		return stream;
	}

});


/*
 Watcher
 */

var changedFile = {};

gulp.task('watch', ['default'], function(){

	// Watch vendor config
	gulp.watch(configPath + 'vendor.js', function(file) {
		changedFile['file'] = undefined;
		delete require.cache[ require.resolve(configPath + 'vendor.js') ];
		vendorFiles = require(configPath + 'vendor.js').vendorFiles;
		runSequence('default');
		fileChangeEvent(file);
	});

	// Watch root folder
	gulp.watch([
		basePaths.src + 'root/.htaccess',
		basePaths.src + 'root/**/*'
	], ['cproot']).on('change', function(file) {
		fileChangeEvent(file);
	});

	// Watch styles
	gulp.watch(paths.styles.src + '**/*', function(file) {
		changedFile['file'] = file.path;
		if (!__dev) runSequence('css', 'static');
		else runSequence('css');
		fileChangeEvent(file);
	});

	// Watch scripts
	gulp.watch(paths.scripts.src + '**/*', function(file) {
		changedFile['file'] = file.path;
		if (!__dev) runSequence('js', 'static');
		else runSequence('js');
		fileChangeEvent(file);
	});

	// Watch images
	gulp.watch(paths.images.src + '**/*', ['img']).on('change', function(file) {
		fileChangeEvent(file);
	});

	// Watch views & models
	if (compilerOpt.enablePreview) {
		gulp.watch([
			paths.nunjucks.src + '**/*',
			paths.nunjucks.data + '**/*',
			'!' + paths.nunjucks.data + tmpjsondata
		], ['static']).on('change', function(evt) {
			fileChangeEvent(evt);
		});
	}

	// Watch assets files
	gulp.watch([
		basePaths.assets.src + '*.*'
	], ['cp']).on('change', function(file) {
		fileChangeEvent(file);
	});

	// Watch assets folders
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

gulp.task('default', ['js', 'css', 'img', 'cp', 'cproot', 'cpfiles'], function() {
	runSequence('static');
});
