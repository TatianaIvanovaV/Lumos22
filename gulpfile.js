
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


function browsersync(){
  browserSync.init({
    server: {baseDir: 'src/'},
    notify: true,
    online: true
  })
};

/*var config = {
  devFolder:           './src',
  buildFolder:         './build',
  secondBuildFolder:   '/static'
};*/

function scripts(){
  return src([
    "node_modules/jquery/dist/jquery.min.js",
    "src/js/main.js"
  ])
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js/"))
    .pipe(browserSync.stream())
}

function styles() {
  return src('src/' + preprocessor + '/main.' + preprocessor+ ' ' )
    .pipe(eval(preprocessor)())
    .pipe(concat("app.min.css"))
    .pipe(autoprefixer({overrideBrowserslist: ['last 3 versions',
    '> 5%']}))
    .pipe(cleancss(( { level: {1:{specialComments:0}}/*, format: 'beautify'*/})))
    .pipe(dest("src/css/"))
    .pipe(browserSync.stream())
}

function pug() {
  return src('src/pug/pages/*.pug')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(pug({
              pretty: true
          }
      ))
      .pipe(dest(config.buildFolder))
      .on('end', browserSync.reload)
}

function images() {
  return src("src/imgs/img/**/*")
    .pipe(newer('src/imgs/dest/'))
    .pipe(imagemin())
    .pipe(dest('src/imgs/dest/'))
}

function cleanimg() {
  return del('src/imgs/dest/**/*', {force: true})
}

function buildcopy() {
  return src([
    "src/css/**/*.min.css",
    "src/js/**/*.min.js",
    "src/imgs/dest/**/*",
    "src/**/*.html",
  ], {base: 'src'})
  .pipe(dest('dist'))
}

function cleandist() {
  return del('dist/**/*', {force: true})
}

function startwatch() {
  watch(['src/' + preprocessor + '/**/*'], styles);
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts);
  watch("src/**/*.html").on('change', browserSync.reload);
  watch("src/imgs/img/**/*", images);
}


exports.browsersync= browsersync;
exports.scripts= scripts;
exports.styles= styles;
exports.images= images;
exports.cleanimg= cleanimg;
exports.build= series(cleandist,  styles, scripts, images, buildcopy);

exports.default= parallel(styles, scripts, browsersync, startwatch);