const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const pug = require('gulp-pug');


function browsersync() {
  browserSync.init({
    server : {
      baseDir: 'app/'
    }
  });
}



function cleanDist(){ // удаление папки dist
   return del('dist')
}

function images(){
  return src('app/images/**/*')
  .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
  ]))
  .pipe(dest('dist/images'))
}



function scripts(){
  return src([
    'node_modules/jquery/dist/jquery.js',
    'app/js/main.js',
  ])
  .pipe(concat('main.min.js')) //обьединяет файлы
  .pipe(uglify())//минифицирует
  .pipe(dest('app/js'))// где храним
  .pipe(browserSync.stream())//обновить страницу
}

function styles(){
  return src('app/scss/style.scss') // какой файл обрабатывать
    .pipe(scss({outputStyle:'compressed'}))  // каким плагином + сжатие
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],// ставит префиксы для старых браузеров
      grid: true
    }))
    .pipe(dest('app/css')) // где хратить готовый файл
    .pipe(browserSync.stream())//обновить сервер/страницу
}

function pugToHtml(){
  return src('app/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())//обновить страницу
}


function bild() { //закидывает готовые файлы в dist
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/js/main.min.js',
    'app/*.html',
  ],{base: 'app'}) // чтобы файлы находились в своих папках внутри папки dist
  .pipe(dest('dist'))
}




function watching(){
  watch(['app/scss/**/*.scss'], styles);// следим за файлами в папке styles
  watch(['app/pug/*.pug'], pugToHtml);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);// следим за файлами в папке scripts
  watch(['app/*.html']).on('chenge', browserSync.reload);
}

exports.styles = styles; //запускает таск, + прописать команду в терминале("gulp styles")
exports.pugToHtml = pugToHtml;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;



exports.bild = series(cleanDist, images, bild); //строгая последовательность (удаление папки, доб-е картинок, доб-е остальных файлов)

exports.default = parallel( styles, scripts, browsersync, watching); // прописываем в терминале gulp и запускаются параллельно два таска