'use strict';
//输入路径
const src = 'src/';

//输出路径
const build = 'build/';

let paths = {} ;

/**
 * 递归拼接字符串
 * @param path
 * @param str
 */
function joinPath(path , str){
    for(let k in path) {
        if(typeof path[k] == 'string') {
            if(path[k].substr(0,1) != '!') path[k] = str + path[k];
        }else{
            path[k] = joinPath(path[k] , str);
        }
    }
    return path ;
}

//输入
let srcPath = {
    //JS路径
    js : ['**/*.js','!**/lib.js'] ,
    //css路径
    css : ['**/*.css'] ,
    //静态文件
    static : [ '**/*.json'] ,
    //图片文件
    images : ['images/*','lib/images/*'] ,
    //html文件
    html : ['**/*.html','!**/lib/**'] ,
    //合并文件
    build : {
        css : [
            'lib/css/mui.css',
            'lib/css/swiper.min.css'
        ] ,
        js : [
            'lib/js/jquery.min.js',
            'lib/js/mui.min.js',
            'lib/js/jQuery.md5.js',
            'lib/js/jquery.cookie.js',
            'lib/js/jsencrypt.min.js',
            'lib/js/set-rootElem-rem.js',
            'lib/js/swiper.min.js'
        ],
    },
};

//输出
let buildPath = () => {
    return {

        //js路径
        js : '' ,

        //css路径
        css : '',

        //静态文件
        static : '' ,

        //图片文件
        images : '' ,

        //html文件
        html : '' ,

        //合并文件
        build : {
            css : 'css' ,
            js : 'js',
        },
    };
};

paths.buildDevPath = joinPath(buildPath() , build + "dev/") ;
paths.buildProPath = joinPath(buildPath() , build + "pro/") ;
paths.srcPath = joinPath(srcPath , src) ;

export default paths ;