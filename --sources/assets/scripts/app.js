$(function() {

	// Foundation
	$(document).foundation();

	// Set copyright year
	var date = new Date();
	$('.copyrightYear').html( date.getFullYear() );

	// Html browser class
	if ( isIE() ) $('html').addClass('ie');
	else if ( isChrome() ) $('html').addClass('chrome');
	else if ( isFirefox() ) $('html').addClass('firefox');
	else if ( isSafari() ) $('html').addClass('safari');

});
