
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
		basePaths.assets.src + '*.*'
	], {base: basePaths.assets.src})
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
		.pipe(gulp.dest(basePaths.assets.dest));

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

	if (compilerOpt.enablePreview) {
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

	if (compilerOpt.enablePreview) {

		return gulp.src([
					paths.nunjucks.src + '*' + compilerOpt.tplFormat,
					'!' + paths.nunjucks.src + 'layouts'
				])
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
				}))
				.on('error', function(err) {
					console.log(err);// err is the error thrown by the Nunjucks compiler.
				})
				.pipe(plugins.extReplace('.html'))
				.pipe(gulp.dest(paths.nunjucks.dest));
	}	

});


/*
    Nunjucks Html Compilator Including Data
*/ 

gulp.task('tpl', ['nunjucks'], function(cb) {

	if (compilerOpt.enablePreview) {
		remove(paths.nunjucks.data + tmpjsondata, {force: true}, cb);
	}

});


/*
    MyID CMS Converter
*/ 

gulp.task('myid', function() {

	var argv = require('yargs')
			    .usage('Usage: $0 --file [path]')
			    .demand(['file'])
			    .argv;


	if (argv.file != undefined && argv.file !== true)
	{
		var fileToConvert = paths.nunjucks.src + argv.file;

		if (fs.existsSync(fileToConvert))
		{
			var replaceThis = [

				// loop.function
				[ '{{ loop.index }}', '<?= $this->array->index ?>' ],
				[ 'loop.index0', '$this->array->index' ],
				[ 'loop.index', '$this->array->index + 1' ],
				[ 'loop.last', 'count($this->array) == $this->array->index' ],
				[ 'loop.first', '$this->array->index == 0' ],
				[ '+ 1 + 1', '+ 2' ],
				[ 'loop.length', 'count($this->array)' ],
				[ '(not ', '(!' ],
				[ /([a-zA-Z0-9\[\]_]*)\.indexOf\(["|']([a-zA-Z0-9\[\]_]*)["|']\) \> -1/g, "strpos($$$1, '$2') !== FALSE" ],

				// {% block content %}{% endblock %}
				[ '{% block content %}{% endblock %}', '<?php print $content ?>' ],

				// {% block content %}<code />{% endblock %}
				[ /\{\% block content \%\}([\s\S]*)\{\% endblock \%\}/g, '<!-- Content :: Template injected -->'+'$1' ],

				// {% for a in b %}
				[ /\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$2->$3->$4 as $$$1): ?>' ],
				[ /\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$2->$3 as $$$1): ?>' ],
				[ /\{\% for ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*) \%\}/g, '<?php foreach($$$2 as $$$1): ?>' ],

				// {% for a, b in b %}
				[ /\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$3->$4->$5 as $$$1 => $$$2): ?>' ],
				[ /\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \%\}/g, '<?php foreach($$$3->$4 as $$$1 => $$$2): ?>' ],
				[ /\{\% for ([a-zA-Z0-9\[\]_]*), ([a-zA-Z0-9\[\]_]*) in ([a-zA-Z0-9\[\]_]*) \%\}/g, '<?php foreach($$$3 as $$$1 => $$$2): ?>' ],

				// {% endfor %}
				[ '{% endfor %}', '<?php endforeach; ?>' ],

				// {{ a.b.c }}
				[ /\{\{ loop.([^~]*?) \}\}/g, '<?= loop.$1 ?>' ],
				[ /\{\{ ([a-zA-Z0-9\[\]_]*) \}\}/g, '<?= $$$1 ?>' ],
				[ /\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2 ?>' ],
				[ /\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2->$3 ?>' ],
				[ /\{\{ ([a-zA-Z0-9\[\]_]*)(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*))(?:\.([a-zA-Z0-9\[\]_]*)) \}\}/g, '<?= $$$1->$2->$3->$4 ?>' ],

				// {% if condition %}
				//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ([0-9]*?)\) \%\}/g, '<?php if ($$$1 $2 $3): ?>' ], // number
				//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ((false|true)*)\) \%\}/g, '<?php if ($$$1 $2 $3): ?>' ], // boolean
				//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) ['|"](.*)['|"]\) \%\}/g, '<?php if ($$$1 $2 "$3"): ?>' ], // value
				//[ /\{\% if \(([a-zA-Z0-9\[\]_\-\>]*) (==|not|or) (.*)\) \%\}/g, '<?php if ($$$1 $2 $$$3): ?>' ], // variable
				[ /\{\% if \(([a-zA-Z0-9\[\]_]*) ([^~]*?)\) \%\}/g, '<?php if ($$$1 $2): ?>' ],
				[ /\{\% if \(([a-zA-Z0-9\[\]_]*)\.((?:[a-zA-Z0-9\[\]_])* )([^~]*?)\) \%\}/g, '<?php if ($$$1->$2$3): ?>' ],
				[ /\{\% if \(([^~]*?)\) \%\}/g, '<?php if ($1): ?>' ],

				// {% elif condition %}
				[ /\{\% elif \(([a-zA-Z0-9\[\]_]*) ([^~]*?)\) \%\}/g, '<?php elseif ($$$1 $2): ?>' ],
				[ /\{\% elif \(([a-zA-Z0-9\[\]_]*)\.((?:[a-zA-Z0-9\[\]_])* )([^~]*?)\) \%\}/g, '<?php elseif ($$$1->$2$3): ?>' ],
				[ /\{\% elif \(([^~]*?)\) \%\}/g, '<?php elseif ($1): ?>' ],

				// {% else %}
				[ '{% else %}', '<?php else: ?>' ],

				// {% endif %}
				[ '{% endif %}', '<?php endif; ?>' ],

				// $main->
				[ '$main->', '$template->' ],

				// $pageName->
				[ '$'+ argv.file.replace(/\.[^/.]+$/, '') +'->', '$' ],

				// {% macro macro() %}
				[ /\{\% macro ([^~]*?)\%\}(((\r*)(\n*))*)/g, '' ],
				[ '{% endmacro %}', '' ],

				// {{ macro.hero() }}
				[ /\{\{ macro([^~]*?)\}\}(\r\n){0,1}/g, '' ],

				// {% extends "page.html" %}
				[ /\{\% extends ([^~]*?)\%\}(((\r*)(\n*))*)/g, '' ],

				// {% raw %}<code />{% endraw %}
				[ /\{\% raw \%\}([^~]*?)\{\% endraw \%\}/g, '$1' ],

				// {% include "component.html" %}
				[ /\{\% include ["|']([a-zA-Z0-9\[\]_/]*).(.*)["|'] \%\}/g, '<?php $this->load->view(\'$1\'); ?>' ],

				// {% import "components" as macro %}
				[ /\{\% import ["|']([a-zA-Z0-9\[\]_/]*).(.*)["|'] as ([a-zA-Z0-9_]*) \%\}/g, '<?php $this->load->view(\'$1\'); ?>' ],

				// {{ 'link-to-asset' | asset }}
				[ /\{\{ ["|'](.*)["|'] \| asset \}\}/g, '<?= site_url(\'assets/$1\') ?>' ],

				// {{ something.something | replace('a', 'b') }}
				[ /\{\{ ([a-zA-Z0-9\[\]_]*)\.([a-zA-Z0-9\[\]_]*) \| replace\(['|"](.*)['|"], ['|"](.*)['|"]\) \}\}/g, '<?= str_replace(\'$3\', \'$4\', $$$1->$2) ?>' ],

				// <title></title>
				[ /\<title\>(.*)\<\/title\>(\r\n)/g, '' ],
				[ /\<\!\-\- Title \-\-\>(\r\n){1,}/g, '' ],

				// <meta name="description">
				[ /\<meta(.*)description([^~]*?)\>(\r\n)(\r\n)/g, '' ],

				// MyID $template requirements
				[ '</head>', "\t"+'<!-- myID -->'+"\n\t"+'<?php'+"\n\t\t"+'print $template->get_meta();'+"\n\t\t"+'print $template->get_css();'+"\n\t"+'?>'+"\n\n"+'</head>' ],
				[ '</body>', "\t"+'<!-- myID -->'+"\n\t"+'<?php'+"\n\t\t"+'print $template->get_scripts();'+"\n\t\t"+'print $template->google_tracker();'+"\n\t"+'?>'+"\n\n"+'</body>' ]

			];

			console.log( 'Converting \'' + console.colors.cyan(argv.file) + '\'' );

			var convertDest = basePaths.dest + compilerOpt.myid.outputPath;
			var replaceSpecific = compilerOpt.myid.myConverter;

			return 	gulp.src(fileToConvert)
						.pipe(plugins.batchReplace(replaceThis))
						.pipe(plugins.batchReplace(replaceSpecific))
						.pipe(plugins.extReplace(compilerOpt.myid.outputFormat))
						.pipe(gulpif(compilerOpt.myid.filesRenaming[argv.file] != undefined, plugins.rename(function (path) {
							path.basename = compilerOpt.myid.filesRenaming[argv.file];
							path.extname = '';
						})))

						.pipe(gulpif(compilerOpt.myid.injectView[path.basename(argv.file, compilerOpt.tplFormat) + compilerOpt.myid.outputFormat] != undefined, plugins.htmlExtend({
							annotations: false,
							verbose: false,
							root: convertDest
						})))

						.pipe(gulpif(compilerOpt.myid.filesRenaming[argv.file] != undefined, gulp.dest(convertDest), gulp.dest(convertDest + path.dirname(argv.file) + '/')));
		}
		else
		{
			console.log(console.colors.yellow('File '+ argv.file +' doesn\'t exist !'));
		}
	}
	else
	{
		console.log(console.colors.yellow('Invalid argument --file !'));
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

    if (compilerOpt.enablePreview) {
	    gulp.watch([
			paths.nunjucks.src + '**/*',
			paths.nunjucks.data + '**/*',
			'!' + paths.nunjucks.data + tmpjsondata
		], ['tpl']).on('change', function(evt) {
	        changeEvent(evt);
	    });
	}

    gulp.watch([
		basePaths.assets.src + '**/*',
		'!' + basePaths.assets.src + '*.*',
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
