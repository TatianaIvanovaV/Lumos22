const {src, dest, parallel, series, watch} = require ("gulp");
const browserSync = require ('browser-sync').create();
const concat = require ("gulp-concat");
const uglify = require ("gulp-uglify-es").default;

function browsersync(){
  browserSync.init({
    server: {baseDir: 'src/'},
    notify: false,
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

function startwatch() {
  watch(["src/**/*.js", "!src/**/*.min.js", scripts])
}

exports.browsersync= browsersync;
exports.scripts= scripts;
exports.default= parallel(scripts, browsersync, startwatch);

/*gulp.task('task-name', function() {
  
});*/