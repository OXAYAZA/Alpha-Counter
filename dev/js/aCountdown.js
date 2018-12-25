"use strict";

/**
 * @module   αCountdown
 * @version  v0.1.1
 * @author   OXAYAZA {@link https://github.com/OXAYAZA}
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @requires module:αUtil
 * @requires module:αProgressCircle
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @see      {@link https://www.linkedin.com/in/%D1%8E%D1%80%D0%B8%D0%B9-%D0%B1%D0%B0%D0%B7%D0%B0%D0%B5%D0%B2-166479165/}
 */
function aCountdown ( data ) {
	function Countdown ( data ) {
		// Проверка наличия обязательных параметров
		if ( !data || !data.node || typeof( data.to ) === 'undefined' ) {
			throw Error( 'Missing of bad required αCountdown parameters (node, from, to).' );
		}

		// Слияние стандартных и полученных параметров
		this.params = Util.merge( [ this.defaults, data ], { skipNull: true } );

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
			if( this.internal.circles[ key ] ) aProgressCircle({ node: this.internal.circles[ key ] });
		}

		this.run();
	}

	// Параметры по умолчанию
	Countdown.prototype.defaults = {
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

	// Служебные параметры
	Countdown.prototype.internal = {
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
			if ( this.internal.counters[ key ] ) this.internal.counters[ key ].innerText = ~~this.internal.time[ key ];
			if ( this.internal.circles[ key ] ) this.internal.circles[ key ].progressCircle.render( this.internal.angle[ key ] );
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

	return new Countdown( data );
}
