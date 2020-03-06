const
	gulp        = require( 'gulp' ),
	babel       = require( 'gulp-babel' ),
	browserSync = require( 'browser-sync' ),
	emittyPug   = require( 'emitty' ).setup( 'dev', 'pug' ),
	emittyScss  = require( 'emitty' ).setup( 'dev', 'scss' ),
	plumber     = require( 'gulp-plumber' ),
	sass        = require( 'gulp-sass' ),
	pug         = require( 'gulp-pug' ),
	rename      = require( 'gulp-rename' ),
	gulpIf      = require( 'gulp-if' );

function errorHandler ( error ) {
	let
		errTitle = `${error.plugin.toUpperCase()} Error`,
		errMessage = '';

	switch ( error.plugin ) {
		case 'gulp-sass':
			errMessage = `${errTitle}\n${error.messageOriginal}\nAt: ${error.line}:${error.column}\nFile: ${error.relativePath}`;
			break;
		case 'gulp-pug':
			errMessage =
				( error.message ? error.message : error.name ) +
				( ( error.line && error.column ) ? ('\rAt: '+ error.line +':'+ error.column) : '' ) +
				( error.filename ? ('\rFile: '+ error.filename) : ('\rFile: '+ error.path) );
			break;
		default:
			errMessage = JSON.stringify( error, null, 2 );
			break;
	}

	console.log( `${errTitle}\n${errMessage}` );
}

function compileSass() {
	return new Promise( ( resolve, reject ) => {
		emittyScss.scan( global.emittyScssFile ).then( () => {
			return gulp.src( 'dev/**/!(_)*.scss' )
			.pipe( plumber({ errorHandler: errorHandler }) )
			.pipe( gulpIf( global.watch, emittyScss.filter( global.emittyScssFile ) ) )
			.pipe( sass({ outputStyle: 'expanded', indentType: 'tab', indentWidth: 1, linefeed: 'cr' }) )
			.on( 'error', resolve )
			.pipe( gulp.dest( 'dev' ) )
			.on( 'end', function () {
				browserSync.reload( '*.css' );
				resolve();
			});
		});
	});
}

function compilePug () {
	return new Promise( ( resolve, reject ) => {
		emittyPug.scan( global.emittyPugFile ).then( () => {
			gulp.src( 'dev/**/!(_)*.pug' )
			.pipe( plumber({ errorHandler: errorHandler }) )
			.pipe( gulpIf( global.watch, emittyPug.filter( global.emittyPugFile ) ) )
			.pipe( pug({ pretty: true, verbose: true, self: true, }) )
			.pipe( gulp.dest( 'dev' ) )
			.on( 'end', function () {
				browserSync.reload();
				resolve();
			})
		});
	});
}

function transpileJs () {
	return gulp.src( [ 'dev/Counter.js', 'dev/ProgressCircle.js', 'dev/Countdown.js' ] )
	.pipe( plumber({ errorHandler: errorHandler }) )
	.pipe( babel({
		minified: true,
		comments: false,
		presets: [[
			'@babel/preset-env',
			{
				"targets": {
					"ie": "10",
					"edge": "17",
					"firefox": "60",
					"chrome": "67",
					"safari": "11.1"
				}
			}
		]]
	}))
	.pipe( rename({ suffix: '.min' }) )
	.pipe( gulp.dest( 'dist' ) );
}

function defaultTask() {
	global.watch = true;

	browserSync.init({
		server: {
			baseDir: `./dev`,
			directory: false
		},
		port: 8000,
		open: false,
		notify: true,
		reloadDelay: 0,
		ghostMode: {
			clicks: false,
			forms: false,
			scroll: false
		}
	});

	gulp.watch( 'dev/**/*.scss', compileSass ).on( 'all', function ( event, filepath ) {
		global.emittyScssFile = filepath;
	});

	gulp.watch( 'dev/**/*.pug', compilePug ).on( 'all', function ( event, filepath ) {
		global.emittyPugFile = filepath;
	});

	gulp.watch( 'dev/**/!(*.min).js' ).on( 'change', function () {
		browserSync.reload();
	});
}

exports.default = defaultTask;
exports.sass = compileSass;
exports.pug = compilePug;
exports.transpileJs = transpileJs;
