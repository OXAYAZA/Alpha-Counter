"use strict";

var plugins = {
	counters:       document.querySelectorAll( '.counter' ),
	progressLinear: document.querySelectorAll( '.progress-linear' ),
	progressCircle: document.querySelectorAll( '.progress-circle' ),
	countDown:      document.querySelectorAll( '[data-countdown]' )
};

document.addEventListener( 'DOMContentLoaded', function () {
	// Counter
	if ( plugins.counters ) {
		for ( var i = 0; i < plugins.counters.length; i++ ) {
			var
				node = plugins.counters[i],
				counter = aCounter({
					node: node,
					duration: 1000
				}),
				scrollHandler = (function() {
					if ( Util.inViewport( this ) && !this.classList.contains( 'animated' ) ) {
						this.counter.run();
						this.classList.add( 'animated' );
					}
				}).bind( node ),
				blurHandler = (function() {
					this.counter.params.to = parseInt( this.textContent, 10 );
					this.counter.run();
				}).bind( node );

			scrollHandler();
			window.addEventListener( 'scroll', scrollHandler );
			node.addEventListener( 'blur', blurHandler );
		}
	}

	// Progress Bar
	if ( plugins.progressLinear ) {
		for ( var i = 0; i < plugins.progressLinear.length; i++ ) {
			var
				container = plugins.progressLinear[i],
				counter = aCounter({
					node: container.querySelector( '.progress-linear-counter' ),
					duration: 500,
					onStart: function() {
						this.custom.bar.style.width = this.params.to + '%';
					}
				});

			counter.custom = {
				container: container,
				bar: container.querySelector( '.progress-linear-bar' ),
				onScroll: (function() {
					if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
						this.run();
						this.custom.container.classList.add( 'animated' );
					}
				}).bind( counter ),
				onBlur: (function() {
					this.params.to = parseInt( this.params.node.textContent, 10 );
					this.run();
				}).bind( counter )
			};

			counter.custom.onScroll();
			window.addEventListener( 'scroll', counter.custom.onScroll );
			counter.params.node.addEventListener( 'blur', counter.custom.onBlur );
		}
	}

	// Progress Circle
	if ( plugins.progressCircle ) {
		for ( var i = 0; i < plugins.progressCircle.length; i++ ) {
			var
				container = plugins.progressCircle[i],
				counter = aCounter({
					node: container.querySelector( '.progress-circle-counter' ),
					duration: 500,
					onUpdate: function( value ) {
						if ( value > 100  ) value = 100;
						else if ( value < -100  ) value = -100;
						this.custom.bar.render( value * 3.6 );
					}
				});

			counter.params.onComplete = counter.params.onUpdate;

			counter.custom = {
				container: container,
				bar: aProgressCircle({ node: container.querySelector( '.progress-circle-bar' ) }),
				onScroll: (function() {
					if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
						this.run();
						this.custom.container.classList.add( 'animated' );
					}
				}).bind( counter ),
				onBlur: (function() {
					this.params.to = parseInt( this.params.node.textContent, 10 );
					this.run();
				}).bind( counter )
			};

			counter.custom.onScroll();
			window.addEventListener( 'scroll', counter.custom.onScroll );
			counter.params.node.addEventListener( 'blur', counter.custom.onBlur );
		}
	}

	// Countdown
	if ( plugins.countDown.length ) {
		for ( var i = 0; i < plugins.countDown.length; i++) {
			var
				node = plugins.countDown[i],
				countdown = aCountdown({
					node:  node,
					from:  node.getAttribute( 'data-from' ),
					to:    node.getAttribute( 'data-to' ),
					tick:  100
				});
		}
	}
});
