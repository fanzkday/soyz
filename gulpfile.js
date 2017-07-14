const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('gulp-shell');

gulp.task('build', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./.soyz'));
})

gulp.task('default', ['build'], shell.task('npm run dev'));