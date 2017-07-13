let gulp = require('gulp');
let rename = require('gulp-rename');
//let zip = require('gulp-zip');

gulp.task('gulp-dist', function (cb) {
	let i, items;
	items = [
		{
			src: 'out/artemis.core.js',
			dst: 'dist'
		},
		{
			src: 'out/artemis.core.min.js',
			dst: 'dist'
		}
		// ,
		// {
		// 	src: 'out/artemis.core.js.map',
		// 	dst: 'dist'
		// }
	];
	for (i = 0; i < items.length; i++) {
		if (items[i].ren) {
			gulp.src(items[i].src).pipe(rename(items[i].ren)).pipe(gulp.dest(items[i].dst, {prefix: 1}));
		} else {
			gulp.src(items[i].src).pipe(gulp.dest(items[i].dst, {prefix: 1}));
		}
	}
	cb();
});
