/**
 * The gulp of Mr. Atomson
 * @version 1.3.3
 */

const
	fs           = require( 'fs' ),
	gulp         = require( 'gulp' ),
	sass         = require( 'gulp-sass' ),
	less         = require( 'gulp-less' ),
	pug          = require( 'gulp-pug' ),
	jade         = require( 'gulp-jade' ),
	browserSync  = require( 'browser-sync' ),
	autoprefixer = require( 'gulp-autoprefixer' ),
	sourcemaps   = require( 'gulp-sourcemaps' ),
	plumber      = require( 'gulp-plumber' ),
	gulpIf       = require( 'gulp-if' ),
	Balloon      = require( 'node-notifier' ).WindowsBalloon,
	del          = require( 'del' ),
	zip          = require( 'gulp-zip' ),
	imagemin     = require( 'gulp-imagemin' ),
	validator    = require( 'gulp-html-validator' ),
	concat       = require( 'gulp-concat' ),
	insert       = require( 'gulp-insert' ),
	gutil        = require( 'gulp-util' ),
	rename       = require( 'gulp-rename' );

var configFile = 'config.json',
	config       = require( './'+ configFile ),
	notifier     = new Balloon();

gulp.task( 'config', function() {
	config = JSON.parse( fs.readFileSync( './'+ configFile, 'utf8' ) );
	gutil.log( gutil.colors.green( 'Config reloaded' ) );
});

gulp.task( 'sass', function() {
	var fail = false, startTime = process.hrtime();
	return gulp.src( procPath( config.sass.source ) )
		.pipe( plumber({ errorHandler: defaultErrorHandler }) )
		.pipe( sourcemaps.init({ loadMaps: true, largeFile: true, identityMap: true }) )
		.pipe( sass( config.sass.options ) )
		.on( 'error', function() { fail = true } )
		.pipe( gulpIf( config.autoprefixer.enable, autoprefixer( config.autoprefixer.options ) ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( procPath( config.sass.dest ) ) )
		.on( 'end', function() { if( !fail ) {
			browserSync.reload('*.css');
			notifier.notify({ title: 'SASS', message: 'Successfully compiled!\r'+ runtime( startTime ), time: 3000 });
		}})
});

gulp.task( 'less', function() {
	var fail = false, startTime = process.hrtime();
	return gulp.src( procPath( config.less.source ) )
		.pipe( plumber({ errorHandler: defaultErrorHandler }) )
		.pipe( sourcemaps.init({ loadMaps: true, largeFile: true, identityMap: true }) )
		.pipe( less() )
		.on( 'error', function() { fail = true } )
		.pipe( gulpIf( config.autoprefixer.enable, autoprefixer( config.autoprefixer.options ) ) )
		.pipe( sourcemaps.write( './' ) )
		.pipe( gulp.dest( procPath( config.less.dest ) ) )
		.on( 'end', function() { if( !fail ) {
			browserSync.reload('*.css');
			notifier.notify({ title: 'LESS', message: 'Successfully compiled!\r'+ runtime( startTime ), time: 3000 });
		}})
});

gulp.task( 'pug', function() {
	var fail = false, startTime = process.hrtime();
	return gulp.src( procPath( config.pug.source ) )
		.pipe( plumber({ errorHandler: defaultErrorHandler }) )
		.pipe( pug( procPugOptions( config.pug.options ) ) )
		.on( 'error', function() { fail = true } )
		.pipe( gulp.dest( procPath( config.pug.dest ) ) )
		.on( 'end', function() { if( !fail ) {
			browserSync.reload();
			notifier.notify({ title: 'PUG', message: 'Successfully compiled!\r'+ runtime( startTime ), time: 3000 });
		}})
});

gulp.task( 'jade', function() {
	var fail = false, startTime = process.hrtime();
	return gulp.src( procPath( config.jade.source ) )
		.pipe( plumber({ errorHandler: defaultErrorHandler }) )
		.pipe( jade( config.jade.options ) )
		.on( 'error', function() { fail = true } )
		.pipe( gulp.dest( procPath( config.jade.dest ) ) )
		.on( 'end', function() { if( !fail ) {
			browserSync.reload();
			notifier.notify({ title: 'JADE', message: 'Successfully compiled!\r'+ runtime( startTime ), time: 3000 });
		}})
});

gulp.task( 'validate:html', function() {
	var startTime = process.hrtime();
	return gulp.src( procPath( config.html.validate ) )
		.pipe( plumber({ errorHandler: defaultErrorHandler }) )
		.pipe( validator({ format: 'text' }) )
		.pipe( insert.transform( function( contents, file ) {
			var comment = '## '+ file.path +'\n';
			return comment + contents;
		}))
		.pipe( concat({ path: '#report.txt' }) )
		.pipe( gulp.dest( procPath( config.html.report ) ) )
		.on( 'end', function() {
			notifier.notify({ title: 'Validation Complete', message: runtime( startTime ), time: 3000 });
		})
});

gulp.task( 'build', function() {
	return Promise.all( formSerialArray( config.buildRules[ config.buildPreset ] ) );
});

gulp.task( 'browser-sync', function() {
	config.livedemo.server = procPath( config.livedemo.server );
	return browserSync.init( config.livedemo );
});

gulp.task( 'default', [ 'browser-sync' ], function() {
	gulp.watch( configFile, [ 'config' ] );

	if( config.js.enable )   gulp.watch( procPath( config.js.watch ),   browserSync.reload );
	if( config.html.enable ) gulp.watch( procPath( config.html.watch ), browserSync.reload );
	if( config.css.enable )  gulp.watch( procPath( config.css.watch ),  browserSync.reload );

	if( config.sass.enable ) gulp.watch( [ configFile, procPath( config.sass.watch ) ], [ 'sass' ] );
	if( config.less.enable ) gulp.watch( [ configFile, procPath( config.less.watch ) ], [ 'less' ] );
	if( config.pug.enable )  gulp.watch( [ configFile, procPath( config.pug.watch ) ],  [ 'pug' ] );
	if( config.jade.enable ) gulp.watch( [ configFile, procPath( config.jade.watch ) ], [ 'jade' ] );
});


/**
 * Action functions
 */

function clean( data, resolve, reject ) {
	gutil.log( 'Clean:', gutil.colors.magenta( procPath( data.src ) ) );
	del( procPath( data.src ) ).then( resolve, reject );
}

function copy( data, resolve, reject ) {
	gutil.log( 'Copy:', gutil.colors.magenta( procPath( data.src ) ), '>>', gutil.colors.magenta( procPath( data.dest ) ) );
	gulp.src( procPath( data.src ) )
		.on( 'error', reject )
		.pipe( gulp.dest( procPath( data.dest ) ) )
		.on( 'end', resolve );
}

function pack( data, resolve, reject ) {
	gutil.log( 'Pack:', gutil.colors.magenta( procPath( data.src ) ), '>>', gutil.colors.magenta( procPath( data.dest ) ) );
	gulp.src( procPath( data.src ), { base: data.base || "./" } )
		.on( 'error', reject )
		.pipe( zip( genVersionName() ) )
		.pipe( gulp.dest( procPath( data.dest ) ) )
		.on( 'end', resolve );
}

function minifyimg( data, resolve, reject ) {
	gutil.log( 'Minify images:', gutil.colors.magenta( procPath( data.src ) ), '>>', gutil.colors.magenta( procPath( data.dest ) ) );
	gulp.src( procPath( data.src ) )
		.on( 'error', reject )
		.pipe( imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 })
		], { verbose: true }) )
		.pipe( gulp.dest( procPath( data.dest ) ) )
		.on( 'end', resolve );
}

function portJadePug( data, resolve, reject ) {
	gutil.log( 'Port Jade to Pug:', gutil.colors.magenta( procPath( data.src ) ), '>>', gutil.colors.magenta( procPath( data.dest ) ) );
	gulp.src( procPath( data.src ) )
		.on( 'error', reject )
		.pipe( rename( function( path ) { path.extname = ".pug"; } ) )
		.pipe( gulp.dest( procPath( data.dest ) ) )
		.on( 'end', resolve );
}


/**
 * Service functions
 * Not recommended to modify
 */

function exist( testable ) {
	return typeof( testable ) !== 'undefined';
}

function realType( object ) {
	return Object.prototype.toString.call( object );
}

function runtime( time ) {
	time = process.hrtime( time );
	if( time[0] > 60 ) return ( ~~(time[0]/60) +'m '+ (time[0] - ~~(time[0]/60)*60) +'s' );
	else if( time[0] > 0 ) return ( time[0] +'.'+ ~~(time[1]/10000000) +'s' );
	else if( time[0] <= 0 && time[1] > 1000000 ) return ( ~~(time[1]/1000000) +'ms' );
	else if( time[1] > 1000 ) return ( ~~(time[1]/1000) +'\u03BCs' );
	else return ( time[1] +'ns' );
}

function addZeros( n, length ) {
	length = length || 2;
	n = String(n);
	while ( n.length < length ) n = '0'+ n;
	return n
}

function genVersionName() {
	var name,
		date = new Date();

	try { name = __dirname.split('\\').pop().match(/\d{5}/)[0]; }
	catch( error ) { name = 'version'; }

	name = name +'-'+
		date.getFullYear() +'.'+
		addZeros( date.getMonth()+1 ) +'.'+
		addZeros( date.getDate() ) +'-'+
		addZeros( date.getHours() ) +'.'+
		addZeros( date.getMinutes() ) +'.'+
		addZeros( date.getSeconds() ) +'.zip';

	return name;
}

function defaultErrorHandler( error ) {
	var errTitle = error.plugin.toUpperCase() +' Error',
		errMessage = 'Все очень плохо...';

	if( error.plugin === 'gulp-sass' || error.plugin === 'gulp-less' ) {
		errMessage =
			error.messageOriginal +
			'\rAt: '+ error.line +':'+ error.column +
			'\rFile: '+ error.relativePath;
		console.error( errTitle +'\n'+ error.messageOriginal + '\nAt: '+ error.line +':'+ error.column +'\nFile: '+ error.relativePath );
	} else if( error.plugin === 'gulp-pug' || error.plugin === 'gulp-jade' ) {
		errMessage =
			( error.msg ? error.msg : error.name ) +
			( ( error.line && error.column ) ? ('\rAt: '+ error.line +':'+ error.column) : '' ) +
			( error.filename ? ('\rFile: '+ error.filename) : ('\rFile: '+ error.path) );
		console.error( errTitle +'\n'+ error.message );
	} else {
		errMessage = JSON.stringify( error, '', 2 );
		console.error( errTitle +'\n'+ errMessage );
	}

	notifier.notify({
		title:   errTitle,
		message: errMessage,
		type:    'error',
		sound:   true,
		wait:    true
	});
}

function procMask( string ) {
	for( var i = 0; i < config.mask.length; i++) { string = string.replace( new RegExp( config.mask[i][0], 'g' ), config.mask[i][1] ); }
	return string;
}

function procPath( src ) {
	if( realType( src ) === '[object Array]' ) for( var i = 0; i < src.length; i++ ) { src[i] = procMask( src[i] ); }
	else src = procMask( src );
	return src;
}

function procPugOptions( options ) {
	if( !exist( options.locals ) ) options.locals = {};
	options.locals.gutil = gutil;
	return options;
}

function serialStage3( data, resolve, reject ) {
	eval( data.action )( data, resolve, reject );
}

function serialStage2( data, conditions ) {
	if( realType( conditions ) === '[object Promise]' ) {
		return new Promise( function( resolve, reject ) {
			conditions.then( function() {
				serialStage3( data, resolve, reject );
			});
		});
	} else {
		return new Promise( function( resolve, reject ) {
			serialStage3( data, resolve, reject );
		});
	}
}

function serialStage1( serialItem, conditions ) {
	if( realType( serialItem ) === '[object Object]' ) {
		return serialStage2( serialItem, conditions );
	} else {
		return Promise.all( function( serialItem ) {
			var arr = [];
			for( var i = 0; i < serialItem.length; i++ ) {
				arr.push( serialStage2( serialItem[i], conditions ) );
			}
			return arr;
		}( serialItem ) );
	}
}

function formSerialArray( buildRules ) {
	var serialArr = [], promiseArr = [];

	for( var i = 0; i < buildRules.length; i++ ) {
		if( buildRules[i].enable ) {
			if( buildRules[i].type == 'serial' ) {
				serialArr.push( buildRules[i] );
			} else if( realType( serialArr[ serialArr.length - 1 ] ) === '[object Array]' ) {
				serialArr[ serialArr.length - 1 ].push( buildRules[i] );
			} else {
				serialArr.push( [ buildRules[i] ] );
			}
		}
	}

	for( var i = 0; i < serialArr.length; i++ ) {
		promiseArr.push( function( serialArr, i ) {
			if( i === 0 ) return serialStage1( serialArr[i], false );
			else return serialStage1( serialArr[i], promiseArr[i-1] );
		}( serialArr, i ));
	}

	return promiseArr;
}


/**
 * Changelog
 *
 * 2017.08.26 - 1.3.3
 * + Нормализован вывод сообщений в консоль (плагин gulp-util), удалена функция genTime
 * + Добавлена переменная config.pug.options.verbose переключающая отображение компилируемого файла в консоли
 * + Добавлена переменная config.pug.options.locals с помощью которой можно передавать параметры в pug-файлы
 * + gulp-util передан в pug, можно адевкатно выводить сообщения в консоль при компиляции
 * + Исправлена ошибка при использовании action:clean
 *
 * 2017.08.21 - 1.3.2
 * + Добавлен action:portJadePug для быстрого портирования Jade в Pug
 * + Исправлен вывод путей при использовании масок в build
 *
 * 2017.08.17 - 1.3.1
 * + Удалена переменная config.root
 * + Добавлена возможность создания масок (config.mask) для глобальной замены в путях
 * + В правиле с action:minifyimg добавлен параметр base задающий путь относительно которого формируется структура архива (по умолчанию "./")
 *
 * 2017.08.11 - 1.3.0
 * + Добавлен таск validate для валидации *.html файлов, параметры config.html.validate и config.html.report
 *
 * 2017.08.10 - 1.2.2
 * + Использована переменная config.root, все опереции происходят относительно заданного каталога
 *
 * 2017.08.09 - 1.2.1
 * + Добавлен action:pack в правилах, создает zip-архив из переданых файлов относительно корня проекта
 * + Добавлен action:minifyimg в правилах, сжатие изображений
 *
 * 2017.08.08 - 1.2.0
 * + Изменена структура правил сборки ( теперь правило это объект, вместо массива )
 * + Добавлены пресеты для сборки
 * + Добавлена возможность указать последовательные и паралельные этапы сборки (serial, parallel)
 * + Действие (action) правила сборки вместо отдельных тасков (clean, copy)
 * + Служебные функции приведены к виду обьявления функции (Function Declaration) вместо функционального выражения (Function Expression) и перенесены в конец кода
 * + Иправлены проблемы с Less и Jade
 *
 * 2017.08.07 - 1.1.2
 * + Добавлен Jade
 * + Слежение за *.html и *.css
 * + Время компиляции в успешных оповещениях
 *
 * 2017.08.05 - 1.1.0
 * + Нормализован вывод сообщений об ошибках
 *
 * 2017.08.04 - 1.0.2
 * + Добавлена возможность задать правила для очистки
 * + Добавлен less
 *
 * 2017.08.03 - 1.0.1
 * + Добавлена возможность задать правила для сборки проекта
 */


/**
 * TODO
 * + Правило для удаления/добавления панели
 * + Правила для сборки rtl версии
 * + Довести до ума валидатор html
 * + Таск для парсинга пресетов для билдера
 * + Кеширование компилируемых файлов
 * + Вынести функции в модуль (А надо?)
 * + Preview browserSync плагин
 */
