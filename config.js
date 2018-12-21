const
	action = require( 'tempaw-functions' ).action,
	preset = require( 'tempaw-functions' ).preset;

module.exports = {
	livedemo: {
		enable: true,
		server: {
			baseDir: "dev/",
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
	},
	sass: {
		enable: true,
		showTask: false,
		watch: `dev/sass/**/*.scss`,
		source: `dev/sass/!(_).scss`,
		dest: 'dev/css/',
		options: {
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: 1,
			linefeed: 'cr'
		}
	},
	less: {
		enable: false,
		showTask: false,
		watch: 'dev/less/**/*.less',
		source: 'dev/less/style.less',
		dest: 'dev/css/'
	},
	pug: {
		enable: true,
		showTask: false,
		watch: 'dev/pug/**/*.pug',
		source: 'dev/pug/!(_)*.pug',
		dest: 'dev/',
		options: {
			pretty: true,
			verbose: true,
			emitty: true
		}
	},
	jade: {
		enable: false,
		showTask: false,
		watch: 'dev/jade/**/*.jade',
		source: 'dev/jade/pages/!(_)*.jade',
		dest: 'dev/',
		options: {
			pretty: true
		}
	},
	babel: {
		enable: false,
		watch: 'dev/babel/**/!(_)*.js',
		source: 'dev/babel/!(_)*.js',
		dest: 'dev/js/',
		options: {
			presets: ['env'],
			comments: false,
			compact: true,
			minified: true,
			sourceType: 'script'
		},
		alternate: {
			sourcemaps: false
		}
	},
	autoprefixer: {
		enable: false,
		options: {
			cascade: true,
			browsers: ['Chrome >= 45', 'Firefox ESR', 'Edge >= 12', 'Explorer >= 10', 'iOS >= 9', 'Safari >= 9', 'Android >= 4.4', 'Opera >= 30']
		}
	},
	watcher: {
		enable: true,
		watch: 'dev/js/**/*.js'
	},
	htmlValidate: {
		showTask: false,
		source: 'dev/*.html',
		report: 'dev/'
	},
	jadeToPug: {
		showTask: false,
		source: 'dev/jade/**/*.jade',
		dest: 'dev/pug/'
	},
	lessToScss: {
		showTask: false,
		source: 'dev/less/**/*.less',
		dest: 'dev/scss/'
	},
	cache: {
		showTask: false,
	},
	buildRules: {
		'util-backup': [
			action.pack({
				src: [ 'dev/**/*', '*.*' ], dest: 'versions/',
				name( dateTime ) { return `aCounters-${dateTime[0]}-${dateTime[1]}.zip`; }
			})
		]
	}
};
