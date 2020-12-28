
let preprocessor = 'sass';

const {src, dest, parallel, series, watch} = require ("gulp");
const browserSync = require ('browser-sync').create();
const concat = require ("gulp-concat");
const uglify = require ("gulp-uglify-es").default;
const sass = require ("gulp-sass");
const autoprefixer = require ("gulp-autoprefixer");
const cleancss = require ("gulp-clean-css");
const imagemin = require ("gulp-imagemin");
const newer = require ("gulp-newer");
const del = require ("del");
const pug = require ("gulp-pug");
const plumber = require ("gulp-plumber");
const sourcemaps = require ("gulp-sourcemaps");
//const favicons = require('gulp-favicons');


function browsersync(){
  browserSync.init({
    server: {baseDir: 'dist/'},
    notify: true,
    online: true
  })
}

function jade() {
  return src('src/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({pretty: true}))
    .pipe(dest('dist/'))
}

function scripts(){
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/popper.js/dist/popper.min.js",
    "src/js/main.js"
  ])
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest("dist/js/"))
    .pipe(browserSync.stream())
}

function styles() {
  return src(['src/assets/' + preprocessor + '/main.' + preprocessor+ ' ',
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  'src/assets/css/style.css'
  ])
    .pipe(eval(preprocessor)())
    .pipe(sourcemaps.init())
    .pipe(concat("app.min.css"))
    .pipe(autoprefixer({overrideBrowserslist: ['last 3 versions',
    '> 5%']}))
    .pipe(cleancss(( { level: {1:{specialComments:0}}/*, format: 'beautify'*/})))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/css/'))
    .pipe(browserSync.stream())
}

function images() {
  return src("src/assets/img/**/*")
    .pipe(newer('dist/assets/img/'))
    .pipe(imagemin())
    .pipe(dest('dist/assets/img/'))
}

function fonts() {
  return src('src/assets/fonts/src/**/*.*')
    .pipe(dest('dist/assets/fonts/'))

}

function favicon() {
  return src('src/assets/favicons/**/*')
  //.pipe(favicons())
    .pipe(dest('dist/assets/favicons/'))
}

function cleandist() {
  return del('dist/**/*', {force: true})
}

function startwatch() {
  watch(['src/assets/' + preprocessor + '/**/*'], styles);
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts);
  watch("src/**/*.html").on('change', browserSync.reload);
  watch("src/img/**/*", images);
  watch("src/**/*.pug", jade);
  watch("src/fonts/**/*", fonts);
  watch("src/favicons/**/*", favicon);
}


exports.browsersync= browsersync;
exports.scripts= scripts;
exports.styles= styles;
exports.images= images;
exports.jade= jade;
exports.fonts= fonts;
exports.favicon= favicon;
exports.build= series(cleandist, favicon, styles, scripts, images, fonts, jade);

exports.default= parallel(styles, scripts, fonts, jade, browsersync, startwatch);