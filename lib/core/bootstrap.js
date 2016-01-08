module.exports = {

	init: function (gulp) {


		/// Load global plugins
			global.__ = {
				colors: require('colors/safe')
			};


		/// Global vars
			var WATCHLIST = [];


		/// Read config file
			var modules = {
				styles: true
			};


		/// Helpers
			var _ = require('./helpers.js');


		/// Is dev mode
			var is_devMode = false;


		/// Load modules
			for (var module in modules) {
				if (modules[module] === true) {

					var _module = require('../modules/'+ module +'.js');

					this[module] = {
						tasks: _module.tasks(gulp)
					};

					//WATCHLIST = this[module].watcher(WATCHLIST);

				}
			}


		/// Start watcher
			/*gulp.task('watch', ['default'], function () {

			};*/


		/// Return stream
			return gulp;


	}

};
