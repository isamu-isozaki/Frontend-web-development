var gulp = require('gulp'),
    jasmine = require('gulp-jasmine-phantom');

gulp.task('default', function() {
    gulp.src('jasmine/spec/feedreader.js')
        .pipe(jasmine({
            integration: true,
            vendor: ['js/app.js', 'jasmine/lib/jasmine-2.1.2/*.js']
        }));
});

