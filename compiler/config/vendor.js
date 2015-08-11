
var basePaths = require('./paths.js').basePaths;

var vendorFiles = {

    /* Styles vendor list */
    styles: {
        // app.css is used as default style file, don't remove it
        'app.css': [
            /* basePaths.bower + 'slick-carousel/slick/slick.css',*/     // --- Slick Carousel (We recommend using sass files: sass/libraries.scss)
            /* basePaths.bower + 'font-awesome/css/font-awesome.css',*/  // --- Font Awesome (We recommend using sass files: sass/libraries.scss)
        ]
    },

    /* Scripts vendor list */
    scripts: {
        // app.js is used as default script file, don't remove it
        'app.js': [
            basePaths.bower + 'foundation/js/foundation/foundation.js',
            basePaths.bower + 'foundation/js/foundation/foundation.topbar.js'
            /* basePaths.bower + 'velocity/velocity.js',*/              // --- Velocity
            /* basePaths.bower + 'hammerjs/hammer.js',*/                // --- HammerJS
            /* basePaths.bower + 'gmaps/gmaps.js',*/                    // --- Gmaps.js
            /* basePaths.bower + 'slick-carousel/slick/slick.js',*/     // --- Slick Carousel
            /* basePaths.bower + 'riot/riot+compiler.js',*/             // --- Riot JS
        ],
        'jquery.js': [
            basePaths.bower + 'jquery/dist/jquery.js'
        ],
        'modernizr.js': [
            basePaths.bower + 'modernizr/modernizr.js'
        ]
    },

    /* Files vendor list */
    files: {
        'js/jquery.min.map': [
            basePaths.bower + 'jquery/dist/jquery.min.map'
        ],
        'fonts/': [
            basePaths.bower + 'font-awesome/fonts/*'
        ]
    }

};

exports.vendorFiles = vendorFiles;
