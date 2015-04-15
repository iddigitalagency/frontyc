#  [WIP] Front-starter

A boilerplate for static Html5 websites (Foundation, Sass, Bourbon, Csstyle, Gulp, Bower, Nunjucks).


## 1/ Devbox pre-requirements

* Node.js: https://nodejs.org
* Gulp: `npm install -g gulp`
* Bower: `npm install -g bower`
* Nunjucks: `npm install -g nunjucks`
* Ruby (Sass compilation): https://www.ruby-lang.org/en/documentation/installation/


## 2/ Devbox project setup

1. Install node modules : `npm install`
2. Install bower libraries : `bower install`


## 3/ Project compilation

* Manual compilation : `gulp`
* Automatic compilation with gulp watcher : `gulp watch`


## 4/ Application structure

* `public` : Public folder that will contains compiled files (www_root)
* `tmp` : Tmp folder used for compilation
* `vendor` : Vendor folder that contains external libraries (bower components)
* `resources` : Resources folder that contains source files (MVP structure)
* `resources\assets` : Contain all assets used by your application (refer to next section for more information)
* `resources\views` : Contain all web views required for each pages
* `resources\views\layouts` : Contain all the parent layouts (templates)
* `resources\models` : Contain all JSON data files used by Nunjucks


## 5/ Automated tasks (using Gulp)

* Static pages generation using Nunjucks (HTML5 files from `resources\layouts` and `resources\views`)
* Detect errors and potential problems in JavaScript code (JS files from `resources\assets\scripts`)
* Minification of JavaScript files (JS files from `resources\assets\scripts`)
* Dynamic images optimization (PNG, JPG, GIF and SVG from `resources\assets\images`)
* Sass compilation and minification (SCSS files from `resources\assets\sass`)
* Minification of Css files (CSS files from `resources\assets\sass`)
* Fonts copy (from `resources\fonts` folder)
* Root files copy (from `resources` folder)


## 6/ What's included ?

* Javascript Task Runner : [Gulp](http://gulpjs.com)
* Front-End Package manager : [Bower](http://bower.io)
* Front-End Framework : [Foundation](http://foundation.zurb.com)
* CSS Preprocessor : [Sass](http://sass-lang.com)
* Sass Mixin Library : [Bourbon](http://bourbon.io)
* Sass Conventions Guide : [Csstyle](http://www.csstyle.io)
* Templating Engine : [Nunjucks](https://mozilla.github.io/nunjucks/)