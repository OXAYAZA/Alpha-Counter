/**
 * @module       SVG Progress Circle
 * @author       Bazaev Yuri (ATOM)
 * @license      CC BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
 * @see          https://codepen.io/OXAYAZA/pen/JJryqW
 * @version      v2.0.1
 * @description  Progress Circle for anything
 */


// Utility function to check the existence of the option
function optionExist( testable, alternate ) {
	if( typeof( testable ) !== 'undefined' ) return testable;
	else return alternate;
}


// ProgressCircle Prototype
function ProgressCircle( node ) {
	this.node = node;
}

ProgressCircle.prototype.getOptions = function( options ) {
	var options = options || {};

	this.options = {
		clipPathSelector: optionExist( options.clipPathSelector, '.progress-clip' ),
		clippedSelector:  optionExist( options.clippedSelector,  '.clipped' ),
		clipPathId:       optionExist( options.clipPathId,       'svgProgressCircle' ),
		increase:         optionExist( options.increase,         true ),
		tickInterval:     optionExist( options.tickInterval,     300 ),
		oninit:           optionExist( options.oninit,           undefined ),
		ontick:           optionExist( options.ontick,           undefined ),
	};
};

ProgressCircle.prototype.calcCoordinates = function() {
	this.angle = 360/100 * this.progress;
	this.x = Math.sin( this.angle * Math.PI/180 ) * this.size[0] + 50;
	this.y = -Math.cos( this.angle * Math.PI/180 ) * this.size[0] + 50;
};

ProgressCircle.prototype.draw = function() {
	this.calcCoordinates();

	if( this.increase ) {
		if( this.angle < 180 ) {
			this.points = 'M50,50 L50,'+ this.size[1] +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 '+ this.x +','+ this.y;
		}

		if( this.angle >= 180 ) {
			this.points = 'M50,50 L50,'+ this.size[1] +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 50,'+ this.size[2] +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 '+ this.x +','+this.y;
		}
	} else {
		if( this.angle < 180 ) {
			this.points = 'M50,50 L'+ this.x +','+ this.y +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 50,'+ this.size[2] +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 50,'+ this.size[1];
		}

		if( this.angle >= 180 ) {
			this.points = 'M50,50 L'+ this.x +','+ this.y +' A'+ this.size[0] +','+ this.size[0] +' 0 0 1 50,'+ this.size[1];
		}
	}

	document.querySelector( '#'+ this.options.clipPathId +' path' ).setAttribute( 'd', this.points );

};

ProgressCircle.prototype.setId = function() {
	this.clipPath.id = this.options.clipPathId;

	for( var i = 0; i < this.clipped.length; i++ ) {
		this.clipped[i].setAttribute( 'clip-path', 'url(#'+ this.options.clipPathId +')' );
	}
};

ProgressCircle.prototype.init = function( options ) {
	this.getOptions( options );
	this.clipPath   = this.node.querySelector( this.options.clipPathSelector );
	this.clipped    = this.node.querySelectorAll( this.options.clippedSelector );
	this.increase   = this.options.increase;
	this.points     = 'M50,50 L50,0 A50,50 0 0 1 50,100 A50,50 0 0 1 0,50';
	this.size       = [ 72, -22, 122 ];
	this.progress   = 0;
	this.angle      = 0;
	this.x          = 0;
	this.y          = 0;

	this.setId();
	if( this.options.oninit !== undefined ) this.options.oninit( this );
};

ProgressCircle.prototype.tick = function() {
	if( this.options.ontick !== undefined ) {
		setInterval( function( object ) {
			return function() {
				object.options.ontick( object );
			};
		}( this ), this.options.tickInterval );
	}
};


// CountDownCircle Prototype based on ProgressCircle
function CountDownCircle( container, node ) {
  ProgressCircle.call( this, node );
	this.container = container;
}

CountDownCircle.prototype = Object.create( ProgressCircle.prototype );

CountDownCircle.prototype.constructor = CountDownCircle;

CountDownCircle.prototype.getOptions = function( options ) {
	var options = options || {};

	this.options = {
		clipPathSelector: optionExist( options.clipPathSelector, '.progress-clip' ),
		clippedSelector:  optionExist( options.clippedSelector,  '.clipped' ),
		counterSelector:  optionExist( options.counterSelector,  '.counter' ),
		clipPathId:       optionExist( options.clipPathId,       'svgCountDown' ),
		unitsAttr:        optionExist( options.unitsAttr,        'data-units' ),
		fromAttr:         optionExist( options.fromAttr,         'data-from' ),
		toAttr:           optionExist( options.toAttr,           'data-to' ),
		increase:         optionExist( options.increase,         true ),
		tickInterval:     optionExist( options.tickInterval,     100 ),
		oninit:           optionExist( options.oninit,           undefined ),
		ontick:           optionExist( options.ontick,           undefined ),
	};
};

CountDownCircle.prototype.init = function( options ) {
	this.getOptions( options );
	this.clipPath   = this.node.querySelector( this.options.clipPathSelector );
	this.counter    = this.node.querySelector( this.options.counterSelector );
	this.clipped    = this.node.querySelectorAll( this.options.clippedSelector );
	this.increase   = this.options.increase;
	this.units      = this.node.getAttribute( this.options.unitsAttr );
	this.countFrom  = new Date( this.container.getAttribute( this.options.fromAttr ) );
	this.countTo    = new Date( this.container.getAttribute( this.options.toAttr ) );
	this.points     = 'M50,50 L50,0 A50,50 0 0 1 50,100 A50,50 0 0 1 0,50';
	this.size       = [ 72, -22, 122 ];
	this.progress   = 0;
	this.angle      = 0;
	this.x          = 0;
	this.y          = 0;

	this.setId();
	if( this.options.oninit !== undefined ) this.options.oninit( this );
};

CountDownCircle.prototype.calcTime = function() {
	var	diffFull  = this.countTo - this.countFrom,
			diffNow   = this.countTo - this.now,
			tmpDays,
			tmpHours,
			tmpMinutes;

	this.days            = diffNow/86400000;
	this.progressDays    = (diffNow > 0) ? ( 100/~~(diffFull/86400000 ) * ~~this.days ) || 0 : 0;
	tmpDays              = ~~this.days * 86400000;

	this.hours           = (diffNow - tmpDays)/3600000;
	this.progressHours   = (diffNow > 0) ? 100/24 * this.hours : 0;
	tmpHours             = ~~this.hours * 3600000;

	this.minutes         = (diffNow - (tmpDays + tmpHours))/60000;
	this.progressMinutes = (diffNow > 0) ? 100/60 * this.minutes : 0;
	tmpMinutes           = ~~this.minutes * 60000;

	this.seconds         = (diffNow - (tmpDays + tmpHours + tmpMinutes))/1000;
	this.progressSeconds = (diffNow > 0) ? 100/60 * this.seconds : 0;
};

CountDownCircle.prototype.countDown = function() {
	this.now = new Date();
	this.calcTime();

	if( this.units === 'Seconds' ) {
		this.progress = this.progressSeconds;
		this.counter.innerHTML = ~~this.seconds;
	} else if( this.units === 'Hours' ) {
		this.progress = this.progressHours;
		this.counter.innerHTML = ~~this.hours;
	} else if( this.units === 'Minutes' ) {
		this.progress = this.progressMinutes;
		this.counter.innerHTML = ~~this.minutes;
	} else {
		this.progress = this.progressDays;
		this.counter.innerHTML = ~~this.days;
	}

	this.draw();
};

CountDownCircle.prototype.tick = function() {
	setInterval( function( object ) {
		return function() {
			object.countDown();

			if( object.options.ontick !== undefined ) {
				object.options.ontick( object );
			}
		};
	}( this ), this.options.tickInterval );
};


// ProgressCircle init function
function svgProgressCircle( options ) {
	var options = options || {};

	options.circleSelector = optionExist( options.circleSelector, '[data-progress-circle]' );
	options.clipPathId     = optionExist( options.clipPathId,     'svgProgressCircle' );

	var nodes = document.querySelectorAll( options.circleSelector ),
			tpmId = options.clipPathId;

	for( var i = 0; i < nodes.length; i++ ) {
		options.clipPathId = tpmId + i;
		var circle = new ProgressCircle( nodes[ i ] );
		circle.init( options );
		circle.tick();
	}
}


// CountDown init function
function svgCountDown( options ) {
	var options = options || {};

	options.containerSelector = optionExist( options.containerSelector, '[data-countdown]' );
	options.circleSelector    = optionExist( options.circleSelector,    '[data-circle-countdown]' );
	options.clipPathId        = optionExist( options.clipPathId,        'svgCountDown' );

	var tpmId = options.clipPathId,
			containers = document.querySelectorAll( options.containerSelector );

	for( var c = 0; c < containers.length; c++ ) {
		var circles = containers[ c ].querySelectorAll( options.circleSelector );

		for( var n = 0; n < circles.length; n++ ) {
			options.clipPathId = tpmId +'-'+ c +'-'+ n;
			var circle = new CountDownCircle( containers[ c ], circles[ n ] );
			circle.init( options );
			circle.tick();
		}
	}
}
