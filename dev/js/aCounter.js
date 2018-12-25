"use strict";

/**
 * @module   αCounter
 * @version  v0.1.1
 * @author   OXAYAZA {@link https://github.com/OXAYAZA}
 * @license  CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 * @requires module:αUtil
 * @see      {@link https://github.com/OXAYAZA/Alpha-Counter}
 * @see      {@link https://codepen.io/OXAYAZA/pen/JJryqW}
 * @see      {@link https://www.linkedin.com/in/%D1%8E%D1%80%D0%B8%D0%B9-%D0%B1%D0%B0%D0%B7%D0%B0%D0%B5%D0%B2-166479165/}
 *
 * @todo     float numbers
 * @todo     merge skips null
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

	// Служебные параметры
	Counter.prototype.internal = {
		intervalId: null,
		value:      0,
		loops:      0,
		increment:  0,
		loop:       0
	};

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
		clearInterval( this.internal.intervalId );
		this.internal.value     = this.params.from;
		this.internal.loops     = Math.ceil( this.params.duration / this.params.refresh );
		this.internal.increment = ( this.params.to - this.params.from) / this.internal.loops;
		this.internal.loop      = 0;
		if ( this.params.onStart instanceof Function ) this.params.onStart.call( this, ~~this.internal.value );
		this.internal.intervalId = setInterval( this.update.bind( this ), this.params.refresh );
	};

	// обновление значения счетчика
	Counter.prototype.update = function () {
		this.internal.value += this.internal.increment;
		this.internal.loop++;

		if ( this.params.onUpdate instanceof Function ) this.params.onUpdate.call( this, ~~this.internal.value );

		if ( this.internal.loop >= this.internal.loops ) {
			clearInterval( this.internal.intervalId );
			this.internal.value = this.params.to;

			if ( this.params.onComplete instanceof Function ) this.params.onComplete.call( this, ~~this.internal.value );
		}

		this.render();
	};

	// Отрисовка значения счетчика
	Counter.prototype.render = function () {
		if ( this.params.formatter instanceof Function ) {
			this.params.node.innerHTML = this.params.formatter.call( this, ~~this.internal.value );
		} else {
			this.params.node.innerHTML = ~~this.internal.value;
		}
	};

	return new Counter( data );
}
