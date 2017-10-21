'use strict';

// including plugins
var gulp = require('gulp'),
sass = require('gulp-sass'),
minifyCss = require("gulp-minify-css"),
concat = require('gulp-concat'),
path = require('path'),
$ = require('gulp-load-plugins')();

const versionConfig = {
  'value': '%MDS%',
  'append': {
    'key': 'v',
    'to': ['css', 'js'],
  },
};

gulp.task('styles', function() {
    gulp.src('src/sass/*.scss')
    	.pipe(concat('styles.css')) // this is what was missing
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./assets/css/'));
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', function () {
  gulp.start('styles');
  // gulp.start('html');
});

gulp.task('html', function(){
    return gulp.src(path.join(__dirname, '*.html'))
          .pipe($.versionAppend(['html', 'js', 'css'], {appendType: 'guid', versionFile: 'version.json'}))
          .pipe($.minifyHtml());
});
