const
	gulp         = require( 'gulp' ),
	browserSync  = require( 'browser-sync' ),
	gutil        = require( 'gulp-util' ),
	util         = require( 'tempaw-functions' ).util,
	task         = require( 'tempaw-functions' ).task,
	ROOT         = process.cwd().replace( /\\/g, '/' ),
	configFile   = `${ROOT}/config.js`;

util.configLoad( configFile );

// Default task
gulp.task( 'default', function() {
	global.watch = true;

	gulp.watch( configFile, function config( end ) {
		util.configLoad( configFile );
		end();
	});

	if( global.config.livedemo.enable ) browserSync.init( global.config.livedemo );
	else gutil.log( gutil.colors.yellow( 'Livedemo disabled!' ) );

	if( global.config.watcher.enable ) {
		var watcher = gulp.watch( global.config.watcher.watch );

		watcher.on ( 'change', function( path, stats ) {
			browserSync.reload( path );
		});
	}

	if( global.config.sass.enable )  gulp.watch( [ configFile, global.config.sass.watch ],  task.sass );
	if( global.config.less.enable )  gulp.watch( [ configFile, global.config.less.watch ],  task.less );
	if( global.config.jade.enable )  gulp.watch( [ configFile, global.config.jade.watch ],  task.jade );
	if( global.config.babel.enable ) gulp.watch( [ configFile, global.config.babel.watch ], task.babel );
	if( global.config.pug.enable )   gulp.watch( [ configFile, global.config.pug.watch ],   task.pug ).on('all', ( event, filepath ) => {
		global.emittyChangedFile = filepath;
	});
});

// Show Extra Tasks
if( global.config.cache.showTask )        gulp.task( task.cache );
if( global.config.sass.showTask )         gulp.task( task.sass );
if( global.config.less.showTask )         gulp.task( task.less );
if( global.config.pug.showTask )          gulp.task( task.pug );
if( global.config.jade.showTask )         gulp.task( task.jade );
if( global.config.htmlValidate.showTask ) gulp.task( task.htmlValidate );
if( global.config.jadeToPug.showTask )    gulp.task( task.jadeToPug );
if( global.config.lessToScss.showTask )   gulp.task( task.lessToScss );

// Generating tasks from build rules
util.genBuildTasks();
