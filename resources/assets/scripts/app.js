$(function() {

	// Foundation
	$(document).foundation();

	// Global vars
	responsive_breakpoint = 1024;

	// Set copyright year
	var date = new Date();
	$('.copyrightYear').html( date.getFullYear() );

	// Svg Fallback
	if(!Modernizr.svg) {
	    $('img[src*="svg"]').attr('src', function() {
	        return $(this).attr('src').replace('.svg', '.png');
	    });
	}

	// Scroll Top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0}, 800);
		return false;
	});

	// Scroll To Smoothly
	topOffset = 0;
	$(window).smartresize(function() {
		if (window.innerWidth > responsive_breakpoint) { topOffset = 60; } else { topOffset = 0; }
	});
	$('.scrollTo').click(function(){
		var target = $(this).attr('href');
		$('html, body').animate({scrollTop : $(target).offset().top - topOffset}, 800);
		return false;
	});

	// Show more
	$('.toggle-read').click(function() {
		$(this).toggleClass('open').parent().find('p').toggleClass('open');
	});

	// Parallax
	if ( $('.showcase-img').length ) {
		if (window.innerWidth > responsive_breakpoint) {
			$('.showcase-img').parallax({
				imageSrc: $(this).data('image-src'),
				naturalWidth: $(this).data('natural-width'),
				naturalHeight: $(this).data('natural-height'),
				dataSpedd: $(this).data('speed')
			});
		} else {
			$('.showcase-img').each(function() {
				$(this).css('background-image', 'url("'+ $(this).data('image-src') +'")');
			});
		}
	}

	// Carousel on small devices
	if ( $('.carousel-on-small').length ) {
		slicky_active = false;
		$(window).smartresize(function() {
			if (slicky_active && window.innerWidth > responsive_breakpoint) {
				$('.carousel-on-small').slick('unslick');
				slicky_active = false;
			} else if (!slicky_active && window.innerWidth <= responsive_breakpoint) {
				$('.carousel-on-small').slick({
					infinite: true,
					dots: true,
					arrows: false,
					slidesToShow: 1
				});
				slicky_active = true;
			}
		});
	}

	// Carousel
	if ( $('.carousel').length ) {
		$('.carousel').slick({
			infinite: true,
			dots: true,
			arrows: false,
			slidesToShow: 1
		});
		$(window).trigger('resize');
	}

	// Elements with .autoAdjustHeight class will have the same height. Group them by adding data-heightGroup property
	if ( $('.autoAdjustHeight').length ) {
		
		$(window).smartresize(function() {
			groups = [];
			gutter = 20;

			$('.autoAdjustHeight').css('height', 'auto');

			if (window.innerWidth > responsive_breakpoint) {
				$('.autoAdjustHeight').each(function() {
					var group = $(this).data('height-group');

					if (jQuery.inArray(group, groups) < 0 ) {
						groups.push(group);

						var heights = $('.autoAdjustHeight[data-height-group="'+ group +'"]').map(function () {
							return $(this).outerHeight();
						}).get(), maxHeight = Math.max.apply(null, heights);

						$('.autoAdjustHeight[data-height-group="'+ group +'"]').each(function() {
							var coeff = $(this).data('height-coeff');

							if (typeof coeff === "undefined") {
								$(this).css('height', maxHeight);
							} else {
								$(this).css('height', maxHeight * coeff + gutter);
							}
						});
					}
				});
			}
		});
	}

	$(window).trigger('resize');
});

(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
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