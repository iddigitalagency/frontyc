var __ = GLOBAL.__;

module.exports = {

	/// Console output
		error: function (message) {
			return console.error(__.colors.red(message));
		},

		success: function (message) {
			return console.log(__.colors.green(message));
		},

		info: function (message) {
			return console.info(__.colors.cyan(message));
		},

		warn: function (message) {
			return console.warn(__.colors.yellow(message));
		},

		log: function (message) {
			return console.log(__.colors.white(message));
		},

	/// Arrays
		searchParent: function (arr, child) {
			var child = child.replace(/^.*[\\\/]/, '');

			for (var key in arr)
				for (var i=0; i<arr[key].length; i++)
					if (arr[key][i].replace(/^.*[\\\/]/, '') === child)
						return { key: arr[key] };

			return {};
		},

	/// Vendors compilation
		vendorCompilation: function (vendorList, extension) {
			var stream;

			for (var outputFile in vendorList)
			{
				var outputFileMin 	= outputFile.replace('.'+extension, '.min.'+extension),
					requires_minify = ( outputFile.search('.'+extension) == -1 ||
										outputFile.search('.min.'+extension) != -1 ||
										dev == true ) ? false : true;

				// Log file generation
				this.info('Creating \'' + outputFile + '\'');

				// Log file minification
				if (requires_minify)
					this.info('Minifying \'' + outputFileMin + '\'');

				// Log child files
				for (var n = 0, len = vendorList[outputFile].length; n < len; ++n)
					this.log(' |--> ' + vendorList[outputFile][n]);

				if (extension == 'js') {
					stream = gulp.src(vendorList[outputFile])
						.pipe(plugins.plumber({
							errorHandler: function (err) {
								this.error(err);
								this.emit('end');
							}
						}))
						.pipe(plugins.concat(outputFile))
						.pipe(gulp.dest(paths.scripts.dest))
						.pipe(gulpif(requires_minify, plugins.rename(outputFileMin)))
						.pipe(gulpif(requires_minify, plugins.uglify()))
						.pipe(gulpif(requires_minify, gulp.dest(paths.scripts.dest)));
				} else {
					stream = gulp.src(vendorList[outputFile])
						.pipe(plugins.plumber({
							errorHandler: function (err) {
								this.error(err);
								this.emit('end');
							}
						}))
						.pipe(plugins.concat(outputFile))
						.pipe(gulp.dest(paths.styles.dest))
						.pipe(gulpif(requires_minify, plugins.rename(outputFileMin)))
						.pipe(gulpif(requires_minify, plugins.minifyCss()))
						.pipe(gulpif(requires_minify, gulp.dest(paths.styles.dest)));
				}
			}

			return stream;
		}

};
