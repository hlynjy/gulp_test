'use strict';
import gulp from 'gulp';
import minimist from 'minimist'; //获取命令行配置
import path from 'path'; //路径类
import runSequence from 'gulp-sequence'; //串行 并行
import paths from './gulp/gulpPath'; //路径
import units from './gulp/gulpCom';
import moment from 'moment'; //格式化时间

//打印日志函数
let log = function() {
    console.log.apply(console, arguments)
};

//获取命令行配置项
const options = minimist(process.argv.slice(2));
//版本号
const version = moment().format('YYYYMMDDHHmmss');
//css \ js公共文件名字
const comFileName = 'public';
//是否开发模式
const isPro = options['p'] ? true : false;
//是否压缩
const isZip = options['z'] ? true : false;
//获取输出路径
const buildPath = isPro ? paths.buildProPath : paths.buildDevPath;
//是否监听实时刷新
const watch = options['w'] ? true : false;
//需要执行的任务
let taskArr = ['minifycss', 'uglify', 'buildcss', 'buildjs', 'htmlmin', 'static', 'staticimg'];
//主任务
gulp.task('main', runSequence('clean', taskArr, (isZip ? 'zip' : ''), (watch ? 'watch' : '')));
//测试
gulp.task("test");
//监听任务
gulp.task('watch', () => {
    units.watch(buildPath.html, {
        watchs: [
            [paths.srcPath.css, ["minifycss"]],
            [paths.srcPath.js, ["uglify"]],
            [paths.srcPath.build.css, ["buildcss"]],
            [paths.srcPath.build.js, ["buildjs"]],
            [paths.srcPath.html, ["htmlmin"]],
            [paths.srcPath.static, ["static"]],
            [paths.srcPath.images, ["staticimg"]]
        ]
    })
});

//清理文件
gulp.task('clean', () => {
    log("开始清空...");
    return units.clean([buildPath.html]);
});

//清空所有文件
gulp.task('cleanAll', () => {
    log("开始清空...");
    return units.clean(['build']);
});

//压缩css
gulp.task("minifycss", () => {
    log("开始压缩css....");
    return units.css(paths.srcPath.css, buildPath.css, { isMap: !isPro });
});

//压缩js
gulp.task("uglify", () => {
    log("开始压缩js....");
    return units.js(paths.srcPath.js, buildPath.js, { isMap: !isPro });
});

//合并css
gulp.task("buildcss", () => {
    log("开始合并css....");
    return units.css(paths.srcPath.build.css, buildPath.build.css, {
        isConcat: true,
        concatName: comFileName,
        isMap: !isPro
    });
});

//合并js
gulp.task("buildjs", () => {
    log("开始合并js....");
    return units.js(paths.srcPath.build.js, buildPath.build.js, {
        isConcat: true,
        concatName: comFileName,
        isMap: !isPro,
    });
});

//复制PHP
gulp.task("static", () => {
    log("开始复制静态文件....");
    paths.srcPath.static.push(isPro ? '**/MP_verify_bStEKvZbcF0IfMJH.txt' : '**/MP_verify_J9v9wmLDrs6MFfo7.txt');
    return units.static(paths.srcPath.static, buildPath.static, {
        gulpOptions: { base: 'src' },
        replaces: [
            ['@GULP_REPLACE_APPID@', isPro ? 'wx78aba7f16d881530' : 'wxdeb73187bf4f2557'],
            ['@GULP_REPLACE_APPSECRET@', isPro ? '929248bc7bea8875e1a3c8a2816d41e1' : '24c81d3291e36d8286f50debd3005a71'],
            ['@VERSIONTIME@', version]
        ],
    })
});

//复制图片
gulp.task("staticimg", () => {
    log("开始复制图片....");
    return units.static(paths.srcPath.images, buildPath.images, { gulpOptions: { base: 'src' } });
});

//压缩HTML
gulp.task("htmlmin", () => {
    log("开始压缩HTML....");
    return units.html(paths.srcPath.html, buildPath.html, {
        replaces: [
            [/<script.*?src=.*?lib\/lib\.js.*?><\/script>/i, ''],
            ["</title>", '</title><link rel="stylesheet" href="css/' + comFileName + ".css?v=" + version + '"></script><script src="js/' + comFileName + '.js?v=' + version + '"></script>'],
            [/<head>(\s|.)*?<title>/gi, '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0 user-scalable=no"><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /><meta name="apple-mobile-web-app-status-bar-style" content="black"/><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" /><meta name="x5-fullscreen" content="true"><meta name="full-screen" content="yes"><title>'],
            [/<script>.*?\s*?.*?includeFile.*?\s*?.*?<\/script>/gi, replaceJsCss]
        ]
    })
});

gulp.task("zip", () => {
    log("开始打包压缩");
    return units.gulpzip(['build/**/*.*', '!build/' + (isPro ? 'dev' : 'pro') + '/**/*.*', '!build/dev.zip', '!build/pro.zip'], 'build/', { filename: isPro ? 'pro.zip' : 'dev.zip' });
});

//替换HTML 引入 js css 函数
const replaceJsCss = function(str) {
    str = str.replace(/(\s+)/g, "");
    let repg = /<script>.*?includeFile\((.*?)\).*?<\/script>/gi;
    let src = eval(repg.exec(str)[1]);
    src = typeof src == 'string' ? [src] : src;
    let result = '';
    src.forEach(function(item) {
        if (path.extname(item) == '.js') {
            result += '<script src="' + item + "?v=" + version + '"></script>';
        } else {
            result += '<link rel="stylesheet" href="' + item + "?v=" + version + '">';
        }
    });
    return result;
};