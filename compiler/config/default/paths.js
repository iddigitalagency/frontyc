
var root_dir = '../';

var basePaths = {

    src: root_dir + 'resources/',
    dest: root_dir + 'public/',
    vendor: root_dir + 'vendor/',
    bower: root_dir + './vendor/bower/'

};

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

    /* Used for Nunjucks templates compilation */
    nunjucks: {
        data: basePaths.src + 'models/',
        src: basePaths.src + 'views/',
        dest: basePaths.dest,
    }
};

exports.basePaths = basePaths;
exports.paths = paths;
