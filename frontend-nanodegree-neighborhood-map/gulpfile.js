var gulp = require('gulp'),
    inline = require('gulp-inline'),
    cleanCss = require('gulp-clean-css'),
    uglify = require('gulp-uglifyjs'),
    htmlmin = require('gulp-htmlmin'),
    clean = require('gulp-clean'),
    strip = require('gulp-strip-comments'),
    imgmin = require('gulp-imagemin'),
    gulpif = require('gulp-if'),
    lazypipe = require('lazypipe'),
    concat = require('gulp-concat-css'),
    useref = require('gulp-useref');
var lazyCss = lazypipe()
    .pipe(concat, 'css/style.css')
    .pipe(cleanCss, {keepSpecialComments : 0});
var lazyHtml = lazypipe()
    .pipe(useref)
    .pipe(htmlmin, {collapseWhitespace: true});

gulp.task('minify', function(cb) {
    gulp.src('./src/**/*.*')
        .pipe(gulpif('**/*.css', lazyCss()))
        .pipe(gulpif('**/*.js', uglify()))
        .pipe(gulpif('**/*.png', imgmin()))
        .pipe(gulpif('**/*.html', lazyHtml()))
        .pipe(gulp.dest('./dist'));
    return cb;
});

gulp.task('watch', function(){
    gulp.watch('./src/**/*.*', ['minify'])
});