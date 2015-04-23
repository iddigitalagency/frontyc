/*
    Primary Project Paths
*/

var basePaths = {
    src: './resources/',
    dest: './public/',
    bower: './vendor/bower/',
    vendor: './vendor/',
    node: './node_modules/'
};


/*
    Vendor Files
*/

var vendorFiles = {
    styles: {
        'default': [
            basePaths.vendor + 'bla.css'
        ],
        'test.css' : [
            basePaths.vendor + 'bla.css'
        ]
    },
    scripts: {
        'default': [
            basePaths.bower + 'foundation/js/foundation/foundation.js',
            basePaths.bower + 'foundation/js/foundation/foundation.topbar.js',
            basePaths.bower + 'foundation/js/foundation/foundation.accordion.js'
        ],
        'jquery.js': [
            basePaths.bower + 'jquery/dist/jquery.js'
        ],
        'jquery.min.map': [
            basePaths.bower + 'jquery/dist/jquery.min.map'
        ],
        'modernizer.js': [
            basePaths.bower + 'modernizr/modernizr.js'
        ]
    }
};


/*
    Secondary Project Paths
*/

var paths = {
    images: {
        src: basePaths.src + 'assets/images/',
        dest: basePaths.dest + 'assets/images/'
    },
    scripts: {
        src: basePaths.src + 'assets/js/',
        dest: basePaths.dest + 'assets/js/'
    },
    styles: {
        src: basePaths.src + 'assets/sass/',
        dest: basePaths.dest + 'assets/css/'
    },
    fonts: {
        src: basePaths.src + 'assets/fonts/',
        dest: basePaths.dest + 'assets/fonts/'
    },
    models: basePaths.src + 'models/',
    views: basePaths.src + 'views/'
};


/*
    Export Global Vars
*/

exports.basePaths = basePaths;
exports.vendorFiles = basePaths;
exports.paths = basePaths;


/*
    Gulp Plugins List
*/

/*var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var util = require('gulp-util');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var bulkSass = require('gulp-sass-bulk-import');
var imagemin = require('gulp-imagemin');
var nunjucks = require('gulp-nunjucks-html');
var data = require('gulp-data');*/
