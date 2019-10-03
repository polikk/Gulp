let gulp = require('gulp');
let pug = require('gulp-pug');
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let rollup = require('rollup');
let resolve = require('rollup-plugin-node-resolve');
let babel = require('rollup-plugin-babel');
let browserSync = require('browser-sync').create();
gulp.task('build:pug', () => {
    return gulp.src('app/pug/*.pug')
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('dist'));
  });
  gulp.task('build:scss', () => {
    return gulp.src('app/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss())
      .pipe(gulp.dest('dist/css'));
  });
  gulp.task('build:js', () => {
    return rollup.rollup({
      input: 'app/js/main.js',
      plugins: [
        resolve(),
        babel({
          exclude: 'node_modules/**'
        }),
      ],
    }).then(bundle => {
      return bundle.write({
        file: 'dist/js/main.js',
        format: 'iife'
      });
    });
  });
  gulp.task('build:images', () => {
    return gulp.src('app/img/**/*', {
      allowEmpty: true
    })
      .pipe(gulp.dest('dist/img'));
  });
  gulp.task('build:resources', () => {
    return gulp.src('app/resources/**/*', {
      dot: true,
      allowEmpty: true
    })
      .pipe(gulp.dest('dist/resources'))
  });
  gulp.task('build', gulp.parallel(
    'build:pug',
    'build:scss',
    'build:js',
    'build:images',
    'build:resources'
  ));
  gulp.task('serve', () => {
    browserSync.init({
      server: {
        baseDir: 'dist'
      }
    });
  });
  gulp.task('watch', () => {
    gulp.watch('app/pug/**/*.pug', gulp.series('build:pug'));
    gulp.watch('app/scss/**/*.scss', gulp.series('build:scss'));
    gulp.watch('app/js/**/*.js', gulp.series('build:js'));
    gulp.watch('app/img/**/*', gulp.series('build:images'));
    gulp.watch(['app/resources/**/*', 'app/resources/**/.*'], gulp.series('build:resources'));
    gulp.watch('dist/**/*').on('change', browserSync.reload);
  });
  gulp.task('default', gulp.series(
    'build',
    gulp.parallel(
      'serve',
      'watch'
    )
  ));