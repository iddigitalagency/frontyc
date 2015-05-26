
var basePaths = require('./paths.js').basePaths;

var vendorFiles = {

    /* Styles vendor list example */
    styles: {
        // app.css is used as default style file, don't remove it
        'app.css': [
            basePaths.vendor + 'test/test.css'
        ],
        'test.css' : [
            basePaths.vendor + 'test/test.css'
        ]
    },

    /* This example use Foundation framework */
    scripts: {
        // app.js is used as default script file, don't remove it
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
        'modernizr.js': [
            basePaths.bower + 'modernizr/modernizr.js'
        ]
    }

};

exports.vendorFiles = vendorFiles;
