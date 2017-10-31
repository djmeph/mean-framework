/* file: gulpfile.js */

var gulp   = require('gulp');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var less = require('gulp-less');

gulp.task('pug', function buildHTML() {
  return gulp.src('views/*.pug')
  .pipe(pug({
    data: {
      title: 'MEAN Framework',
      built: new Date().getTime()
    }
  }))
  .pipe(gulp.dest('www'));
});

gulp.task('js', function() {
  return gulp.src('_src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gutil.env.type === 'production' ? uglify({ mangle: false }) : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www'));
});

gulp.task('less', function () {
  return gulp.src('less/app.less')
    .pipe(sourcemaps.init())
    .pipe(gutil.env.type === 'production' ? less({ compress: true }) : less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www'));
});

gulp.task('default', ['pug', 'js', 'less']);
