var gulp = require("gulp");
var slim = require("gulp-slim");
var replaceName = require('gulp-replace-name');
var embedTemplates = require('gulp-angular-embed-templates');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

gulp.task('slim', function () {
  return gulp.src("../app/views/components/*.slim")
    .pipe(slim({
      options: ["attr_list_delims={'~' => '~'}", "code_attr_delims={'~' => '~'}"]
    }))
    .pipe(gulp.dest('../public/javascript/tasa/components/components/'))
});

gulp.task('replaceName', function () {
  return gulp.src('../public/javascript/tasa/components/components/*.html')
    .pipe(replaceName(/\.html.html/g, '.html'))
    .pipe(gulp.dest('../public/javascript/tasa/components/components'));
});

gulp.task('angularMerge', function () {
  return gulp.src('../public/javascript/tasa/components/*.js')
    .pipe(embedTemplates({ sourceType: 'js', minimize: {quotes: true, empty: true } }))
    .pipe(gulp.dest('../public/javascript/tasa/components/'));
});

gulp.task('clean', function () {
  return gulp.src('../public/javascript/tasa/components/components')
    .pipe(clean({ force: true }))
});

gulp.task('default', function (callback) {
  runSequence('slim', 'replaceName', 'angularMerge', 'clean');
});
