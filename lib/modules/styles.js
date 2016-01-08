module.exports = {

	tasks: function (gulp) {

		/// Sass compilation using libsass library
			gulp.task('sass', function() {

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

			});


		/// Css generation
			gulp.task('css', ['sass'], function() {

				var cssVendorList = JSON.parse(JSON.stringify(vendorFiles.styles));
				cssVendorList['app.css'].unshift(paths.styles.dest + 'app.css');
				return vendorCompilation(cssVendorList, 'css');

			});

	},

	watcher: function (watchList) {

		return watchList.push('css');

	}
	
}