'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

gulp.task('script', function() {
    return gulp.src(['js/*.js','!js/*.min.js'])
        .pipe(babel())
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('dist/js'))    //输出main.js到文件夹
});
gulp.task('auto',function(){
    gulp.watch(['js/*.js','!js/*.min.js'],['script']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('images/*.*', ['images'])
});
gulp.task('css', function() {
    return gulp.src(['css/*.css','!css/!*.min.css'])      //压缩的文件
        .pipe(minifycss())   //执行压缩
        //.pipe(cleanCSS({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/css'))   //输出文件夹
});
/*gulp.task('concat',function () {
    return gulp.src(['css/!*.css','!css/!*.min.css'])
        .pipe(concat('wap.min.css')) //- 合并后的文件名
        .pipe(minifycss()) //- 压缩处理成一行
        .pipe(rev()) //- 文件名加MD5后缀
        .pipe(gulp.dest('./css')) //- 输出文件本地
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev')); //- 将 rev-manifest.json 保存到 rev 目录内});
});*/
/*gulp.task('rev',function () {
    return gulp.src(['./rev/!*.json', './application/!**!/header.php']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector()) //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/')); //- 替换后的文件输出的目录});
});*/
gulp.task('images', function() {
    return gulp.src('images/*.*')      //压缩的文件
        .pipe(imagemin())  //执行压缩
        .pipe(gulp.dest('dist/images'))   //输出文件夹
});
gulp.task('default',['script','auto','css','images'],function () {
    console.log("default");
});