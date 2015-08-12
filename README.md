#  Frontyc [beta]


**Front-end compiler designed with [Gulp](http://gulpjs.com).**

- Fully-configurable
- Easy workflow integration
- Smart and fast resources compilation
- Static website generation
- Modern development using twig views and json models for data binding
- Template engine converter (myid / twig)


## What third party tools are integrated with Frontyc ?

* Javascript Task Runner : [Gulp](http://gulpjs.com)
* Front-End Package manager : [Bower](http://bower.io)
* Front-End Framework : [Foundation](http://foundation.zurb.com)
* CSS Preprocessor : [Sass](http://sass-lang.com)
* Sass Mixin Library : [Bourbon](http://bourbon.io)
* Sass Conventions Guide : [Csstyle](http://www.csstyle.io) `Not supported by libsass`
* Templating Engine : [Nunjucks](https://mozilla.github.io/nunjucks/)


## Requirements before install

* **Node.js with npm:** https://nodejs.org
* **Npm libraries:** `npm install -g bower gulp nunjucks`
* **Ruby:** https://www.ruby-lang.org/en/documentation/installation/
* **Sass Gem:** http://sass-lang.com/install `sudo gem install sass`
* **Sass Globbing Plugin:** https://github.com/chriseppstein/sass-globbing `gem install sass-globbing`


## Installation


### Automated installation via composer (recommended)

**1/** Add the following requirement into your `composer.json` file, then run composer install command:

``` json
"require": {
	"maoosi/frontyc": "dev-master"
}
```

**2/** If you can't run unix commands on your environment, you'll have to copy manually the .sh file `./vendor/maoosi/frontyc/compiler/ftyc.sh` into your root folder, then execute it `./ftyc.sh`. For others, just run the following command :

```shell
cp ./vendor/maoosi/frontyc/compiler/ftyc.sh ftyc.sh ; chmod 0777 ftyc.sh ; ./ftyc.sh
```

**3/** That's it ! Your project is now ready to use, just think about to configure your project by editing files located into the new `--config` folder.


## Usage

```shell
######################
# MAIN COMMANDS:

	# Full project compilation
	ftyc

	# Including --dev flag to any command will disable
	# css & js minification for a quicker compilation
	ftyc --dev

	# Launch files watcher with smart compilation
	ftyc watch  //  ftyc watch --dev

	# Convert a file, or a folder, to the template engine format of your choice
	ftyc tpl --file filename.twig // ftyc tpl --file directory/*

######################
# ADDITIONAL COMMANDS:

	# Detect errors, then compile and uglify all your scripts files
	# including vendor config
	ftyc js

	# Compile and minify all your styles files using sass and
	# including vendor config
	ftyc css

	# Compress all your images files {gif, jpg, png, svg}
	ftyc img

	# If set in your config file, compile all your template files
	# into static html using nunjucks and json models
	ftyc static

	# Copy all other files you may include in your resources folder
	# (folder copied into assets folder, files copied to root folder)
	ftyc cp
```

## FAQ

### I encounter errors when I run `./ftyc.sh` file

// TODO

### ftyc command not found...

That means you need to set up a permanent unix alias on your machine :

```shell
alias ftyc='function _frontyc(){ (cd ./vendor/maoosi/frontyc/compiler/;gulp "$@") };_frontyc'
```

Alternatively, you can also replace `ftyc` by `gulp` for each command.

### What if I don't want to use composer ?

Well, it's up to you...

**1/** Copy `compiler` folder everywhere you want into your project.

**2/** Go into `compiler` folder, then run the following npm setup command :

```shell
npm install
```

**3/** Go into `compiler/config/` folder and configure your project by editing files.

**4/** If you plan to use Bower for libraries dependency, just copy `bower.json` and `.bowerrc` files into the root of your project, then run `bower install`.

### How to change the config folder location ?

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


## License

Copyright (c) 2015 Sylvain Simao. Licensed under the MIT license.
