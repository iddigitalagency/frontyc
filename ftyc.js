#!/usr/bin/env node

'use strict';


/// Required libraries
var fs = require('fs-extra');
var yaml = require('yamljs');
var exec = require('child_process').exec;
var util = require('util');

var term = require( 'terminal-kit' ).terminal;
var log = term;
var logError = term.red;
var logInfo = term.blue;
var logSuccess = term.green;


/// Constants
var CWD  = process.cwd();
var FTYC = __dirname;
var LIB = FTYC + '/lib/';


/// Execute code inside Frontyc lib folder
var cmd = function(command) {
    exec(command, {cwd: LIB}, (error, stdout, stderr) => {
        if (error !== null) {
            logError(error); logError(stdout);
        }
    });
};


/// Init Frontyc inside current folder
var init = function() {
    var defaultConfig = FTYC + '/.config';
    var localConfig = CWD + '/.ftyc';

    // If local config file does not exist, create it !
    fs.stat(localConfig, function(err, stat) {
        if(err == null)
            logError('✕ Frontyc is already installed for that project.\n');
        else {
            fs.copy(defaultConfig, localConfig, function(error) {
                if(error) logError(error);
                else logSuccess('✔ Frontyc has been installed ! Please edit ftyc.yaml for configuration.\n');
            });
        }
    });
};


/// Frontyc self-update
var selfUpdate = function(sudo) {
    var f = sudo === true ? 'sudo ' : '';
    cmd(f + 'npm install');
};


/// User command arguments
var args = ''; process.argv.forEach((val, index, array) => {
    if (index > 1) args += val !== undefined ? args.length > 0 ? ' '+ val : val : '';
});


/// Commands
switch (args) {
    case 'init':
        init();
        break;
    case 'self-update':
        selfUpdate();
        break;
    case 'self-update --sudo':
        selfUpdate(true);
        break;
    case 'watch':
        cmd('gulp watch --ftycCwd ' + CWD);
        break;
    default:
        cmd('gulp --ftycCwd ' + CWD);
}
