$(function () {
    var tokenNew = $.cookie("token");
    var isPageHide =false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {window.location.reload(); }
    });
    window.addEventListener('pagehide', function () {
        isPageHide =true;
    });
    //获取session信息
    if(sessionStorage.getItem("sessionEditObj") && sessionStorage.getItem("sessionAeraObj")){
        var newSessionEditObj = JSON.parse(sessionStorage.getItem("sessionEditObj"));
        $("#editConsignee").val(newSessionEditObj.consignee);
        $("#editPhone").val(newSessionEditObj.phone);
        $("#editAddress").val(newSessionEditObj.address);
        $(".editAddDefaultIcon").addClass(newSessionEditObj.is_default == 1 ? "active" : "");
        $(".editAddArea").text(sessionStorage.getItem("sessionAeraObj"));
        $(".editAddAreaBox").hide();
        $(".editAddArea").show();
        sessionStorage.removeItem("sessionEditObj");
        sessionStorage.removeItem("sessionAeraObj");
    }
    //点击所在地区跳转到地区
    $("#editAddArea").click(function () {
        var sessionEditObj = {
            consignee: $("#editConsignee").val(),
            phone: $("#editPhone").val(),
            address: $("#editAddress").val(),
            is_default: $(".editAddDefaultIcon").hasClass("active") ? 1 : 0
        };
        sessionStorage.setItem("sessionEditObj",JSON.stringify(sessionEditObj));
        window.location.href = "address_area.html";
    });
    //设为默认地址
    $(".editAddDefaultIcon").click(function () {
        if(!$(this).hasClass("active")){
            $(this).addClass("active");
        }else{
            $(this).removeClass("active");
        }
    });

    //通过编辑进来的页面显示
    var addressId = sessionStorage.getItem("addressId");
    if(addressId != "" && addressId != null && addressId != undefined){
        //查询单条数据
        $.ajax({
            url: "http://ms.shougongker.com/index.php?c=Order&a=userAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
            type: "post",
            dataType: "json",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", tokenNew);
            },
            async: true,
            data: {
                type: "single",
                source: "h5",
                address_id: addressId,
            },
            success: function (result) {
                $(".editAddAreaBox").hide();
                $(".editAddArea").show();
                $("#editConsignee").val(result.data.consignee);
                $("#editPhone").val(result.data.phone);
                $("#editPhone").val(result.data.phone);
                $(".editAddArea").text(result.data.region);
                $("#editAddress").val(result.data.address);
            },
            error: function (data) {

            }
        });
        //通过编辑页面进来，点击头部保存按钮
        $("#editAddPreservation").click(function () {
            var regionId = sessionStorage.getItem("regionId");
            $.ajax({
                url: "http://ms.shougongker.com/index.php?c=order&a=updateAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", tokenNew);
                },
                async: true,
                data: {
                    type: "update",
                    source: "h5",
                    consignee: $("#editConsignee").val(),
                    phone: $("#editPhone").val(),
                    region: $(".editAddArea").text(),
                    address: $("#editAddress").val(),
                    is_default: $(".editAddDefaultIcon").hasClass("active") ? 1 : 0,
                    address_id: addressId,
                    region_id: regionId
                },
                success: function (result) {
                    mui.toast(result.info);
                    sessionStorage.removeItem("addressId");
                    window.history.back();
                },
                error: function (data) {

                }
            });
        });
        //通过编辑页面进来，点击内容区保存按钮
        $(".editPreBtn").click(function () {
            var regionId = sessionStorage.getItem("regionId");
            $.ajax({
                url: "http://ms.shougongker.com/index.php?c=order&a=updateAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", tokenNew);
                },
                async: true,
                data: {
                    type: "update",
                    source: "h5",
                    consignee: $("#editConsignee").val(),
                    phone: $("#editPhone").val(),
                    region: $(".editAddArea").text(),
                    address: $("#editAddress").val(),
                    is_default: $(".editAddDefaultIcon").hasClass("active") ? 1 : 0,
                    address_id: addressId,
                    region_id: regionId
                },
                success: function (result) {
                    mui.toast(result.info);
                    sessionStorage.removeItem("addressId");
                    window.history.back();
                },
                error: function (data) {

                }
            });
        });
    }else{
        //新建地址，点击头部保存按钮
        $("#editAddPreservation").click(function () {
            var regionId = sessionStorage.getItem("regionId");
            $.ajax({
                url: "http://ms.shougongker.com/index.php?c=Order&a=addUserAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=addUserAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=addUserAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", tokenNew);
                },
                async: true,
                data: {
                    consignee: $("#editConsignee").val(),
                    source: "h5",
                    phone: $("#editPhone").val(),
                    region: $(".editAddArea").text(),
                    address: $("#editAddress").val(),
                    is_default: $(".editAddDefaultIcon").hasClass("active") ? 1 : 0,
                    region_id: regionId
                },
                success: function (result) {
                    if(result.info == "添加成功"){
                        mui.toast(result.info);
                        window.history.back();
                    }else{
                        mui.toast(result.info);
                    }
                },
                error: function (data) {

                }
            });
        });
        //新建地址，点击内容区保存按钮
        $(".editPreBtn").click(function () {
            var regionId = sessionStorage.getItem("regionId");
            $.ajax({
                url: "http://ms.shougongker.com/index.php?c=Order&a=addUserAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=addUserAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=addUserAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", tokenNew);
                },
                async: true,
                data: {
                    consignee: $("#editConsignee").val(),
                    source: "h5",
                    phone: $("#editPhone").val(),
                    region: $(".editAddArea").text(),
                    address: $("#editAddress").val(),
                    is_default: $(".editAddDefaultIcon").hasClass("active") ? 1 : 0,
                    region_id: regionId
                },
                success: function (result) {
                    if(result.info == "添加成功"){
                        mui.toast(result.info);
                        window.history.back();
                    }else{
                        mui.toast(result.info);
                    }
                },
                error: function (data) {

                }
            });
        });
    }
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