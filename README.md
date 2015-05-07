#  [WIP] Front-compiler

Boilerplate designed with [Gulp](http://gulpjs.com). Fully-configurable resources compilation and static website generator.


## Requirements

* Node.js: https://nodejs.org
* Gulp: `npm install -g gulp`
* Bower: `npm install -g bower`
* Nunjucks: `npm install -g nunjucks`
* Ruby (Used for Sass): https://www.ruby-lang.org/en/documentation/installation/
* Sass Gem: http://sass-lang.com/install
* Sass Globbing Plugin: https://github.com/chriseppstein/sass-globbing


## Note

`public`, `vendor` and `resources` folders are not required for your project. They are here only as a demo project starter.
If you want to use it as project starter, you will additionally need install the bower components by running `bower install` in your root folder. 


## Installation

First, copy `compiler` folder everywhere you want into your project. You can alternatively install it directly from composer:

```json
{
    "require": {
    	"maoosi/front-compiler": "0.0.*"
	}
}
```

Then, go into `compiler/config/default/` folder and copy all config files to `compiler/config/`. Configure your project by editing copied files.

> You can also change the config folder location by creating `compiler/config/external.js`
> ```javascript
/*
    Config folder
*/

var cfg = {
	configPath : '../../../../application/config/front-compiler/'
};


exports.cfg = cfg;
```

Finally, run the node setup command :

```shell
cd compiler
npm install # sudo npm install on linux
```

Project is ready to go !


## Usage

```shell
# Full project compilation
gulp

# Launch files watcher
gulp watch

# Detect errors, then compile and uglify all your scripts files including vendor config
gulp js

# Compile and minify all your styles files using sass and including vendor config
gulp css

# Compress all your images files {gif, jpg, png, svg}
gulp img

# If set in your config file, compile all your template files into static html using nunjucks and json models
gulp tpl

# Copy all other files you may include in your resources folder
gulp cp

# Clean destination folder
# /!\ Don't use it if your destination folder contains other files than the ones generated /!\
gulp clean
```


## Unix alias

When you install the compiler using composer, it could be painful to run command from the compiler folder. To facilitate this, here's an alias that you can easily set up on unix:

```shell
alias front='function _front(){ (cd ./vendor/maoosi/front-compiler/compiler/;"$@") };_front'
```

Now you can just run:

```shell
front gulp
```


## What's already setup with the project starter ?

* Javascript Task Runner : [Gulp](http://gulpjs.com)
* Front-End Package manager : [Bower](http://bower.io)
* Front-End Framework : [Foundation](http://foundation.zurb.com)
* CSS Preprocessor : [Sass](http://sass-lang.com)
* Sass Mixin Library : [Bourbon](http://bourbon.io)
* Sass Conventions Guide : [Csstyle](http://www.csstyle.io) `Not supported by libsass`
* Templating Engine : [Nunjucks](https://mozilla.github.io/nunjucks/)