// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
(function($,sr){

    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };
    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');



// Svg Fallback
if(!Modernizr.svg) {
    $('img[src*="svg"]').attr('src', function() {
        return $(this).attr('src').replace('.svg', '.png');
    });
}



// Scroll Top
$('a.scrollToTop').click(function(){
    $('html, body').animate({scrollTop : 0}, 800);
    return false;
});



// Function for detecting Browsers
var myUserAgent = navigator.userAgent.toLowerCase();

function isChrome() { return (myUserAgent.indexOf('chrome') > -1) ? true : false; }
function isIE() { return (myUserAgent.indexOf('msie') > -1 || navigator.appVersion.indexOf('Trident/') > 0) ? true : false; }
function isFirefox() { return (myUserAgent.indexOf('firefox') > -1) ? true : false; }
function isSafari() { return (myUserAgent.indexOf('safari') > -1 && myUserAgent.indexOf('chrome') < 0) ? true : false; }