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
        'app.css': [
            basePaths.vendor + 'bla.css'
        ],
        'test.css' : [
            basePaths.vendor + 'bla.css'
        ]
    },
    scripts: {
        'app.js': [
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
    assets: {
        src: basePaths.src + 'assets/',
        dest: basePaths.dest + 'assets/'
    },
    images: {
        src: basePaths.src + 'assets/images/',
        dest: basePaths.dest + 'assets/images/'
    },
    scripts: {
        src: basePaths.src + 'assets/scripts/',
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
exports.vendorFiles = vendorFiles;
exports.paths = paths;
