 (function($) {

	if(!window.console) window.console = {};

	$(function() {

		console.log('$(document).load()');

		$(window).load(function() {

			console.log('$(window).load()');

			$("#keyboard").keyboard({'shift': false});

		});

	});

})(jQuery);