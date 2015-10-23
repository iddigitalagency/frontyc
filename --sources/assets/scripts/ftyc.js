// Svg Fallback except on ".nofallback" class
if(!Modernizr.svg) {
    $('img[src*="svg"]:not(.nofallback)').attr('src', function() {
        return $(this).attr('src').replace('.svg', '.png');
    });
}



// Function for detecting Browsers
var myUserAgent = navigator.userAgent.toLowerCase();

var isChrome = function() { return (myUserAgent.indexOf('chrome') > -1 && myUserAgent.indexOf('edge') < 0) ? true : false; };
var isIE = function() { return (myUserAgent.indexOf('msie') > -1 || navigator.appVersion.indexOf('Trident/') > 0) ? true : false; };
var isFirefox = function() { return (myUserAgent.indexOf('firefox') > -1) ? true : false; };
var isSafari = function() { return (myUserAgent.indexOf('safari') > -1 && myUserAgent.indexOf('chrome') < 0) ? true : false; };



$(function() {

	// Foundation init
    Foundation.global.namespace = '';
	$(document).foundation();

    // Html browser class
    if ( isIE() ) $('html').addClass('ie');
    else if ( isChrome() ) $('html').addClass('chrome');
    else if ( isFirefox() ) $('html').addClass('firefox');
    else if ( isSafari() ) $('html').addClass('safari');

});
