var gulp = require('gulp'),
    sass = require('gulp-sass'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    del = require('del'),
    mainBowerFiles = require('gulp-main-bower-files'),
    filter = require('gulp-filter'),
    concat = require('gulp-concat'),
    image = require('gulp-image'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gulpFilter = require('gulp-filter'),
    browserSync = require('browser-sync').create(),
    csso = require('gulp-csso');

gulp.task('clean', function() {
    return del(['dist/*']);
});

gulp.task('copy-images', function() {
    gulp.src('src/img/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            advpng: true,
            jpegRecompress: false,
            jpegoptim: true,
            mozjpeg: true,
            gifsicle: true,
            svgo: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['build-css'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("src/**/*.scss", ['build-css']);
    gulp.watch("src/*.html", ['inject']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});

gulp.task('build-css', function() {
    var injectAppFiles = gulp.src('src/styles/*.scss', {
        read: false
    });
    var injectGlobalFiles = gulp.src('src/global/*.scss', {
        read: false
    });

    function transformFilepath(filepath) {
        return '@import "' + filepath + '";';
    }

    var injectAppOptions = {
        transform: transformFilepath,
        starttag: '// inject:app',
        endtag: '// endinject',
        addRootSlash: false,
    };

    var injectGlobalOptions = {
        transform: transformFilepath,
        starttag: '// inject:global',
        endtag: '// endinject',
        addRootSlash: false
    };

    return gulp.src('src/main.scss')
        .pipe(wiredep())
        .pipe(inject(injectGlobalFiles, injectGlobalOptions))
        .pipe(inject(injectAppFiles, injectAppOptions))
        .pipe(sourcemaps.init()) // Process the original sources
        .pipe(sass())
        .on('error', onError)
        .pipe(csso())
        .pipe(sourcemaps.write('.')) // Add the map to modified source.
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.stream());
});

function onError(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('build-vendor-js', function() {
    var filterJS = gulpFilter('**/*.js');
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-js', function() {
    return gulp.src('src/javascript/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('inject', function() {
    var injectFiles = gulp.src(['dist/styles/main.css', 'dist/js/vendor.js', 'dist/js/app.min.js']);

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src('src/index.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(gulp.dest('dist'));
});


gulp.task('default', ['clean', 'build-css', 'build-vendor-js'], function() {
    gulp.start('build-js', 'inject', 'copy-images', 'serve');
});
