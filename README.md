#  [beta] Frontyc

Front-end compiler designed with [Gulp](http://gulpjs.com). Fully-configurable resources compilation and static website generator.


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
If you want to use it as a boilerplate, you will additionally need to install bower components by running `bower install` in your root folder. 


## Installation

First, copy `compiler` folder everywhere you want into your project. You can alternatively install it directly from composer:

``` json
{
    "require": {
    	"maoosi/frontyc": "dev-master"
	}
}
```

Then, go into `compiler/config/` folder and configure your project by editing files.

> You can also change the config folder location by creating `compiler/config/external.js` containing this:

``` javascript
/*
    Config folder
*/

var cfg = {
	configPath : 'path-to-config-folder/'
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
gulp static

# Copy all other files you may include in your resources folder (folder copied into assets folder, files copied to root folder)
gulp cp

# Convert a file to the template engine format of your choice (myid / twig / blade)
gulp tpl --file filename.twig
```


## Unix alias

When you install the compiler using composer, it could be painful to run command from the compiler folder. To make it easier, here's an alias that you can easily set up on Unix:

```shell
alias ftyc='function _frontyc(){ (cd ./vendor/maoosi/frontyc/compiler/;gulp "$@") };_frontyc'
```

Now you can just run in yout project root directory:

```shell
ftyc / ftyc watch / ftyc js / ...
```


## What's already setup with the project starter ?

* Javascript Task Runner : [Gulp](http://gulpjs.com)
* Front-End Package manager : [Bower](http://bower.io)
* Front-End Framework : [Foundation](http://foundation.zurb.com)
* CSS Preprocessor : [Sass](http://sass-lang.com)
* Sass Mixin Library : [Bourbon](http://bourbon.io)
* Sass Conventions Guide : [Csstyle](http://www.csstyle.io) `Not supported by libsass`
* Templating Engine : [Nunjucks](https://mozilla.github.io/nunjucks/)