/*
 * @author   wenhua cai
 * @date     2014
 */
/*jshint browser: true*/
/*global window*/
(function () {
	/*
	 * helper functions
	 * cross-platform requestAnimationFrame function
	 */
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				return window.setTimeout(callback, 1000 / 60);
			});
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = (
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			window.msCancelAnimationFrame ||
			window.clearTimeout
		);
	}

	// define a object to attach base function of animation
	var utils = {};

	// define the addEvent function to listener event of DOM element
	utils.addEvent = function (element, eType, listener) {
		if (element.addEventListener) {
			// for chrome, firefox, opera, safari, IE9+ and the browser of mobile device
			element.addEventListener(eType, listener, false);
		} else if (element.attachEvent) {
			// for IE 6, 7, 8
			element.attachEvent('on' + eType, function () {
				return listener.call(element, window.event);
			});
		} else {
			// for less than IE6
			element['on' + eType] = listener;
		}
	};

	// define the mouse event of desktop device
	utils.captureMouse = function (element) {
		var mouse = {x : 0, y : 0};

		this.addEvent(element, 'mousemove', function (event) {
			var x, y;

			if (event.pageX || event.pageY) {
				x = event.pageX;
				y = event.pageY;
			} else {
				x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}

			x -= element.offsetLeft;
			y -= element.offsetTop;

			mouse.x = x;
			mouse.y = y;
		}, false);

		return mouse;
	};

	// define the function to capture touch event of mobile device
	utils.captureTouch = function (element) {
		var touch = {
			x : null,
			y : null,
			isPressed : false
		};

		this.addEvent(element, 'touchstart', function () {
			touch.isPressed  = true;
		});
	};

	// make canvas to full screen
	utils.fullScreen = function (canvas) {
		var context = canvas.getContext('2d');

		// for chrome, firefox, safari, opera and IE9+
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, canvas.width, canvas.height);
	};

	/*
	 * draw text with canvas text api
	 * @params canvas         canvas
	 * @params options        options = {
	 *                            x : num, //must
	 *                            y : num, //must
	 *                            text : string, //option
	 *                            hAlign : left/center/right, //option
	 *                            vAlign : top/middle/bottom, //option
	 *                        }
	 */
	utils.drawText = function (canvas, options) {
		var context = canvas.getContext('2d'),
			text;

		text = options.text || 'Custom text with System';
		context.font = options.font || '16pt Calibri';
		context.fillStyle = options.color || '#ffff00';

		// align text horizontally left or options.hAlign
		context.textAlign = options.hAlign || 'left';
		// align text vertically top or options.vAlign
		context.textBaseline = options.vAlign || 'top';

		context.fillText(text, options.x, options.y);
	};

	// color convert methods
	utils.colorToRGB = function (color, alpha) {
		// if hexadecimal string(like #ff55f3), convert to number
		if (typeof color === 'string' && color[0] === '#') {
			color = parseInt(color.slice(1), 16);
		}
		alpha = 1 || alpha;

		// extract component values
		var r = color >> 16 & 0xff,
			g = color >> 8 & 0xff,
			b = color & 0xff,
			a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha); // check range

		// used rgb or rgba
		if (a === 1) {
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		} else {
			return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		}
	};

	utils.parseColor = function (color, toNumber) {
		if (toNumber === true) {
			if (typeof color === 'number') {
				// return 000000
				return (color | 0);
			}
			if (typeof color === 'string' && color[0] === '#') {
				color = color.slice(1);
			}

			return parseInt(color, 16);
		} else {
			if (typeof color === 'number') {
				color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
			}
		}

		return color;
	};

	// function named $ is to select DOM selector
	utils.$ = function (selector, context) {
		context = context || document;
		return context.querySelector(selector);
	};

	// function named $all is to select a set of DOM selector and return an array
	utils.$all = function (selector, context) {
		context = context || document;
		return context.querySelectorAll(selector);
	};

	// check className of dom
	utils.hasClass = function (elm, className) {
		var found = false,
			tempArray = elm.className.split(' '),
			i,
			len = tempArray.length;

		for (i = 0; i < len; ++i) {
			if (tempArray[i] === className){
				found = true;
			}
		}

		return found;
	}

	// add css class
	utils.addClass = function (elm, className) {
		if (!this.hasClass(elm, className)) {
			elm.className += elm.className ? ' ' + className : className;
		}
	};

	// remove css class
	utils.removeClass = function (elm, className) {
		if (this.hasClass(elm, className)) {
			var replace = elm.className.match(' ' + className) ? ' ' + className : className;
			elm.className = elm.className.replace(replace, '');
		}
	};

	// make utils varible to global varible
	window.utils = utils;
}());
