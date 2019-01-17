"use strict";

var plugins = {
	counter:         document.querySelectorAll( '.counter' ),
	progressCircle:  document.querySelectorAll( '.progress-circle' ),
	progressCircle2: document.querySelectorAll( '.progress-circle-2' ),
	progressLinear:  document.querySelectorAll( '.progress-linear-bar' ),
	countdown:       document.querySelectorAll( '[data-countdown]' )
};

document.addEventListener( 'DOMContentLoaded', function () {
	// Progress Bar
	if ( plugins.progressLinear ) {
		for ( var i = 0; i < plugins.progressLinear.length; i++ ) {
			var
				node = plugins.progressLinear[i],
				counter = document.querySelector( node.getAttribute( 'data-counter' ) ),
				countHandler = (function( event ) {
					this.style.width = event.target.counter.params.to + '%';
				}).bind( node );

			counter.addEventListener( 'counterStart', countHandler );
		}
	}

	// Progress Circle
	if ( plugins.progressCircle ) {
		for ( var i = 0; i < plugins.progressCircle.length; i++ ) {
			var
				node = plugins.progressCircle[i],
				progress = aProgressCircle({ node: node }),
				counter = document.querySelector( node.getAttribute( 'data-counter' ) ),
				countHandler = (function( event ) {
					this.render( event.value * -3.6 );
				}).bind( progress );

			counter.addEventListener( 'counterUpdate', countHandler );
		}
	}

	// Progress Circle 2
	if ( plugins.progressCircle2 ) {
		for ( var i = 0; i < plugins.progressCircle2.length; i++ ) {
			var
				node = plugins.progressCircle2[i],
				progress = aProgressCircle({ node: node }),
				counter = document.querySelector( node.getAttribute( 'data-counter' ) ),
				countHandler = (function( event ) {
					this.render( event.value * 3.6 );
					this.custom.x = Math.sin( this.params.angle * Math.PI/180 ) * this.custom.ellipse.rx + this.custom.ellipse.cx;
					this.custom.y = -Math.cos( this.params.angle * Math.PI/180 ) * this.custom.ellipse.ry + this.custom.ellipse.cy;
					this.custom.dot.setAttribute( 'cx', this.custom.x );
					this.custom.dot.setAttribute( 'cy', this.custom.y );
				}).bind( progress );

			progress.custom = {
				dot: node.querySelector( '.dot' ),
				ellipse: {
					rx: progress.internal.ellipse.cx - 5,
					ry: progress.internal.ellipse.cy - 5,
					cx: progress.internal.ellipse.cx,
					cy: progress.internal.ellipse.cy
				},
				x: 0,
				y: 0
			};

			counter.addEventListener( 'counterUpdate', countHandler );
		}
	}

	// Counter
	if ( plugins.counter ) {
		for ( var i = 0; i < plugins.counter.length; i++ ) {
			var
				node = plugins.counter[i],
				counter = aCounter({
					node: node,
					duration: 500,
					formatter: function ( value ) { return value + '%'; }
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

	// Countdown
	if ( plugins.countdown.length ) {
		for ( var i = 0; i < plugins.countdown.length; i++) {
			var
				node = plugins.countdown[i],
				countdown = aCountdown({
					node:  node,
					from:  node.getAttribute( 'data-from' ),
					to:    node.getAttribute( 'data-to' ),
					count: node.getAttribute( 'data-count' ),
					tick:  100,
				});
		}
	}
});
