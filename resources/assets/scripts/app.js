$(function() {

	// Foundation
	$(document).foundation();

	// Set copyright year
	var date = new Date();
	$('.copyrightYear').html( date.getFullYear() );

});
