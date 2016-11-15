var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    rigger = require('gulp-rigger'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    argv = require('yargs').argv,
    rename = require('gulp-rename'),
    reload = browserSync.reload,
    gutil = require('gulp-util'),
    ftp = require('vinyl-ftp');

var root = "D:/OpenServer/domains/lending/toloka.site/";
var homeRoot = "D:/Apache/development/congratulation/build/";
var projesticRoot = "C:/SERVER/htdocs/congratulation/build/";

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: root,
        js: root + '/js',
        css: root + '/css/',
        img: root + '/img/',
        fonts: root + '/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/*js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/sass/*.scss',
        img: 'src/img/**/*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.scss',
        img: 'src/img/**/*',
        fonts: 'src/fonts/*'
    }
};
function init() {
    if (argv.home) {
        path.build = {
            html: homeRoot,
            js: homeRoot + '/js',
            css: homeRoot + '/css/',
            img: homeRoot + '/img/',
            fonts: homeRoot + '/fonts/'
        };
    }else if(argv.projestic){
        path.build = {
            html: projesticRoot,
            js: projesticRoot + '/js',
            css: projesticRoot + '/css/',
            img: projesticRoot + '/img/',
            fonts: projesticRoot + '/fonts/'
        };
    }
}

gulp.task('sass', function () {
    init();
    //noinspection JSUnresolvedVariable
    gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 8 versions'],
            cascade: false
        }))

        .pipe(minifyCSS({keepBreaks: true}))
        .pipe(gulp.dest(path.build.css));
});

gulp.task('html', function () {
    init();
    //noinspection JSUnresolvedVariable
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    init();
    //noinspection JSUnresolvedVariable
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        // .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
});

gulp.task('img', function () {
    init();
    //noinspection JSUnresolvedVariable
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});
gulp.task('fonts', function () {
    init();
    //noinspection JSUnresolvedVariable
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('build', [
    'html',
    'js',
    'sass',
    'fonts',
    'img'
]);
gulp.task('deploy', function () {
    init();
    var host = argv.f;
    var user = argv.u;
    var password = argv.p;
    if(!host){
        console.log("Host is undefined. Please set arg --f");
        return false;
    }
    if(!user){
        console.log("User is undefined. Please set arg --u");
        return false;
    }
    if(!password){
        console.log("Password is undefined. Please set arg --p");
        return false;
    }

    var conn = ftp.create({
        host: host,
        user: user,
        password: password,
        port: 21,
        parallel: 3,
        log: gutil.log
    });

    var srcPath = path.build.html;
    var globs = srcPath + '**/*.*';

    return gulp.src(globs, {base: '.', buffer: false})
        .pipe(conn.newer('/public_html/staging/')) // only upload newer files
        .pipe(conn.dest('/public_html/staging/'));

});

gulp.task('watch', function () {
    init();
    watch([path.watch.html], function () {
        gulp.start('html');
    });
    watch([path.watch.style], function () {
        gulp.start('sass');
    });
    watch([path.watch.js], function () {
        gulp.start('js');
    });
    watch([path.watch.img], function () {
        gulp.start('img');
    });
    watch([path.watch.fonts], function () {
        gulp.start('fonts');
    });
});
gulp.task('default', [
    'build',
    'watch'
]);
