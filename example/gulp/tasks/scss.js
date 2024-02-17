const dartSass = require('sass')
const gulpSass = require('gulp-sass')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')

const sass = gulpSass(dartSass)

const scss = () => {
	return gulpApp.gulp.src(gulpApp.path.src.scss, { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.css))
		.pipe(gulpApp.plugins.browsersync.stream())
}

module.exports = scss