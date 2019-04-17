'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var babel = require('gulp-babel');

gulp.task('script', function() {
    return gulp.src(['js/*.js','!js/*.min.js'])
        .pipe(babel())
        .pipe(gulp.dest('dist/js'))    //输出main.js到文件夹
        .pipe(uglify())    //压缩
});
gulp.task('auto',function(){
    gulp.watch(['js/*.js','!js/*.min.js'],['script']);
    gulp.watch('css/*.css', ['css']);
    gulp.watch('images/*.*', ['images'])
});
gulp.task('css', function() {
    return gulp.src('css/*.css')      //压缩的文件
        .pipe(gulp.dest('dist/css'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
});
gulp.task('images', function() {
    return gulp.src('images/*.*')      //压缩的文件
        .pipe(gulp.dest('dist/images'))   //输出文件夹
        .pipe(imagemin());   //执行压缩
});
gulp.task('default',['script','auto','css','images'],function () {
    console.log("default");
});