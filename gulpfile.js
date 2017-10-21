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

var jsAppFiles = [
	'src/app/app.js',
];

var jsVendorFiles =  [
	'src/vendor/jquery/jquery.min.js',
	'src/vendor/angular/angular.min.js',
	'src/vendor/angular/angular-animate.min.js',
	'src/vendor/angular/angular-resource.min.js',
	'src/vendor/angular/angular-route.js',
	'src/vendor/angular/angular-ui-router.js',
	'src/vendor/angular-web-notification/web-notification.js',
	'src/vendor/angular-web-notification/angular-web-notification.js',
	'src/vendor/nginfinitescroll/ng-infinite-scroll.min.js',
	'src/vendor/angular-tooltip/angular-tooltips.min.js',
	'src/vendor/angular-toast/angular-toastr.tpls.min.js',
	'src/vendor/facebook-angular/angular-facebook..js',
	'src/vendor/ngclibboard/ngclipboard.js',
	'src/vendor/ngaudio/angular.audio.js',
	'src/vendor/blueimp/js/blueimp-gallery.min.js',
	'src/vendor/lazyload/dropzone.js',
	'src/vendor/lazyload/dropzone-config-2.js',
],
jsDest = 'assets/js';

gulp.task('vendorScripts', function() {
    return gulp.src(jsVendorFiles)
        .pipe(concat('scripts-vendor.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts-vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'));
});

gulp.task('appScripts', function() {
    return gulp.src(jsAppFiles)
        .pipe(concat('scripts-bundle.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts-bundle.min.js'))
        .pipe(gulp.dest('./assets/js/'));
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', function () {
  gulp.start('styles');
  gulp.start('vendorScripts');
  gulp.start('appScripts');
  // gulp.start('html');
});

gulp.task('html', function(){
    return gulp.src(path.join(__dirname, '*.html'))
          .pipe($.versionAppend(['html', 'js', 'css'], {appendType: 'guid', versionFile: 'version.json'}))
          .pipe($.minifyHtml());
});
