const gulp = require('gulp');
const rename = require('gulp-rename');
const del = require('del');
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sass = require("gulp-sass");
const autoprefixer = require('gulp-autoprefixer');
const argv = require('yargs').argv;
const templateCache = require('gulp-angular-templatecache');

const createDirective = require('./gulp/create-directive');

const catchError = function (e) {
    console.log('>>> ERROR', e);
    this.emit('end');
};

gulp.task("default", () => gulp.start([
    'copy-static',
    'gen-html',
    'gen-templates',
    'gen-js',
    'gen-css',
    'gen-lib-js',
    'gen-lib-css'
]));

gulp.task('create', () => {
    console.log('hello');
    if (argv.directive !== undefined) {
        createDirective.create(argv.directive);
    }
});

gulp.task('dev', ['default'], () =>
    gulp.watch(['src/**/*'], ['default'])
);

gulp.task('copy-static', () =>
    gulp.src(['src/static/**/*'])
        .pipe(gulp.dest("release/static"))
);

gulp.task("gen-html", () =>
    gulp.src([
        "src/components/head/head.html",
        "src/components/footer/footer.html"
    ])
        .pipe(concat("index.ejs"))
        .pipe(gulp.dest('server/views'))
        .pipe(concat("index.html"))
        .pipe(gulp.dest('release'))
);

gulp.task('gen-templates', () =>
    gulp.src(['src/components/directives/**/*.html', 'src/components/screens/**/*.html'])
        .pipe(templateCache({
            module:'app',
            transformUrl: (url) => url.replace(/.*\//g, '').replace(/.*\\/g, '')
        }))
        .pipe(gulp.dest("release/static"))
);


gulp.task('gen-js', () =>
    gulp.src(['src/components/app.js', 'src/components/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(babel())
        .on('error', catchError)
        .pipe(gulp.dest("release/static"))
);

gulp.task('gen-css', () =>
    gulp.src([
        'src/components/global/global.scss',
        "src/components/**/*.scss"
    ])
        .pipe(concat('app.scss'))
        .pipe(sass({errLogToConsole: true}))
        .on('error', catchError)
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .on('error', catchError)
        .pipe(gulp.dest("release/static"))
);

gulp.task('gen-lib-js', () =>
    gulp.src([
        'src/bower-components/jquery/dist/jquery.min.js',
        'src/bower-components/angular/angular.min.js',
        'src/bower-components/angular-ui-router/release/angular-ui-router.min.js',
        'src/bower-components/angular-animate/angular-animate.js',
        'src/bower-components/angular-aria/angular-aria.js',
        'src/bower-components/angular-material/angular-material.js',
        'src/bower-components/lodash/dist/lodash.min.js',
        'src/bower-components/fastclick/lib/fastclick.js',
        'src/bower-components/inobounce/inobounce.js'
    ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest("release/static"))
);

gulp.task('gen-lib-css', () =>
    gulp.src([
        'src/bower-components/bootstrap/dist/css/bootstrap.min.css',
        'src/bower-components/angular-material/angular-material.min.css'
    ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest("release/static"))
);