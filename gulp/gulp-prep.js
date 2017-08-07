let gulp = require('gulp');
let fs = require('fs');

gulp.task('gulp-prep', function (cb) {
	fs.readFile('./src/settings/default-settings.json', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		let fileText = '/**\n* This file is auto-generated from default-settings.json by gulp-prep.js\n**/\nexport let defaultSettings = \n' + data + ';';
		fs.writeFile('./src/settings/default-settings.js', fileText, 'utf8', function (err) {
			if (err) {
				return console.log(err);
			}
		});
	});
	cb();
});
