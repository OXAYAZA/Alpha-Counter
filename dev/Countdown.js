"use strict";

/**
 * @module   Countdown
 * @version  0.2.0
 * @author   OXAYAZA {@link https://github.com/OXAYAZA}
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @requires module:ProgressCircle
 * @see      {@link https://oxayaza.page.link/gitHub_aCounters}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @see      {@link https://oxayaza.page.link/linkedin}
 */
( function () {
	function objectTag ( data ) {
		return Object.prototype.toString.call( data ).slice( 8, -1 );
	}

	/**
	 * Слияние обьектов (Если слияемое значение равно null то оно игнорируется)
	 * @param {Object} source
	 * @param {Object} merged
	 * @return {Object}
	 */
	function merge( source, merged ) {
		for ( let key in merged ) {
			let tag = objectTag( merged[ key ] );

			if ( tag === 'Object' ) {
				if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
				source[ key ] = merge( source[ key ], merged[ key ] );
			} else if ( tag !== 'Null' ) {
				source[ key ] = merged[ key ];
			}
		}

		return source;
	}

	/**
	 * @param data
	 * @constructor
	 */
	function Countdown ( data ) {
		// Проверка наличия обязательных параметров
		if ( !data || !data.node || typeof( data.to ) === 'undefined' ) {
			throw Error( 'Missing of bad required αCountdown parameters (node, from, to).' );
		}

		// Служебные параметры
		this.internal = {
			from:      null,
			to:        null,
			now:       null,
			counters: {
				days:    null,
				hours:   null,
				minutes: null,
				seconds: null
			},
			circles: {
				days:    null,
				hours:   null,
				minutes: null,
				seconds: null
			},
			period: {
				full:    null,
				now:     null
			},
			time: {
				days:    null,
				hours:   null,
				minutes: null,
				seconds: null
			},
			angle: {
				days:    null,
				hours:   null,
				minutes: null,
				seconds: null
			},
			tmp: {
				days:    null,
				hours:   null,
				minutes: null
			}
		};

		// Слияние стандартных и полученных параметров
		this.params = {};
		merge( this.params, Countdown.defaults );
		merge( this.params, data );

		// Добавление ссылки на прототип в элемент
		this.params.node.countdown = this;

		// Получение значений времени
		this.internal.to = Number( new Date( this.params.to ) );
		this.internal.from = this.params.from ? Number( new Date( this.params.from ) ) : ( this.internal.to - this.constant.year );

		// Получение счетчиков
		for ( var key in this.internal.counters ) {
			this.internal.counters[ key ] = this.params.node.querySelector( '[data-counter-'+ key +']' );
		}

		// Получение и инициализация кругов прогресса
		for ( var key in this.internal.circles ) {
			this.internal.circles[ key ] = this.params.node.querySelector( '[data-progress-'+ key +']' );
			if( this.internal.circles[ key ] ) new ProgressCircle({ node: this.internal.circles[ key ] });
		}

		this.run();
	}

	// Параметры по умолчанию
	Countdown.defaults = {
		from:   null,
		to:     null,
		tick:   1000,
		count:  'auto',
		onTick: null
	};

	// Временные константы (миллисекунды)
	Countdown.prototype.constant = {
		second: 1000,
		minute: 1000 * 60,
		hour:   1000 * 60 * 60,
		day:    1000 * 60 * 60 * 24,
		year:   1000 * 60 * 60 * 24 * 365
	};

	// Пересчет времени
	Countdown.prototype.calc = function () {
		this.internal.time.days     = this.internal.period.now/this.constant.day;
		this.internal.angle.days    = ( 360/~~(this.internal.period.full/this.constant.day ) * ~~this.internal.time.days ) || 0;
		this.internal.tmp.days      = ~~this.internal.time.days * this.constant.day;

		this.internal.time.hours    = (this.internal.period.now - this.internal.tmp.days)/this.constant.hour;
		this.internal.angle.hours   = 360/24 * this.internal.time.hours;
		this.internal.tmp.hours     = ~~this.internal.time.hours * this.constant.hour;

		this.internal.time.minutes  = (this.internal.period.now - (this.internal.tmp.days + this.internal.tmp.hours))/this.constant.minute;
		this.internal.angle.minutes = 360/60 * this.internal.time.minutes;
		this.internal.tmp.minutes   = ~~this.internal.time.minutes * this.constant.minute;

		this.internal.time.seconds  = (this.internal.period.now - (this.internal.tmp.days + this.internal.tmp.hours + this.internal.tmp.minutes))/this.constant.second;
		this.internal.angle.seconds = 360/60 * this.internal.time.seconds;
	};

	// Определение временных промежутков
	Countdown.prototype.mode = function () {
		this.internal.now = Number( new Date() );

		if ( this.internal.to > this.internal.now && [ 'auto', 'until' ].indexOf( this.params.count ) > -1 ) {
			this.internal.period.full = this.internal.to - this.internal.from;
			this.internal.period.now  = this.internal.to - this.internal.now;
		} else if ( this.internal.to < this.internal.now && [ 'auto', 'since' ].indexOf( this.params.count ) > -1 ) {
			this.internal.period.full = this.internal.to - this.internal.from;
			this.internal.period.now  = this.internal.now - this.internal.to;
		}
	};

	// Отрисовка счетчиков и кругов прогресса
	Countdown.prototype.render = function () {
		this.mode();
		this.calc();

		for ( var key in this.internal.counters ) {
			if ( this.internal.counters[ key ] ) {
				this.internal.counters[ key ].innerText = ~~this.internal.time[ key ];
			}

			if ( this.internal.circles[ key ] ) {
				this.internal.circles[ key ].progressCircle.render( this.internal.angle[ key ] );
			}
		}
	};

	// Запуск отсчета и отрисовки
	Countdown.prototype.run = function () {
		this.render();

		setInterval( (function() {
			this.render();
			if ( this.params.onTick instanceof Function ) this.params.onTick.call( this );
		}).bind( this ), this.params.tick );
	};

	if ( !window.Countdown ) {
		window.Countdown = Countdown;
	} else {
		throw new Error( 'Countdown variable is occupied' );
	}
})();
