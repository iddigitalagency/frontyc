module.exports = {

	init: function (gulp, CWD) {


		/// Load global plugins
			global.__ = {
				term: require( 'terminal-kit' ).terminal
			};


		/// Dependencies
			var fs = require('fs-extra');
			var _ = require('./helpers.js');


		/// Global vars
			var WATCHLIST = [];


		/// Read config file
			var CONF = fs.readJsonSync(CWD + '/.ftyc', 'utf8', {throws: false});


		/// Load modules
			for (var module in CONF.modules) {
				if (CONF.modules[module] === true) {

					var moduleFile = 'modules/'+ module +'.js';

					fs.stat(moduleFile, function(err, stat) {
				        if(err == null) {
							var _module = require(moduleFile);

							this[module] = {
								tasks: _module.tasks(gulp)
							};
						}
					});

					//WATCHLIST = this[module].watcher(WATCHLIST);

				}
			}


		/// Start watcher
			//gulp.task('default');
			/*gulp.task('watch', ['default'], function () {

			};*/


		/// Return stream
			return gulp;


	}

};
