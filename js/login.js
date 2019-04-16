$(function() {
    //切换登录方式
    $(".loginTopBox>div").click(function () {
        var i = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".loginAllBox>div").eq(i).show().siblings().hide();
        loginMethod();
    });
    //判断当前是哪种登录方式
    function loginMethod() {
        if($(".loginFirstBox").hasClass("active")){
            $("#secondTel").val("");
            $(".loginPasswordInp").val("");
            $(".loginBtn").removeClass("active");
            $(".loginBtn").attr("disabled","disabled");
            //手机快捷登录，手机号正确，可以点击发送验证码
            $("#firstTel").off().on("input",function(){
                var firstTelVal = $("#firstTel").val();
                var myreg=/^1\d{10}$/;
                if(firstTelVal && myreg.test(firstTelVal)){
                    $("#codeBtn").addClass("active");
                    $("#codeBtn").removeAttr("disabled");
                    $(".loginCodeInp").off().on("input",function () {
                        var loginCodeInp = $(".loginCodeInp").val();
                        var mycodereg=/^\d{6}$/;
                        if(loginCodeInp && mycodereg.test(loginCodeInp)){
                            $(".loginBtn").addClass("active");
                            $(".loginBtn").removeAttr("disabled");
                        }else{
                            $(".loginBtn").removeClass("active");
                            $(".loginBtn").attr("disabled","disabled");
                        }
                    });
                    //点击获取验证码
                    var validCode=true;
                    $("#codeBtn").click(function () {
                        var phoneBase = encrypt.encrypt(firstTelVal);
                        var time=60;
                        var $code=$(this);
                        if (validCode) {
                            validCode=false;
                            $.ajax({
                                url: "https://ms.shougongker.com/index.php?c=Loginnew&a=getCode&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=getCode").c+"&a="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=getCode").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                                type: "post",
                                dataType: "json",
                                async: true,
                                data: {
                                    phone: phoneBase,
                                    source: "h5"
                                },
                                success: function (result) {
                                    mui.toast(result.info);
                                },
                                error: function (data) {

                                }
                            });
                            var t=setInterval(function  () {
                                $code.attr("disabled","disabled");
                                time--;
                                $code.html(time+"s后重发");
                                if (time==0) {
                                    $code.removeAttr("disabled");
                                    clearInterval(t);
                                    $code.html("发送验证码");
                                    validCode=true;
                                }
                            },1000);
                        }
                    });
                }else{
                    $("#codeBtn").removeClass("active");
                    $("#codeBtn").attr("disabled","disabled");
                    $(".loginBtn").removeClass("active");
                    $(".loginBtn").attr("disabled","disabled");
                }
            })
        }else if($(".loginSecondBox").hasClass("active")){
            $("#firstTel").val("");
            $(".loginCodeInp").val("");
            $(".loginBtn").removeClass("active");
            $(".loginBtn").attr("disabled","disabled");
            //账号密码登录
            $("#secondTel").off().on("input",function () {
                var secondTelVal = $("#secondTel").val();
                var myreg=/^1\d{10}$/;
                if(secondTelVal && myreg.test(secondTelVal)){
                    $(".loginPasswordInp").off().on("input",function () {
                        var loginPasswordInp = $(".loginPasswordInp").val();
                        if(loginPasswordInp){
                            $(".loginBtn").addClass("active");
                            $(".loginBtn").removeAttr("disabled");
                        }else {
                            $(".loginBtn").removeClass("active");
                            $(".loginBtn").attr("disabled","disabled");
                        }
                    });
                }else {
                    $(".loginBtn").removeClass("active");
                    $(".loginBtn").attr("disabled","disabled");
                }
            });
        }
    }
    loginMethod();

    //点击显示密码按钮
    $(".login_nosee").click(function () {
        $(".loginPasswordInp").attr("type","text");
        $(".login_cansee").show();
        $(this).hide();
    });
    $(".login_cansee").click(function () {
        $(".loginPasswordInp").attr("type","password");
        $(".login_nosee").show();
        $(this).hide();
    });

    //点击登录按钮
    $(".loginBtn").click(function () {
        //获取openid
        var openid = $.cookie("openid");
        if($(".loginFirstBox").hasClass("active")){
            //手机快捷登录
            var firstTel = encrypt.encrypt($("#firstTel").val());
            var loginCodeInp = $(".loginCodeInp").val();
            var requestData = {
                phone: firstTel,
                code: loginCodeInp,
                channel: "h5",
                source: "h5"
            };
            if(openid != "" && openid != null && openid != undefined){
                requestData.openid = openid;
            }
            if (isWeixin()) {
                requestData.channel = "weixin";
                requestData.openid = openid;
            }
            $.ajax({
                url: "https://ms.shougongker.com/index.php?c=Loginnew&a=codeLogin&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=codeLogin").c+"&a="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=codeLogin").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                async: true,
                data: requestData,
                success: function (result) {
                    mui.toast(result.info);
                    $.cookie("token", result.data.token);
                    if(result.info == "登录成功"){
                        if(isWeixin()){
                            window.history.go(-2);
                        }else{
                            window.history.back();
                        }
                    }
                },
                error: function (data) {

                }
            });
        }else if($(".loginSecondBox").hasClass("active")){
            var secondTel = encrypt.encrypt($("#secondTel").val());
            var loginPasswordInp = encrypt.encrypt($(".loginPasswordInp").val());
            var hasOpenIdData = {
                phone: secondTel,
                password: loginPasswordInp,
                source: "h5",
                loginType: "phone"
            };
            if(openid != "" && openid != null && openid != undefined){
                hasOpenIdData.openid = openid;
            }
            $.ajax({
                url: 'https://ms.shougongker.com/index.php?c=Loginnew&a=login&accessId=H1707137&time_stamp='+timest()+'&signature='+$.md5("accessId=H1707137&c="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=login").c+"&a="+getUrlParamsObj("https://ms.shougongker.com/index.php?c=Loginnew&a=login").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: 'post',
                data: hasOpenIdData,
                dataType: 'json',
                success: function (result) {
                    mui.toast(result.info);
                    $.cookie("token", result.data.token);
                    if(result.info == "登录成功"){
                        if(isWeixin()){
                            window.history.go(-2);
                        }else{
                            window.history.back();
                        }
                    }
                },
                error: function (data) {

                }
            });
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

//判断是否在微信中打开
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}