#!/usr/bin/env node

'use strict';


/// Required libraries
var fs = require('fs-extra');
var yaml = require('yamljs');


/// Constants
const CWD  = process.cwd();
const FTYC = __dirname + '/lib';


/// Read config
var config = YAML.load(CWD + '/' + 'ftyc.config.yaml');


/// Read user command
var command = (['init', ''].indexOf( process.argv[2] ) >= 0) ? process.argv[2] : 'gulp';


/// Init command
fs.copy(FROM, CWD, function(error) {
  if(error) console.log(error);

  // rename .gitignore
  fs.renameSync(CWD + '/gitignore', CWD + '/.gitignore');
});