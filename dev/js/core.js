"use strict";

/**
 * @module  αUtil
 * @desc    Сервисные функции для α-модулей
 * @author  ATOM
 * @version v1.0.0
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 */
function Util () {}

/**
 * Проверка нахождения элемента во вьюпорте
 * @param {Element} element - проверяемый элемент
 * @param {function} [cb] - колбек
 * @return {boolean}
 */
Util.inViewport = function ( element, cb ) {
	var
		rect = element.getBoundingClientRect(),
		inView = ( rect.top < window.innerHeight ) && ( rect.bottom > 0 );

	if ( cb instanceof Function && inView ) cb();
	return inView;
};

/**
 * Слияние обьектов
 * @param {Array} sources - массив слияемых обьектов
 * @param {object} [options] - дополнительные опции
 * @param {Array} [options.except] - массив исключенных ключей
 * @return {object} - новый обьект
 */
Util.merge = function ( sources, options ) {
	options = options || {};
	var initial = {};

	for ( var s = 0; s < sources.length; s++ ) {
		var source = sources[ s ];
		if ( !source ) continue;

		for ( var key in source ) {
			if ( options.except && !options.except.indexOf( key ) ) {
				continue;
			} else if ( source[ key ] instanceof Object && !(source[ key ] instanceof Node) && !(source[ key ] instanceof Function) ) {
				initial[ key ] = Navbar.merge( [ initial[ key ], source[ key ] ], options );
			} else {
				initial[ key ] = source[ key ];
			}
		}
	}

	return initial;
};

/**
 * Создание случайного идентификатора
 * @param {number} length - длинна идентификатора
 * @return {string}
 */
Util.uId = function ( length ) {
	var uId = '';
	for ( var i = 0; i < length; i++ ) uId += String.fromCharCode( 97 + Math.random() * 25 );
	return uId;
};


/**
 * @module   αCounter
 * @author   ATOM
 * @version  v0.1.0
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @requires module:αUtil
 *
 * @todo внутренние параметры
 */
function aCounter ( data ) {
	function Counter ( data ) {
		// Проверка наличия обязательных параметров
		if ( !data || !data.node ) throw Error( 'Missing required aCounter parameters (node).' );

		// Слияние стандартных и полученных параметров
		this.params = Util.merge( [ this.defaults, data ] );

		// Добавление ссылки на прототип в элемент
		this.params.node.counter = this;

		// Если не задано значение счетчика то попробовать определить его из содержимого
		if ( !this.params.to ) {
			try { this.params.to = parseInt( this.params.node.textContent, 10 ); }
			catch ( error ) { throw Error( 'Unable to get aCounter value' ) }
		}

		// Привязка контекста методов прототипа
		this.run = this.run.bind( this );
		return this;
	}

	// Параметры по умолчанию
	Counter.prototype.defaults = {
		node:       null,
		from:       0,
		to:         null,
		duration:   3000,
		refresh:    30,
		formatter:  null,
		onStart:    null,
		onUpdate:   null,
		onComplete: null
	};

	// Запуск счетчика
	Counter.prototype.run = function () {
		clearInterval( this.intervalId );
		this.value     = this.params.from;
		this.loops     = Math.ceil( this.params.duration / this.params.refresh );
		this.increment = ( this.params.to - this.params.from) / this.loops;
		this.loop      = 0;
		if ( this.params.onStart instanceof Function ) this.params.onStart.call( this, ~~this.value );
		this.intervalId = setInterval( this.update.bind( this ), this.params.refresh );
	};

	// обновление значения счетчика
	Counter.prototype.update = function () {
		this.value += this.increment;
		this.loop++;

		if ( this.params.onUpdate instanceof Function ) this.params.onUpdate.call( this, ~~this.value );

		if ( this.loop >= this.loops ) {
			clearInterval( this.intervalId );
			this.value = this.params.to;

			if ( this.params.onComplete instanceof Function ) this.params.onComplete.call( this, ~~this.value );
		}

		this.render();
	};

	// Отрисовка значения счетчика
	Counter.prototype.render = function () {
		if ( this.params.formatter instanceof Function ) {
			this.params.node.innerHTML = this.params.formatter.call( this, ~~this.value );
		} else {
			this.params.node.innerHTML = ~~this.value;
		}
	};

	return new Counter( data );
}


/**
 * @module   αProgressCircle
 * @author   ATOM
 * @version  v0.1.0
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
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
		node:     null,
		clipped:  '.clipped',
		clipId:   Util.uId( 8 ),
		angle: 0
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


/**
 * @module   αCountdown
 * @author   ATOM
 * @version  v0.1.0
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @requires module:αUtil
 * @requires module:αProgressCircle
 *
 * @todo until/since
 */
function aCountdown ( data ) {
	function Countdown ( data ) {
		// Проверка наличия обязательных параметров
		if ( !data || !data.node || typeof( data.from ) === 'undefined' || typeof( data.to ) === 'undefined' ) {
			throw Error( 'Missing of bad required αCountdown parameters (node, from, to).' );
		}

		// Слияние стандартных и полученных параметров
		this.params = Util.merge( [ this.defaults, data ] );

		// Добавление ссылки на прототип в элемент
		this.params.node.countdown = this;

		// Получение значений времени
		this.internal.from = new Date( this.params.from );
		this.internal.to = new Date( this.params.to );

		// Получение счетчиков
		for ( var key in this.internal.counters ) {
			this.internal.counters[ key ] = this.params.node.querySelector( '[data-counter-'+ key +']' );
		}

		// Получение и инициализация кругов прогресса
		for ( var key in this.internal.circles ) {
			this.internal.circles[ key ] = this.params.node.querySelector( '[data-progress-'+ key +']' );
			aProgressCircle({ node: this.internal.circles[ key ] });
		}

		this.run();
	}

	// Параметры по умолчанию
	Countdown.prototype.defaults = {
		from:   null,
		to:     null,
		tick:   1000,
		count:  'until',
		onTick: null
	};

	// Временные константы (миллисекунды)
	Countdown.prototype.constant = {
		second: 1000,
		minute: 1000 * 60,
		hour:   1000 * 60 * 60,
		day:    1000 * 60 * 60 * 24
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
		this.internal.now           = new Date();
		this.internal.period.full   = this.internal.to - this.internal.from;
		this.internal.period.now    = this.internal.to - this.internal.now;

		this.internal.time.days     = this.internal.period.now/this.constant.day;
		this.internal.angle.days    = (this.internal.period.now > 0) ? ( 360/~~(this.internal.period.full/this.constant.day ) * ~~this.internal.time.days ) || 0 : 0;
		this.internal.tmp.days      = ~~this.internal.time.days * this.constant.day;

		this.internal.time.hours    = (this.internal.period.now - this.internal.tmp.days)/this.constant.hour;
		this.internal.angle.hours   = (this.internal.period.now > 0) ? 360/24 * this.internal.time.hours : 0;
		this.internal.tmp.hours     = ~~this.internal.time.hours * this.constant.hour;

		this.internal.time.minutes  = (this.internal.period.now - (this.internal.tmp.days + this.internal.tmp.hours))/this.constant.minute;
		this.internal.angle.minutes = (this.internal.period.now > 0) ? 360/60 * this.internal.time.minutes : 0;
		this.internal.tmp.minutes   = ~~this.internal.time.minutes * this.constant.minute;

		this.internal.time.seconds  = (this.internal.period.now - (this.internal.tmp.days + this.internal.tmp.hours + this.internal.tmp.minutes))/this.constant.second;
		this.internal.angle.seconds = (this.internal.period.now > 0) ? 360/60 * this.internal.time.seconds : 0;
	};

	// Отрисовка счетчиков и кругов прогресса
	Countdown.prototype.render = function () {
		this.calc();

		for ( var key in this.internal.counters ) {
			this.internal.counters[ key ].innerText = ~~this.internal.time[ key ];
			this.internal.circles[ key ].progressCircle.render( this.internal.angle[ key ] );
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
