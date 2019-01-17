/**
 * @module CustomEvent polyfill 
 */

(function () {
	try {
		new CustomEvent('IE has CustomEvent, but doesn\'t support constructor');
	} catch (e) {
	
		window.CustomEvent = function(event, params) {
			var evt;
			params = params || {
					bubbles: false,
					cancelable: false,
					detail: undefined
				};
			evt = document.createEvent('CustomEvent');
			evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
			return evt;
		};
	
		CustomEvent.prototype = Object.create(window.Event.prototype);
	}
})();
