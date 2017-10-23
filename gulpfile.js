'use strict';

// including plugins
var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
path = require('path'),
cleanCSS = require('gulp-clean-css'),
minify = require('gulp-minify-css'),
rev = require('gulp-rev'),
inject = require('gulp-inject'),
useref = require('gulp-useref'),
htmlmin = require('gulp-htmlmin'),
clean = require('gulp-rimraf'),
$ = require('gulp-load-plugins')();

var serve = require('gulp-serve');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');


gulp.task('build', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./assets/js/scripts-vendor.min.js',
  './assets/js/scripts-bundle-*.js',
   './assets/css/styles-vendor*.css',
   './assets/css/styles-bundle*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));

});

var vendorCssFiles = [
  'src/vendor/blueimp/css/blueimp-gallery.css',
  'src/vendor/angular-toast/angular-toastr.css',
];

gulp.task('vendorStyles', function() {
    gulp.src(vendorCssFiles)
      .pipe(concat('styles-vendor.css'))
      .pipe(rename('styles-vendor.min.css'))
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(rev())
      .pipe(gulp.dest('./assets/css/'));
});

gulp.task('styles', function() {
    gulp.src('src/sass/*.scss')
    	.pipe(concat('styles.css'))
    	.pipe(rename('styles-bundle.min.css'))
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(rev())
      .pipe(gulp.dest('./assets/css/'));
});

var jsAppFiles = [
	'src/app/app.js',
  'src/app/service/firebase.service.js',
  'src/app/controller/AuthController.js',
  'src/app/controller/MembersController.js',
  'src/app/controller/OrdersController.js',
  'src/app/directive/myEnter.directive.js',
  'src/app/directive/orderFilter.directive.js',
];


var jsAngularFiles =  [
	'src/vendor/angular/angular.min.js',
	'src/vendor/angular/angular-animate.min.js',
	'src/vendor/angular/angular-resource.min.js',
	'src/vendor/angular/angular-route.js',
	'src/vendor/angular/angular-ui-router.js',
],
jsVendorFiles =  [
  'src/vendor/angularhotkeys/hotkeys.min.js',
	'src/vendor/angular-web-notification/web-notification.js',
	'src/vendor/angular-web-notification/angular-web-notification.js',
	'src/vendor/angular-toast/angular-toastr.tpls.min.js',
	'src/vendor/facebook-angular/angular-facebook.js',
	'src/vendor/ngclibboard/ngclipboard.js',
	'src/vendor/ngaudio/angular.audio.js',
	'src/vendor/blueimp/js/blueimp-gallery.min.js',
],
jsDest = 'assets/js';

gulp.task('angularScripts', function() {
    return gulp.src(jsAngularFiles)
        .pipe(concat('scripts-angular.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'));
});

gulp.task('vendorScripts', function() {
    return gulp.src(jsVendorFiles)
        .pipe(concat('scripts-vendor.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(uglify())
        .pipe(gulp.dest('./assets/js/'));
});

gulp.task('appScripts', function() {
    return gulp.src(jsAppFiles)
        .pipe(concat('scripts-bundle.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./assets/js/'));
});


gulp.task('clean', [], function() {
  console.log("Clean all files in build folder");
  return gulp.src(["./assets/js/", "./assets/css/"], { read: false }).pipe(clean());
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  gulp.start('styles');
  gulp.start('vendorStyles');
  gulp.start('angularScripts');
  gulp.start('vendorScripts');
  gulp.start('appScripts');
});



gulp.task('serve', serve(''));
gulp.task('serve-build', serve(['public', 'build']));
gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 80,
  middleware: function(req, res) {
    // custom optional middleware 
  }
}));