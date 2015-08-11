// Global vars
var ANIM_DURATION = 800;


// On document ready
$(function() {

	// TODO :: Type your javascript code here

	// Useful functions
	var date = new Date(); $('.setYear').html( date.getFullYear() ); // Set current year
	$('a.scrollTop').click(function(){ $('html, body').animate({scrollTop : 0}, ANIM_DURATION); return false; }); // Scroll top links

});
