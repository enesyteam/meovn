'use strict';

// including plugins
var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
path = require('path'),
cleanCSS = require('gulp-clean-css'),
minify = require('gulp-minify-css'),
$ = require('gulp-load-plugins')();

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

const versionConfig = {
  'value': '%MDS%',
  'append': {
    'key': 'v',
    'to': ['css', 'js'],
  },
};

gulp.task('styles', function() {
    gulp.src('src/sass/*.scss')
    	.pipe(concat('styles.css'))
    	.pipe(rename('styles-bundle.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./assets/css/'));
});


var jsVendorFiles =  'src/vendor/angular/*.js',
jsDest = 'assets/js';

gulp.task('scripts', function() {
    return gulp.src(jsVendorFiles)
        .pipe(concat('scripts-vendor.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts-vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'));
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', function () {
  gulp.start('styles');
  gulp.start('scripts');
  // gulp.start('html');
});

gulp.task('html', function(){
    return gulp.src(path.join(__dirname, '*.html'))
          .pipe($.versionAppend(['html', 'js', 'css'], {appendType: 'guid', versionFile: 'version.json'}))
          .pipe($.minifyHtml());
});
