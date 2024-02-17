const copy_files = () => {
	return gulpApp.gulp.src(gulpApp.path.src.files)
		.pipe(gulpApp.gulp.dest(gulpApp.path.build.files))
}

module.exports = copy_files