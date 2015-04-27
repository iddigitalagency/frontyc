
var basePaths = require('./paths.js').basePaths;

var vendorFiles = {

    /* Styles vendor list example */
    styles: {
        'app.css': [
            basePaths.vendor + 'bla/bla.css'
        ],
        'test.css' : [
            basePaths.vendor + 'bla/bla.css'
        ]
    },

    /* This example use Foundation framework */
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

exports.vendorFiles = vendorFiles;
