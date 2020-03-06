"use strict";

window.addEventListener( 'load', function () {

	// Counter
	document.querySelectorAll( '.counter' ).forEach( function ( node ) {
		new Counter({
			node: node,
			duration: 500
		});
	});


	// Progress Circle
	document.querySelectorAll( '.progress-circle' ).forEach( function ( node ) {
		new ProgressCircle({
			node: node,
			angle: node.getAttribute( 'data-value' )
		});
	});


	// Countdown
	document.querySelectorAll( '[data-countdown]' ).forEach( function ( node ) {
		new Countdown({
			node:  node,
			from:  node.getAttribute( 'data-from' ),
			to:    node.getAttribute( 'data-to' ),
			count: node.getAttribute( 'data-count' ),
			tick:  100,
		});
	});

});
