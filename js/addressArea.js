$(function () {
    //获取地区
    $.ajax({
        url: "http://ms.shougongker.com/index.php?c=Index&a=region&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Index&a=region").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Index&a=region").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
        type: "post",
        dataType: "json",
        async: true,
        data: {
            source: "h5"
        },
        success: function (result) {
            var secondArr = [];//暂时存的选择的一级下的二级列表

            var firstId = "";
            var firstName = "";
            var secondId = "";
            var secondName = "";
            var thirdId = "";
            var thirdName = "";

            var box1html = '';
            for(var i=0;i<result.data.length;i++){
                box1html += '<div class="areaCountryEvery-in" data-id="'+result.data[i].region_id+'"><p class="areaCountry">'+result.data[i].region_name+'</p> <p class="areaCountryGo"><img src="../images/details_go.png" alt=""></p></div>';
            }
            $(".areaCountryBox").show().find(".areaCountryEvery").html(box1html);

            $(".areaCountryEvery>div").click(function () {
                firstId = $(this).attr("data-id");
                firstName = $(this).find(".areaCountry").text();
                var box2html = '';
                for(var i=0;i<result.data.length;i++){
                    if($(this).attr("data-id") == result.data[i].region_id){
                        secondArr = result.data[i].child;
                        for(var k=0;k<result.data[i].child.length;k++){
                            box2html += '<div class="areaCityEvery-in" data-id="'+result.data[i].child[k].region_id+'"><p class="areaCity">'+result.data[i].child[k].region_name+'</p> <p class="areaCityGo"><img src="../images/details_go.png" alt=""></p></div>';
                        }
                        break;
                    }
                }
                $(".areaCountryBox").hide();
                $(".areaCityBox").show().find(".areaCityEvery").html(box2html);
                $(".areaCityEvery>div").click(function(){
                    secondId = $(this).attr("data-id");
                    sessionStorage.setItem("regionId",secondId);
                    secondName = $(this).find(".areaCity").text();
                    var box3html = '';
                    for(var i=0;i<secondArr.length;i++){
                        if($(this).attr("data-id") == secondArr[i].region_id){
                            for(var k=0;k<secondArr[i].child.length;k++){
                                box3html += '<div class="areaEvery-in" data-id="'+secondArr[i].child[k].region_id+'"> <p class="area">'+secondArr[i].child[k].region_name+'</p> </div>';
                            }
                            break;
                        }
                    }
                    $(".areaCityBox").hide();
                    $(".areaBox").show().find(".areaEvery").html(box3html);
                    $(".areaEvery>div").click(function () {
                        thirdId = $(this).attr("data-id");
                        thirdName = $(this).text();
                        //信息存session
                        sessionStorage.setItem("sessionAeraObj",secondName+thirdName);
                        window.history.back();
                    })
                })
            });




        },
        error: function (data) {

        }
    });
});

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

//从1970年开始的毫秒数然后截取10位变成 从1970年开始的秒数
function timest() {
    var tmp = Date.parse( new Date() ).toString();
    tmp = tmp.substr(0,10);
    return tmp;
}