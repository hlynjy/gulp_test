var isClickAll = false;
$(function () {
    //调详情页面接口
    $.ajax({
        url: "http://ms.shougongker.com/index.php?c=Mall&a=goodInfo&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Mall&a=goodInfo").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Mall&a=goodInfo").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
        type: "get",
        dataType: "json",
        async: true,
        data: {
            good_id: good_id,
            source: "h5"
        },
        success: function (result) {
            //修改页面上的title
            //$(document).attr("title",result.data.shareData.title);
            //图片轮播
            var swiperHtml = "";
            for(var i=0; i<result.data.host_pics.length;i++){
                swiperHtml += `<div class="swiper-slide"><img src="${result.data.host_pics[i]}" alt=""></div>`;
            }
            $(".swiper-wrapper").html(swiperHtml);
            var mySwiper = new Swiper ('.swiper-container', {
                direction: 'horizontal', // 水平切换选项
                loop: true, // 循环模式选项

                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                }
            });
            //价格显示
            $(".goodPrice span").text(result.data.price);
            $(".maskTopPrice span").text(result.data.price);
            //商品名字
            $(".goodDescribe").text(result.data.name);
            //快递
            $(".goodPostage span").text(result.data.express_fee);
            //销量
            $(".goodSales").text(result.data.sales_volume);
            //商品地区
            $(".goodAddress").text(result.data.region_name);
            //一进来sku左上角图片
            var skuImg = "";
            skuImg = `<div class="maskTopImgBox"><img src="${result.data.pic}" alt=""></div>`;
            $(".maskTopImgBoxBig").html(skuImg);
            //库存
            $(".maskTopStock span").text(result.data.stock);
            //sku分类
            var skuTitleArr = [];
            for(var i=0; i<result.data.skus.length; i++){
                for(var j=0; j<result.data.skus[i].sku_info.length; j++){
                    if(i==0){
                        skuTitleArr.push({
                            k_id:result.data.skus[i].sku_info[j].k_id,
                            k_name:result.data.skus[i].sku_info[j].k_name,
                            sku:[]
                        });
                    }
                    for(var k=0;k<skuTitleArr.length;k++){
                        if(result.data.skus[i].sku_info[j].k_id == skuTitleArr[k].k_id){
                            skuTitleArr[k].sku.push(result.data.skus[i].sku_info[j]);
                        }
                    }
                }
            }

            var skuHtml = '';
            for(var i=0;i<skuTitleArr.length;i++){
                skuTitleArr[i].sku = uniqueFun(skuTitleArr[i].sku,"v_id");
                skuHtml += '<div class="maskScrollType"><p class="maskScrollTitle">'+skuTitleArr[i].k_name+'</p>';
                for(var j=0;j<skuTitleArr[i].sku.length;j++){
                    skuHtml += '<a class="maskScrollDetailed" data-id="'+skuTitleArr[i].sku[j].v_id+'" href="javascript:;">'+skuTitleArr[i].sku[j].v_name+'</a>';
                }
                skuHtml += '</div>';
                $(".maskScrollTypeBig").html(skuHtml);
            }

            var lastData = {};
            $(document).on('click', '.maskScrollDetailed', function () {
                $(this).addClass("active").siblings().removeClass("active");
                if($(".maskScrollDetailed.active").length == skuTitleArr.length){
                    isClickAll = true;
                    var dataIdArr = [];
                    var textArr = "";
                    for(var k=0;k<$(".maskScrollDetailed.active").length;k++){
                        dataIdArr.push($(".maskScrollDetailed.active").eq(k).attr("data-id"));
                        textArr += $(".maskScrollDetailed.active").eq(k).text()+";";
                    }
                    var idArr = [];
                    for(var i=0; i<result.data.skus.length; i++){
                        var idArr2 = [];
                        for(var j=0; j<result.data.skus[i].sku_info.length; j++){
                            idArr2.push(result.data.skus[i].sku_info[j].v_id);
                        }
                        idArr.push(idArr2);
                    }
                    for(var i=0;i<idArr.length;i++){
                        if(idArr[i].toString() == dataIdArr.toString()){
                            lastData = result.data.skus[i];
                            break;
                        }
                    }
                    $(".maskTopImgBox").css({
                        "background":"url("+lastData.pic+")",
                        "background-size":"100% 100%",
                    });
                    $(".maskTopPrice span").text(lastData.price);
                    $(".maskTopStock span").text(lastData.stock);
                    $(".maskTopImgBox img").attr("src",lastData.pic);
                    $(".maskTopAttribute").text(textArr);
                    //切换sku，输入框随之改变
                    var maskScrollInp = Number($(".maskScrollInp").val());
                    var maskTopStock = Number($(".maskTopStock span").text());
                    if(maskScrollInp > maskTopStock){
                        $(".maskScrollInp").val(maskTopStock);
                    }
                }
            });
            //遮罩层点击关闭按钮
            $(".maskTopClose").click(function () {
                var maskTopAttributeVal = $(".maskTopAttribute").text();
                if(isClickAll && $(".maskScrollDetailed.active").length>0){
                    $(".goodChooseCenterBig").hide();
                    $(".goodChooseSure").show();
                    $(".goodChooseSure").text(maskTopAttributeVal);
                    maskClose();
                }else{
                    $(".goodChooseCenterBig").show();
                    $(".goodChooseSure").hide();
                    maskClose();
                }
            });
            //点击数量加号
            $(".maskScrollMore").click(function () {
                var maskScrollInp = Number($(".maskScrollInp").val());
                var maskTopStock = Number($(".maskTopStock span").text());
                if(maskScrollInp >= maskTopStock){
                    $(this).attr("disabled","true");
                }else{
                    maskScrollInp++;
                    $(".maskScrollInp").val(maskScrollInp);
                    $(this).attr("disabled","false");
                }
            });
            //数量输入框直接输入
            $(".maskScrollInp").on("input",function () {
                var maskScrollInp = Number($(".maskScrollInp").val());
                var maskTopStock = Number($(".maskTopStock span").text());
                if(maskScrollInp >= maskTopStock){
                    $(this).val(maskTopStock);
                }
            });
            //商品详情图片
            var goodInfoPic = "";
            for(var i=0; i<result.data.info_pics.length; i++){
                goodInfoPic += `<div class="goodDetailsImg"><img src="${result.data.info_pics[i].pic}" alt=""></div>`;
            }
            $(".goodDetailsImgBig").html(goodInfoPic);
            //商品详情页面的局部评价
            if(result.data.comments.list.length == 0){
                $(".goodEvaluateAll").hide();
                $(".goodEvaluateNone").show();
                $(".goodEvaluateEvery").hide();
            }else{
                //商品评价数量
                $(".goodEvaluateTitle span").text(result.data.comments.count);
                $(".goodEvaluateAll").show();
                $(".goodEvaluateNone").hide();
                $(".goodEvaluateEvery").show();
                //每一条评价
                var html = "";
                for(var i=0; i<result.data.comments.list.length; i++){
                    html += `<div class="goodEvaluateEvery">
                                <div class="evaluateEveryImgBox">
                                    <img src="${result.data.comments.list[i].avatar}" alt="">
                                </div>
                                <div class="goodEvaluateContent">
                                    <p class="goodEvaluateContentTitle">${result.data.comments.list[i].uname}</p>
                                    <p class="goodEvaluateContentDetailed">${result.data.comments.list[i].content}</p>
                                </div>
                             </div>`;
                }
                $(".goodEvaluateEveryBig").html(html);
                //点击查看全部评价
                $(".goodEvaluateTitleBox").click(function () {
                    window.location.href = "good_evaluate.html?good_id=" + good_id;
                });
            }
            //点击确定按钮
            $(".maskFootBox").click(function () {
                if($.cookie("token")){
                    if(isClickAll && $(".maskScrollDetailed.active").length>0){
                        var goodInfoObj = {
                            goodInfoImg: $(".maskTopImgBox img").attr("src"),
                            goodInfoName: $(".goodDescribe").text(),
                            goodInfoSku: $(".maskTopAttribute").text(),
                            goodInfoPrice: $(".maskTopPrice span").text(),
                            goodInfoCount: $(".maskScrollInp").val(),
                            goodInfoDelivery: $(".goodPostage span").text(),
                            shop_id: result.data.shop_id,
                            good_id: result.data.id,
                            sku_id: lastData.id
                        };
                        sessionStorage.setItem("goodInfoObj",JSON.stringify(goodInfoObj));
                        window.location.href = "submit_order.html";
                    }else{
                        mui.toast("请选择商品属性");
                    }
                }else{
                    window.location.href = "login.html";
                }
            });

            if(isWeixin()){
                //微信分享
                wx.config({
                    debug: false,
                    appId: result.data.shareConf.appId,
                    timestamp: result.data.shareConf.timestamp,
                    nonceStr: result.data.shareConf.nonceStr,
                    signature: result.data.shareConf.signature,
                    jsApiList: [ 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表
                });

                wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
                    wx.onMenuShareTimeline({
                        title: result.data.shareData.title, // 分享标题
                        link: result.data.shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: result.data.shareData.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                        }
                    })
                });

                wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                    wx.onMenuShareAppMessage({
                        title: result.data.shareData.title, // 分享标题
                        desc: result.data.shareData.desc, // 分享描述
                        link: result.data.shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: result.data.shareData.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                        }
                    })
                });
            }
        },
        error: function (data) {
            
        }
    });
    //详情页面点击选择属性
    $(".goodAttributeBox").click(function () {
        maskOpen();
    });
    //详情页面点击立即购买
    $("#goBuy").click(function () {
        //maskOpen();
        if($.cookie("token")){
            maskOpen();
        }else{
            window.location.href = "login.html";
        }
    });

    //点击减号
    $(".maskScrollReduce").click(function () {
        var maskScrollInp = Number($(".maskScrollInp").val());
        if(maskScrollInp == 1){
            $(this).attr("disabled","true");
        }else if(maskScrollInp > 1){
            maskScrollInp--;
            $(".maskScrollInp").val(maskScrollInp);
            $(this).attr("disabled","false");
        }
    });
});

//遮罩层显示，页面禁止滑动
var scroll = 0;
function maskOpen() {
    $(".maskBox").show();
    scroll= $("html").scrollTop();
    $("window").css({"overflow":"hidden","position":"fixed","top":"-"+scroll+"px"});
}
//遮罩层隐藏，页面恢复滑动
function maskClose() {
    $(".maskBox").hide();
    $("html").css({"overflow":"auto","position":"static"});
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

//数组中对象去重
function uniqueFun(arr, type) {
    const res = new Map();
    return arr.filter((a) => !res.has(a[type]) && res.set(a[type], 1));
}

//判断是否在微信中打开
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}