var gulp = require('gulp');
//Plugins
var jshint = require('gulp-jshint');
    minifyInline = require('gulp-minify-inline'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
   	jpegRecompress = require('imagemin-jpeg-recompress'),
    minifyCSS = require('gulp-minify-css'),
    resize = require('resize');

gulp.task('images', function () {
    gulp.src(['**/*.gif','**/*.png','!build/**','!node_modules/**'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]}))
        .pipe(gulp.dest('./build/'));

gulp.src(['**/*.jpg','!build/**','!node_modules/**'])
        .pipe(jpegRecompress({ loops: 6 , quality: 'low' })())
        .pipe(gulp.dest('./build/'));
});
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('minify-inline', function() {
  gulp.src('*.html')
    .pipe(minifyInline())
    .pipe(gulp.dest('./build/'))
});
gulp.task('minify-html', function() {
   var opts = {comments:false,spare:true};

  gulp.src('**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./build/'))
});
gulp.task('compress', function() {
  gulp.src('js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'))
});
gulp.task('minify-css', function() {
  gulp.src('css/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./build/css/'))
});
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});
gulp.task('scripts-views', function() {
    return gulp.src('./views/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./build/views/js/'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/views/js/'));
});
gulp.task('default', ['images','lint','minify-inline','minify-html','compress','minify-css',
	'scripts','scripts-views']);