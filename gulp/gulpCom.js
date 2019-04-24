'use strict';
import gulp           from 'gulp';
import minifycss      from 'gulp-minify-css';         //css压缩
import concat         from 'gulp-concat';             //合并文件
import uglify         from 'gulp-uglify';             //js压缩
import rename         from 'gulp-rename';             //重命名
import jshint         from 'gulp-jshint';             //js检查
import notify         from 'gulp-notify';             //提示
import minimist       from 'minimist';                //获取命令行配置
import htmlmin        from 'gulp-htmlmin';            //压缩HTML
import replace        from 'gulp-replace';            //字符串替换
import browSync       from 'browser-sync';            //自动刷新  服务器
import stylish        from 'jshint-stylish';
import gulpif         from 'gulp-if';                 //gulp判断
import clean          from 'gulp-clean';              //清空文件夹
import runSequence    from 'gulp-sequence';           //串行 并行
import autoprefixer   from 'gulp-autoprefixer' ;      //添加css 兼容性前缀
import gulpStylelint  from 'gulp-stylelint' ;         //检测css 语法
import extend         from 'node.extend' ;
import sourcemaps     from 'gulp-sourcemaps' ;
import gulpZip        from 'gulp-zip';
import ts             from 'gulp-typescript';

const units = {};

//清空文件
units.clean = (path) => {
    return gulp.src(path, {read: false})
        .pipe(clean());
};

//压缩整合css
units.css = (src, build, options) => {
    let config = {
        isMin: true,
        preFixer: {
            browsers: ['last 2 versions', 'Android >= 4.0', 'last 1 Chrome versions'],
            cascade: false
        },
        isConcat: false,
        concatName: '',
        replaces: [],
        isMap: true,
        gulpOptions: {},
    };
    options = extend(config, options);
    let result = gulp.src(src, options.gulpOptions)
        .pipe(gulpif(options.isMap, sourcemaps.init()))
        .pipe(autoprefixer(options.preFixer))
        .pipe(gulpif(options.isConcat, concat(options.concatName + '.css')));
    //替换
    options.replaces.forEach((item) => {
        result = result.pipe(replace(item[0], item[1]));
    });
    return result
        .pipe(gulpif(options.isMin, minifycss()))
        .pipe(gulpif(options.isMap, sourcemaps.write()))
        .pipe(gulp.dest(build))
};

//压缩整合js
units.js = (src, build, options) => {
    let config = {
        isMin: true,
        isConcat: false,
        concatName: '',
        replaces: [],
        gulpOptions: {},
        isMap: true
    };
    options = extend(config, options);

    let result = gulp.src(src, options.gulpOptions)
        .pipe(ts({
            target: "es5",
            allowJs: true,
            module: "commonjs",
            moduleResolution: "node"
        }))
        .pipe(uglify())
        .pipe(gulpif(options.isMap, sourcemaps.init()))
        .pipe(gulpif(options.isConcat, concat(options.concatName + '.js')));
    //替换
    options.replaces.forEach((item) => {
        result = result.pipe(replace(item[0], item[1]));
    });
    return result
        .pipe(gulpif(options.isMin, uglify()))
        .pipe(gulpif(options.isMap, sourcemaps.write()))
        .pipe(gulp.dest(build))
};

//压缩HTML
units.html = (src, build, options) => {
    let config = {
        isMin: true,
        replaces: [],
        htmlMinOptions: {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        },
        gulpOptions: {},
    };
    options = extend(config, options);

    let result = gulp.src(src, options.gulpOptions);
    //替换
    options.replaces.forEach((item) => {
        result = result.pipe(replace(item[0], item[1]));
    });
    return result
        .pipe(gulpif(options.isMin, htmlmin(options.htmlMinOptions)))
        .pipe(gulp.dest(build))
};

//复制转移静态文件
units.static = (src, build, options) => {
    let config = {
        replaces: [],
        gulpOptions: {},
    };
    options = extend(config, options);

    let result = gulp.src(src, options.gulpOptions);
    //替换
    options.replaces.forEach((item) => {
        result = result.pipe(replace(item[0], item[1]));
    });
    return result
        .pipe(gulp.dest(build));
};

//监听文件
units.watch = (path, options) => {
    let config = {
        watchs: [],
        watchOptions: {},
    };
    options = extend(config, options);
    browSync({
        server: {
            baseDir: path　　//设置项目根目录，由此启动一个服务器
        },
        port: 8989
    });
    options.watchs.forEach((item) => {
        gulp.watch(item[0], item[1]);
    });

    //自动刷新 加上定时器防止 刷新多次
    let timer = null;
    gulp.watch(path + '**', () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            browSync.reload();
        }, 500);
    });
};

//监听文件
units.gulpzip = (src , build, options) => {
    let config = {
        filename : '' ,
        gulpOptions : {},
    };
    options = extend(config, options);

    let result = gulp.src(src, options.gulpOptions);
    result = result.pipe(gulpZip(options.filename));
    return result
        .pipe(gulp.dest(build));
};


export default units ;