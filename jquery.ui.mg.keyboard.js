
 /*
 * jQuery UI Keyboard plugin
 *
 * Copyright (c) 2010 Magenta Creations. All rights reserved.
 * Licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 License.
 *  Summary : <http://creativecommons.org/licenses/by-nc-sa/3.0/>
 *  Legal : <http://creativecommons.org/licenses/by-nc-sa/3.0/legalcode>
 *
 * Royalty-free license for commercial purpose available on demand
 *
 * contact@mg-crea.com
 * http://mg-crea.com
 */

(function( $, undefined ) {

$.widget("ui.keyboard", $.ui.mouse, {
	widgetEventPrefix: "keyboard",
	options: {
		transferClasses: true,
		shift: false,
		distance: 5, // $.ui.mouse option
		delay: 5, // $.ui.mouse option
	},
	_mouseStart: function(e) {
		//console.log('_mouseStart', e);
	},
	_mouseDrag: function(e) {
		//console.log('_mouseDrag', e, this._mouseDragged);
		var $t = $(e.target);

		/** bubbling **/
		if($t.get(0).tagName !== "A") {
			$t = $t.parent("a");
			if(!$t) return false;
		}

		if(!this._mouseDragged) {
			if($t.hasClass("has-subkeys")) $t.next("div.subkeys").show();
		}

		if($t.hasClass("is-subkey"))  $t.siblings().removeClass('ui-state-active').end().addClass('ui-state-active');

		this._mouseDragged = true;
	},
	_mouseStop: function(e) {
		//console.log('_mouseStop', e);
		var $t = $(e.target);

		/** bubbling **/
		if($t.get(0).tagName !== "A") {
			$t = $t.parent("a");
			if(!$t) return false;
		}

		if($t.is("div.subkeys a")) {
			$t.trigger("click");
		}
	},
	_mouseCapture: function(e) {
		//console.log('_mouseCapture', e);
		var self = this,
			o = this.options;

		this._mouseDragged = false;

		e.preventDefault();
		e.stopPropagation();
		return true;
	},
	_mouseClick: function(e) {
		var self = $.data(this, "keyboard"),
			$this = self.element,
			$t = $(e.target);

		/** bubbling **/
		if($t.get(0).tagName !== "A") {
			$t = $t.parent("a");
			if(!$t) return false;
		}

		var $input = self.inputs.filter(".ui-focus");
		if($input.length < 1) {
			$input = self.inputs.filter("input:visible").first().focus();
		}

		var inputVal = $input.val();
		var text = $t.text(); //String.fromCharCode($t.data('key-code'));

		console.log('$.ui.' + this.widgetName + ' ~ ' + '_mouseClick()', [$input, inputVal, text, e]);

		if($t.hasClass('letter')) {
			$this.hasClass('keyboard-shift-active') ? $input.val(inputVal + text.toUpperCase()) : $input.val(inputVal + text);
		} else if($t.hasClass('special')) {
			var special = $t.data('key-special');
			if(special == 'space') {
				$input.val(inputVal + ' ');
			} else if(special == 'backspace') {
				$input.val(inputVal.substr(0, inputVal.length -1));
			} else if(special == 'shift') {
				$t.toggleClass('ui-state-active');
				$this.toggleClass('keyboard-shift-active');
			} else if(special == 'return') {
				var $inputs = $input.closest("form").find("input:visible");
				var focusIndex = $inputs.index($inputs.filter('.ui-focus').trigger('focusout'));
				if(focusIndex < $inputs.length - 1) {
					$inputs.eq(focusIndex + 1).focus();
				} else {
					$inputs.first().focus();
				}
			} else {
				if(special.replace(/toggle-(.+)/i, '$1')) {
					$this.find("ul.keyboard:visible").hide();
					$this.find("ul.keyboard-"+special.replace(/toggle-(.+)/i, '$1')).show();
				}
			}
		} else {
			$this.hasClass('keyboard-shift-active') ? $input.val(inputVal + text.toUpperCase()) : $input.val(inputVal + text);
		}

		$input.trigger("keyup");

		if($t.hasClass("is-subkey"))  $t.closest("div.subkeys").hide();

		e.preventDefault();
		e.stopPropagation();
	},

	_create: function() {
		console.log('$.ui.' + this.widgetName + ' ~ ' + '_create()', [this.options]);
		this._keyboard( true );
	},

	_keyboard: function( init ) {
		var self = this,
			o = this.options;

		this.inputs = $("input");

		this.element.css('position', 'relative');

		// mouse click
		this.element.bind('click.'+this.widgetName, {'this' : this}, this._mouseClick);

		// mouse init
		this._mouseInit();

		if(this.options.shift) {
			this.element.find("li.key a.special-shift").addClass('ui-state-active');
			this.element.addClass('keyboard-shift-active');
		}

		console.log('$.ui.' + this.widgetName + ' ~ ' + '_keyboard()', [this.inputs]);

		return true;
	},

	destroy: function() {
		this.element.removeData(this.widgetName)
			.removeClass(this.widgetBaseClass + '-disabled' + ' ' + this.namespace + '-state-disabled')
			.removeAttr('aria-disabled')
			.unbind('click.'+this.widgetName);

		// call mouse destroy function
		this._mouseDestroy();

		// call widget destroy function
		$.widget.prototype.destroy.apply(this, arguments);
	}

});

function splitCssMatrix(m, r) {
	var re = new RegExp('matrix\\(' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?' + '([-+]?\\d+)' + '*.?,*.?', ["i"]);
	var rs = re.exec(m);
	if(typeof r !== undefined) return rs[r];
	return rs;
}

})(jQuery);