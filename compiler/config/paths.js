
var root_dir = '../';

var basePaths = {

    src: root_dir + 'resources/', // Path to sources folder
    dest: root_dir + 'public/', // Path to www / root / public_html

    vendor: root_dir + 'vendor/',
    bower: root_dir + './vendor/bower/',

    assets: {
        src: root_dir + 'resources/assets/',
        dest: root_dir + 'public/assets/'
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

    /* Used for Nunjucks templates compilation */
    nunjucks: {
        data: basePaths.src + 'models/',
        src: basePaths.src + 'views/',
        dest: basePaths.dest,
        assets: 'assets/'
    }
};

exports.basePaths = basePaths;
exports.paths = paths;
