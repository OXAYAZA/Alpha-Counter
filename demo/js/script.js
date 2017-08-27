var debugOutput = document.getElementById( 'debug-output' ),
	plugins = {
		progressCircle: document.querySelector( '[data-progress-circle]' ),
		countDown:      document.querySelector( '[data-circle-countdown]' )
	};

// Tracking function, for debugging
function tracking( trackingId, data, Class ) {
		Class = Class || 'str';

		if( document.getElementById( trackingId ) === null ) {
			var trackingElement = document.createElement( 'div' );
			trackingElement.innerHTML = '<pre id="'+ trackingId +'" class="'+ Class +'"><span class="success">'+ trackingId +'</span> '+ JSON.stringify( data, "", 2 ) +'</pre>';
			if ( debugOutput !== null ) debugOutput.appendChild( trackingElement )
			else document.body.appendChild( trackingElement );
		} else {
			document.getElementById( trackingId ).innerHTML = '<span class="success">'+ trackingId +'</span> '+ JSON.stringify( data, "", 2 );
		}
	}


document.addEventListener( 'DOMContentLoaded', function () {
	if( plugins.progressCircle ) {
		svgProgressCircle({
			tickInterval: 1000,
			ontick: function( circle ) {
				if( circle.progress >= 100 ) {
					circle.progress = 0;
					circle.increase = !circle.increase;
				}
				circle.progress += 2;
				circle.draw();
			}
		});
	}

	if( plugins.countDown ) {
		svgCountDown();
	}
});
