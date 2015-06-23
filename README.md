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

`public` and `--sources` folders, even as all the files located in the project root, are not required for your project. They are only here for tests and demo purpose. If you want, you can also use it as a boilerplate for quick project setup.


## Installation

### Installing via composer (recommended)

**1/** Add the following code into your `composer.json` file, then run `composer install` command:

``` json
"require": {
	"maoosi/frontyc": "dev-master"
}
```

**2/** Go into `vendor/maoosi/frontyc/compiler` folder, then run the following npm setup command :

```shell
npm install # sudo npm install on linux
```

**3/** If you really want to, you can just go into `vendor/maoosi/frontyc/compiler/config/` folder and configure your project by editing files. But if you're using composer, **we recommend to skip this step** and to change config folder location (refer to the following section).

**4/** If you plan to use Bower for libraries dependency, just copy `bower.json` and `.bowerrc` files into the root of your project, then run `bower install`.


### Changing the config folder location (recommended when using composer)

> You can change the config folder location by creating the following `external.js` file into `compiler/config` folder:

``` javascript
/*
    Config folder
*/

var cfg = {
	configPath : 'path-to-config-folder/'
};

exports.cfg = cfg;
```

Next step is to copy all the files located into `vendor/maoosi/frontyc/compiler/config/` folder to your new configurated path. Finally, configure your project by editing these files.

### Setup Unix alias (recommended when using composer)

When you install the compiler using composer, it could be annoying to run command from the compiler folder. To make it easier, here's an alias that you can easily set up on Unix:

```shell
alias ftyc='function _frontyc(){ (cd ./vendor/maoosi/frontyc/compiler/;gulp "$@") };_frontyc'
```

Now you can just run the follwing commands directly from your project root:

```shell
ftyc / ftyc watch / ...
```
> Refer to **usage** section for more available commands.

### Manual installation

**1/** Copy `compiler` folder everywhere you want into your project.

**2/** Go into `compiler` folder, then run the following npm setup command :

```shell
npm install # sudo npm install on linux
```

**3/** Go into `compiler/config/` folder and configure your project by editing files.

**4/** If you plan to use Bower for libraries dependency, just copy `bower.json` and `.bowerrc` files into the root of your project, then run `bower install`.


### Semi-automated installation (experimented users)

> This install method is specific to unix environment. Moreover, it's designed for bigger projects using composer, bower and git.

**1/** Add the following code into your `composer.json` file, then run composer install command:

``` json
"require": {
	"maoosi/frontyc": "dev-master"
}
```

**2/** Copy `ftyc.sh` file into your project root folder, then run it using the following command:

```shell
./ftyc.sh
```

**3/** That's it ! Your project is now ready to use, just think about configurating your project by editing files located into the new `--config` folder.

## Usage

```shell
######################
# MAIN COMMANDS:

	# Full project compilation
	gulp  //  ftyc

	# Including --dev flag to any command will disable css & js minification for a quicker compilation
	gulp --dev  //  ftyc --dev

	# Launch files watcher with smart compilation
	gulp watch  //  ftyc watch

	# Convert a file to the template engine format of your choice (myid / twig / blade)
	gulp tpl --file filename.twig  //  ftyc tpl --file filename.twig

######################
# ADDITIONAL COMMANDS:

	# Detect errors, then compile and uglify all your scripts files including vendor config
	gulp js  //  ftyc js

	# Compile and minify all your styles files using sass and including vendor config
	gulp css  //  ftyc css

	# Compress all your images files {gif, jpg, png, svg}
	gulp img  //  ftyc img

	# If set in your config file, compile all your template files into static html using nunjucks and json models
	gulp static  //  ftyc static

	# Copy all other files you may include in your resources folder (folder copied into assets folder, files copied to root folder)
	gulp cp  //  ftyc cp
```





## What's already setup with the project starter ?

* Javascript Task Runner : [Gulp](http://gulpjs.com)
* Front-End Package manager : [Bower](http://bower.io)
* Front-End Framework : [Foundation](http://foundation.zurb.com)
* CSS Preprocessor : [Sass](http://sass-lang.com)
* Sass Mixin Library : [Bourbon](http://bourbon.io)
* Sass Conventions Guide : [Csstyle](http://www.csstyle.io) `Not supported by libsass`
* Templating Engine : [Nunjucks](https://mozilla.github.io/nunjucks/)