
var root_dir = '../';

var basePaths = {

    src: root_dir + '--sources/', // Path to sources folder
    dest: root_dir, // Path to www / root / public_html

    bower: root_dir + './vendor/bower/',

    assets: {
        src: root_dir + '--sources/assets/',
        dest: root_dir + 'assets/'
    }

};

var paths = {

    images: {
        src: basePaths.assets.src + 'images/',
        dest: basePaths.assets.dest + 'images/'
    },

    scripts: {
        src: basePaths.assets.src + 'scripts/',
        dest: basePaths.assets.dest + 'js/'
    },

    styles: {
        src: basePaths.assets.src + 'sass/',
        dest: basePaths.assets.dest + 'css/'
    },

    /* Used for Nunjucks static templates compilation */
    nunjucks: {
        data: basePaths.src + 'models/',
        src: basePaths.src + 'views/',
        dest: basePaths.dest + '--preview',
        assets: '../assets/'
    }

};

exports.basePaths = basePaths;
exports.paths = paths;
exports.root_dir = root_dir;
