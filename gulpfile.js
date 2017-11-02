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
var util = require("gulp-util");
var open = require('gulp-open');

var serve = require('gulp-serve');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var vendorCssFiles = [
  'src/vendor/blueimp/css/blueimp-gallery.css',
  'src/vendor/angular-toast/angular-toastr.css',
  'src/vendor/angular-tooltip/angular-tooltips.css',
  'src/vendor/angular-highchart/highcharts-ng.css',
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
    gulp.src(['src/sass/*.scss', 'src/tempcss.css'])
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
  'src/app/service/support.service.js',
  'src/app/controller/AuthController.js',
  'src/app/controller/MembersController.js',
  'src/app/controller/OrdersController.js',
  'src/app/controller/SupportController.js',
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
	// 'src/vendor/ngaudio/angular.audio.js',
	'src/vendor/blueimp/js/blueimp-gallery.min.js',
  'src/vendor/angular-tooltip/angular-tooltips.js',
  'src/vendor/angular-highchart/highstock.src.js',
  'src/vendor/angular-highchart/highcharts-ng.js',

  'src/vendor/custom-file-input/custom-file-input.js',
],
jsDest = 'assets/js';

gulp.task('angularScripts', function() {
    return gulp.src(jsAngularFiles)
        .pipe(concat('scripts-angular.min.js'))
        .pipe(gulp.dest(jsDest))
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

gulp.task('test', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sourcesCss = gulp.src([
   './assets/css/styles-bundle*.css', './assets/css/styles-vendor*.css'], {read: false});
  var sourcesJs = gulp.src([
   './assets/js/scripts-bundle-*.js'], {read: false});

  var sources = gulp.src([
    /*css*/
    './assets/css/styles-vendor*.css',
   './assets/css/styles-bundle*.css',
   'src/tempcss.css',
    /*angular*/
    // 'src/vendor/angular/angular.min.js',
    // 'src/vendor/angular/angular-animate.min.js',
    // 'src/vendor/angular/angular-resource.min.js',
    // 'src/vendor/angular/angular-route.js',
    // 'src/vendor/angular/angular-ui-router.js',
    /*vendor*/
    'src/vendor/angularhotkeys/hotkeys.min.js',
    'src/vendor/angular-web-notification/web-notification.js',
    'src/vendor/angular-web-notification/angular-web-notification.js',
    'src/vendor/angular-toast/angular-toastr.tpls.min.js',
    'src/vendor/facebook-angular/angular-facebook.js',
    'src/vendor/ngclibboard/ngclipboard.js',
    // 'src/vendor/ngaudio/angular.audio.js',
    'src/vendor/blueimp/js/blueimp-gallery.min.js',
    'src/vendor/angular-tooltip/angular-tooltips.js',
    'src/vendor/angular-highchart/highstock.src.js',
    'src/vendor/angular-highchart/highcharts-ng.js',
    'src/vendor/custom-file-input/custom-file-input.js',
    /*app*/
    'src/app/app.js',
    'src/app/service/firebase.service.js',
    'src/app/service/support.service.js',
    'src/app/controller/AuthController.js',
    'src/app/controller/MembersController.js',
    'src/app/controller/OrdersController.js',
    'src/app/controller/SupportController.js',
    'src/app/directive/myEnter.directive.js',
    'src/app/directive/orderFilter.directive.js',
  ], {read: false});

  return target.pipe(inject(sources))
    .pipe(htmlmin({collapseWhitespace: false}))
    .pipe(gulp.dest('./'));
});



gulp.task('app', ['test'], function(){
  var options = {
    uri: '127.0.0.1:3000',
    app: 'chrome'
  };
  gulp.src('./')
  .pipe(open(options));
});

gulp.task('dist', function(){
  var options = {
    uri: '127.0.0.1:3000',
    app: 'chrome'
  };
  gulp.src('./')
  .pipe(open(options));
});


gulp.task('serve',['app'], serve(''));

gulp.task('serve:dist',['dist'], serve(''));

gulp.task('serve-build', serve(['public', 'build']));
gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 80,
  middleware: function(req, res) {
    // custom optional middleware 
  }
}));

// dist:    gulp => gulp build => gulp serve:dist
// serve:   gulp serve