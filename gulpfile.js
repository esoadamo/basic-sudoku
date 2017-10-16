var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: ''
    },
    port: 12345
  })
})

gulp.task('sass', function(){
  return gulp.src('*.scss')
    .pipe(sass())
    .pipe(gulp.dest(''))
    .pipe(browserSync.reload({
      stream: true,
    }))
})

gulp.task('default', ['browserSync', 'sass'], function(){
  gulp.watch('*.*', ['sass']); 
});
