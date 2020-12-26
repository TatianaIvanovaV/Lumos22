const {src, dest, parallel, series, watch} = require ("gulp");
const browserSync = require ('browser-sync').create();
const concat = require ("gulp-concat");
const uglify = require ("gulp-uglify-es").default;
const sass = require ("gulp-sass");
const autoprefixer = require ("gulp-autoprefixer");

function browsersync(){
  browserSync.init({
    server: {baseDir: 'src/'},
    notify: true,
    online: true
  })
};

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
  return src([
    'src/sass/main.sass'
  ])
  .pipe(sass())
  .pipe(concat("app.min.css"))
  .pipe(autoprefixer({overrideBrowserslist: ['last 3 versions',
  '> 5%']}))
  .pipe(dest("src/css/"))
}

function startwatch() {
  watch(["src/**/*.js", "!src/**/*.min.js"], scripts);
}


exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles= styles
exports.default     = parallel(scripts, browsersync, startwatch);