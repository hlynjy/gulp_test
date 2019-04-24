$(function () {
    myAjax();
    //上拉加载
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
        var scrollHeight = $(document).height();   //当前页面的总高度
        var clientHeight = $(this).height();    //当前可视的页面高度
        if(scrollTop + clientHeight >= scrollHeight - 50){   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 注：-50 上拉加载更灵敏
            myAjax();
        }
    });
});

var last_id = ""; //最后一个商品的id
//封装ajax
function myAjax() {
    $.ajax({
        url: "http://ms.shougongker.com/index.php?c=Mallcomments&a=list&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Mallcomments&a=list").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Mallcomments&a=list").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
        type: "post",
        dataType: "json",
        async: true,
        data: {
            good_id: good_id,
            source: "h5",
            last_id: last_id
        },
        success: function (result) {
            if(result.data.list.length > 0){
                last_id = result.data.list[result.data.list.length - 1].id;
                var htmlAll = "";
                for(var i=0; i<result.data.list.length; i++){
                    htmlAll += `<div class="evaluateEveryBox-in">
                                <div class="evaluateEveryTop">
                                    <div class="evaluateEveryImgBox">
                                        <img src="${result.data.list[i].avatar}" alt="">
                                    </div>
                                    <p class="evaluateEveryName">${result.data.list[i].uname}</p>
                                    <p class="evaluateEveryDate">${result.data.list[i].add_time}</p>
                                </div>
                                <p class="evaluateEvery">${result.data.list[i].content}</p>
                                <p class="evaluateEveryKind">${result.data.list[i].sku_name}</p>
                            </div>`;
                }
                $(".evaluateEveryBox").html(htmlAll);
            }
        }
    });
}

/**
 * 将url中参数（或公共参数）转换为json对象
 * @param href 当前页面url
 * @returns all url上所有参数
 */
function getUrlParamsObj(href) {
    if (href.indexOf("?") == -1) {
        return {};
    }
    href = decodeURIComponent(href);
    var queryString = href.substring(href.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var all = {};
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue;
        }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        all[paraName] = paraValue;
    }
    return all;
}
var good_id = getUrlParamsObj(window.location.href).good_id;

//从1970年开始的毫秒数然后截取10位变成 从1970年开始的秒数
function timest() {
    var tmp = Date.parse( new Date() ).toString();
    tmp = tmp.substr(0,10);
    return tmp;
}