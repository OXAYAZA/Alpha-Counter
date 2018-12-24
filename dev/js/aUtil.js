"use strict";

/**
 * @module  αUtil
 * @version v1.0.0
 * @desc    Сервисные функции для α-модулей
 * @author  OXAYAZA {@link https://github.com/OXAYAZA} {@link https://www.linkedin.com/in/%D1%8E%D1%80%D0%B8%D0%B9-%D0%B1%D0%B0%D0%B7%D0%B0%D0%B5%D0%B2-166479165/}
 * @license CC BY-SA 4.0 {@link https://creativecommons.org/licenses/by-sa/4.0/}
 *
 * @todo aUtil wrap
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
