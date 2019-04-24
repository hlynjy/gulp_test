;(function (window, document) {

    //版本号 暂时用随机数 上线后用固定值
    // var _version = Math.random();
    var _version = 20180427;
    /**
     * 加载文件
     */
    window.includeFile = function (file) {
        var files = typeof file == "string" ? [file] : file;
        for (var i = 0; i < files.length; i++) {
            var name = files[i].replace(/^\s|\s$/g, "");
            var att = name.split('.');
            var ext = att[att.length - 1].toLowerCase();
            var isCSS = ext == "css";
            var tag = isCSS ? "link" : "script";
            var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
            var link = (isCSS ? "href" : "src") + "='" + name + '?' + _version + "'";

            document.write("<" + tag + attr + link + "></" + tag + ">");
        }
    };

    /**
     *  获取当前JS文件路径
     * @returns {*}
     */
    function getJsUrl() {
        var js = document.scripts;
        var jsPath;
        for (var i = 0; i < js.length; i++) {
            if (js[i].src.indexOf("lib.js") > -1) {
                jsPath = js[i].src.substring(0, js[i].src.lastIndexOf("/")) + "/";
            }
        }
        return jsPath;
    }
    var comPath = getJsUrl();

    /**
     * 获取目录 不准确 凑合这用
     * @returns {string}
     */
    function getPath() {
        var url = location.href;
        var length = url.length > comPath.length ? url.length : comPath.length;
        var deffNum = 0;
        for (var i = 0; i < length; i++) {
            if (url[i] == '/') deffNum = i + 1;
            if (url[i] != comPath[i]) {
                break;
            }
        }
        return comPath.substring(0, deffNum);
    }

    window.C = {
        debug: true,
    };


    //项目根目录路径
    window._PATH_ = getPath();

    //lib目录
    window._LIBPATH_ = comPath;

    //加载框架公共文件
    //includeFile([comPath + 'js/jweixin.1.3.2.js', comPath + 'css/style.css', comPath + 'css/alert.css', comPath + 'css/reset.css', comPath + 'css/weui.min.css', comPath + 'js/jquery.min.js', comPath + 'js/function.js', comPath + 'js/fastclick.js', comPath + 'js/alert.js', comPath + 'js/common.js', comPath + 'js/set-rootElem-rem.js', comPath + 'js/template.js', comPath + 'js/weui.min.js', comPath + 'js/config/config.js']);
    includeFile([comPath + 'css/mui.css', comPath + 'css/swiper.min.css', comPath + 'js/set-rootElem-rem.js' , comPath + 'js/jquery.min.js', comPath + 'js/mui.min.js', comPath + 'js/jQuery.md5.js', comPath + 'js/jquery.cookie.js', comPath + 'js/jsencrypt.min.js', comPath + 'js/swiper.min.js']);
    //加载项目公共文件
    //if (location.href.indexOf('/lib/') == -1) includeFile(['https://res.wx.qq.com/open/js/jweixin-1.1.0.js', _PATH_ + 'css/com.css', _PATH_ + 'js/config.js', _PATH_ + 'js/com.js']);
    if(location.href.indexOf('/lib/') == -1) includeFile(['http://res.wx.qq.com/open/js/jweixin-1.2.0.js']);
    //includeFile([_PATH_ +'css/public.css',_PATH_ + 'js/public.js','http://res.wx.qq.com/open/js/jweixin-1.1.0.js']);
    //css active可用
    window.onload = function () {
        document.body.addEventListener('touchstart', function () {
        });
    }

})(window, document);