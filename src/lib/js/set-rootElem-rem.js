// 设置根元素font-size
(function () {
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var infinite = function() {
        var htmlElem = document.getElementsByTagName("html")[0];

        // 获取页面宽度
        var htmlWidth = htmlElem.clientWidth;

        // 判断当前设备是否是移动端设备
        if (htmlWidth <= 768) {
            // 计算font-size大小
            var fontSize = (14.06 / 375 * htmlWidth).toFixed(2);

            // 设置html的font-size属性
            htmlElem.style.fontSize = fontSize + "px";
        }
    };infinite();
    window.addEventListener(resizeEvt, infinite, false);
    document.addEventListener('DOMContentLoaded', infinite, false);
    // resize事件,监控浏览器页面的宽度是否发生改变
    window.onresize = function () {
        infinite();
    };
}());


//Android微信中，借助WeixinJSBridge对象来阻止字体大小调整
(function() {
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        handleFontSize();
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
        } else if (document.attachEvent) {
            //IE浏览器，非W3C规范
            document.attachEvent("onWeixinJSBridgeReady", handleFontSize);
        }
    }

    function handleFontSize() {
        // 设置网页字体为默认大小
        WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
        // 重写设置网页字体大小的事件
        WeixinJSBridge.on('menu:setfont', function () {
            WeixinJSBridge.invoke('setFontSizeCallback', {'fontSize': 0});
        });
    }
})();


