var gulp = require('gulp')
    , uglify = require('gulp-uglify')
    , minifyCss = require('gulp-minify-css')
    , htmlmin = require('gulp-htmlmin')
    , imagemin = require('gulp-imagemin')
    , cache = require('gulp-cache')
    , del = require('del')
    , stripComments = require('gulp-strip-comments')//doesn't strip comments
    , inline = require('gulp-inline')
    , uncss = require('gulp-uncss')//doesn't work for styles and classes added by js
    , pathExists = require('path-exists');//used for debugging yet couldn't debug it(gulp optimize)


function clear(){
    del('src');
    del('temp-src');
}

function optiSend(){
    gulp.src('production/css/*.css')
        //.pipe(uncss({
        //    html: ['production/index.html', 'production/pizza.html', 'production/project-2048.html', 'production/project-mobile.html','production/project-webperf.html']
        //})) this removes even the css that was added by javascript
        //.pipe(stripComments())
        //this doesn't strip the comments from the bootstrap-grid.css
        .pipe(gulp.dest('temp-src/css'));
    gulp.src('production/img/*.+(png|jpg)')
        .pipe(gulp.dest(['src/img', 'temp-src/img']));
    gulp.src('production/js/*.js')
        .pipe(gulp.dest('temp-src/js'));
    gulp.src('production/*.html')
        .pipe(gulp.dest('temp-src'));
}

function miniSend() {
    gulp.src('production/img/*.+(png|jpg)')
        .pipe(imagemin())
        .pipe(gulp.dest('src/img'));
    gulp.src('temp-src/*.html')
        .pipe(inline({
            base: 'temp-src',
            js: uglify,
            css: minifyCss,
            disabledTypes: ['svg', 'img']
        }))
        .pipe(cache(htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('src'))
}

function giveUpSend(){
    gulp.src('production/img/*.+(png|jpg)')
        .pipe(imagemin())
        .pipe(gulp.dest('src/img'));
    gulp.src('production/*.html')
        .pipe(inline({
            base: 'production',
            js: uglify,
            css: minifyCss,
            disabledTypes: ['svg', 'img']
        }))
        .pipe(cache(htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('src'))
}

function cleanUp() {
    del('temp-src');
}
gulp.task('clear', function(){
    return clear();
});

gulp.task('optiSend', function(){
    return optiSend();
});
gulp.task('miniSend', function(){
    return miniSend();
});
gulp.task('cleanUp', function(){
    return cleanUp();
});
gulp.task('giveUpSend', function(){
   return giveUpSend();
});

gulp.task('optimize', function(){//this is only a problem if the optiSend does work yet my perspective on it is that I want it to work.
    return new Promise(function(resolved) {
            resolved();
        }
    ).then(
        function(){
            clear();
        }
    ).then(
        function(){
            optiSend();
        }
    ).then(
        function() {
            miniSend();
        }
    ).then(
        function() {
            cleanUp();
        }
    )

});

gulp.task('clearCache', function(){
    return cache.clearAll()
});


