"use strict";

/**
 * @module   αProgressCircle
 * @version  v0.1.0
 * @author   OXAYAZA {@link https://github.com/OXAYAZA}
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @see      {@link https://www.linkedin.com/in/%D1%8E%D1%80%D0%B8%D0%B9-%D0%B1%D0%B0%D0%B7%D0%B0%D0%B5%D0%B2-166479165/}
 * @requires module:αUtil
 *
 * @todo определение размеров svg
 */
function aProgressCircle ( data ) {
	function Circle( data ) {
		// Проверка наличия обязательных параметров
		if ( !data || !data.node ) throw Error( 'Missing required αProgressCircle parameters (node).' );

		// Слияние стандартных и полученных параметров
		this.params = Util.merge( [ this.defaults, data ] );

		// Добавление ссылки на прототип в элемент
		this.params.node.progressCircle = this;

		// Добавление элемента clipPath в svg
		this.internal.clipPath = document.createElementNS( 'http://www.w3.org/2000/svg', 'clipPath' );
		this.internal.clipPath.id = this.params.clipId;
		this.params.node.appendChild( this.internal.clipPath );

		// Добавление элемента path в clipPath
		this.internal.path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		this.internal.path.setAttribute( 'd', this.internal.pathD );
		this.internal.clipPath.appendChild( this.internal.path );

		// Добавление атрибута 'clip-path' к обрезаемому элементу
		this.internal.clipped = this.params.node.querySelector( this.params.clipped );
		this.internal.clipped.setAttribute( 'clip-path', 'url(#'+ this.params.clipId +')' );

		this.render( this.params.angle );
	}

	// Служебные параметры
	Circle.prototype.internal = {
		x:        0,
		y:        0,
		size:     [ 72, -22, 122 ],
		clipped:  null,
		clipPath: null,
		path:     null,
		pathD:    'M50,50 L50,0 A50,50 0 0 1 50,100 A50,50 0 0 1 0,50'
	};

	// Параметры по умолчанию
	Circle.prototype.defaults = {
		node:    null,
		clipped: '.clipped',
		clipId:  Util.uId( 8 ),
		angle:   0
	};

	Circle.prototype.calc = function() {
		this.internal.x = Math.sin( this.params.angle * Math.PI/180 ) * this.internal.size[0] + 50;
		this.internal.y = -Math.cos( this.params.angle * Math.PI/180 ) * this.internal.size[0] + 50;
	};

	Circle.prototype.genPath = function() {
		if ( this.params.angle >= -360 && this.params.angle < -180 ) {
			this.internal.pathD =
				'M50,50 L'+ this.internal.x +
				','+ this.internal.y +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 50,'+ this.internal.size[2] +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 50,'+ this.internal.size[1];
		} else if ( this.params.angle >= -180 && this.params.angle < 0 ) {
			this.internal.pathD =
				'M50,50 L'+ this.internal.x +
				','+ this.internal.y +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 50,'+ this.internal.size[1];
		} else if( this.params.angle >= 0 && this.params.angle < 180 ) {
			this.internal.pathD =
				'M50,50 L50,'+ this.internal.size[1] +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 ' + this.internal.x +','+ this.internal.y;
		} else if( this.params.angle >= 180 && this.params.angle <= 360) {
			this.internal.pathD =
				'M50,50 L50,'+ this.internal.size[1] +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 50,'+ this.internal.size[2] +
				' A'+ this.internal.size[0] +
				','+ this.internal.size[0] +
				' 0 0 1 '+ this.internal.x +','+ this.internal.y;
		} else {
			this.internal.pathD = 'M0,0 L100,0 L100,100 L0,100';
		}
	};

	Circle.prototype.render = function( angle ) {
		if ( typeof( angle ) === 'number' ) this.params.angle = angle;
		this.calc();
		this.genPath();
		this.internal.path.setAttribute( 'd', this.internal.pathD );
	};

	return new Circle( data );
}
