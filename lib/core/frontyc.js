"use strict";

var Fs 		= require('fs-extra');
var Term 	= require( 'terminal-kit' ).terminal;
var Helpers = require('./helpers.js');

/**
 * Creates an instance of Frontyc.
 *
 * @constructor
 * @this {Frontyc}
 * @param {object} gulp - The current gulp instance.
 * @param {string} cwd - The current working directory.
 */
var Frontyc = function (gulp, cwd) {
	this.gulp = gulp;
	this.cwd = cwd;
	this.config = {};
	this.watchList = [];
}

/**
 * Frontyc Class definition.
 *
 * @this {Frontyc}
 */
Frontyc.prototype = (function () {

	/**
	 * Read a JSON file.
	 *
	 * @param {string} filePath - The absolute path to the .json file
	 * @return {object}
	 */
	var readJsonFile = function (filePath) {
		return Fs.readJsonSync(filePath, 'utf8', {throws: false});
	};

	/**
	 * Load a specific Frontyc module.
	 *
	 * @this {Frontyc}
	 * @param {string} module - The module name to load
	 */
	var loadModule = function (module) {
		var modulePath = 'modules/'+ module +'.js';

		fs.stat(modulePath, function(err, stat) {
			if(err == null) {
				return {
					tasks: require(modulePath).tasks(this.gulp)
				};
			}
		});
	};

	/**
	 * Load all the active Frontyc modules.
	 *
	 * @this {Frontyc}
	 */
	var loadAllModules = function () {
		var watchList = [];

		for (var module in this.config.modules) {
			if (this.config.modules[module] === true) {
				watchList.push(this.loadModule(module))
			}
		}

		return watchList;
	};

	var getStream = function () {
		return this.gulp;
	};

	var runWatcher = function () {
		/// Start watcher
			//gulp.task('default');
			/*gulp.task('watch', ['default'], function () {

			};*/

		return this.getStream();
	};

	/**
	 * Initialize Frontyc compiler
	 *
	 * @this {Frontyc}
	 */
	var init = function () {

		// Read & store the config
		this.config = this._readJsonFile(this.cwd + '/.ftyc');

		// Load all Frontyc modules
		this.watchList = this.loadAllModules();

		// Run the gulp watcher & return the Stream
		return this.runWatcher();

	}

	/**
	 * Return Frontyc public functions
	 */
	return {
		run: init
	}

}());

module.exports = Frontyc;
