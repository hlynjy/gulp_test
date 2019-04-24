setTimeout(function () {
    var isPageHide =false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {window.location.reload(); }
    });
    window.addEventListener('pagehide', function () {
        isPageHide =true;
    });
},100);
$(function () {
    var tokenNew = $.cookie("token");
    //调地址管理接口
    $.ajax({
        url: "http://ms.shougongker.com/index.php?c=Order&a=userAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
        type: "post",
        dataType: "json",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", tokenNew);
        },
        async: true,
        data: {
            type: "all",
            source: "h5"
        },
        success: function (result) {
            if(result.data.length == 0){
                $(".adminAddNone").show();
                $(".adminAddEveryBig").hide();
            }else{
                $(".adminAddNone").hide();
                $(".adminAddEveryBig").show();
                var htmlAll = "";
                for(var i=0; i<result.data.length; i++){
                    htmlAll += `<div class="adminAddEvery" data-id="${result.data[i].address_id}">
                                    <div class="adminAddEvery-in">
                                        <div class="adminAddNameBox">
                                            <div class="adminAddDefaultIcon ${result.data[i].is_default==1?'active':''}"></div>
                                            <p class="adminAddBuyer">买家姓名：<span>${result.data[i].consignee}</span></span></p>
                                            <div class="adminAddEditBox">
                                                <p class="adminAddEdit"  data-id="${result.data[i].address_id}">
                                                    <img src="../images/admin_edit.png" alt="">
                                                </p>
                                                <p class="adminAddRemove" data-id="${result.data[i].address_id}">
                                                    <img src="../images/admin_delete.png" alt="">
                                                </p>
                                            </div>
                                        </div>
                                        <p class="adminAddTel">手机号码：<span>${result.data[i].phone}</span></span></p>
                                        <p class="adminAddress" data-region="${result.data[i].region}" data-address="${result.data[i].address}">收货地址：<span>${result.data[i].region}${result.data[i].address}</span></span></p>
                                    </div>
                                </div>`;
                }
                $(".adminAddEveryBig").html(htmlAll);
                //点击每一条地址跳转
                $(".adminAddEvery").click(function () {
                    sessionStorage.setItem("currentAddress",$(this).attr("data-id"));
                    window.history.back();
                });
                //点击删除地址
                $(".adminAddRemove").click(function (e) {
                    var _this = $(this);
                    e.stopPropagation();
                    $(".adminMaskBox").show();
                    $(".adminSureBtn").click(function () {
                        $.ajax({
                            url: "http://ms.shougongker.com/index.php?c=order&a=updateAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                            type: "post",
                            dataType: "json",
                            async: true,
                            beforeSend: function(request) {
                                request.setRequestHeader("Authorization", tokenNew);
                            },
                            data: {
                                type: "delete",
                                source: "h5",
                                address_id: _this.attr("data-id")
                            },
                            success: function (result) {
                                mui.toast(result.info);
                                window.location.reload();
                            },
                            error: function (data) {

                            }
                        });
                    });
                    //点击删除地址的取消按钮
                    $(".adminCancelBtn").click(function () {
                        $(".adminMaskBox").hide();
                    });
                });

                //点击编辑地址
                $(".adminAddEdit").click(function (e) {
                    var adminAddEvery = $(this).parents(".adminAddEvery");
                    e.stopPropagation();
                    sessionStorage.setItem("addressId",$(this).attr("data-id"));
                    $.ajax({
                        url: "http://ms.shougongker.com/index.php?c=order&a=updateAddress&accessId=H1707137&time_stamp="+timest()+"&signature="+$.md5("accessId=H1707137&c="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").c+"&a="+getUrlParamsObj("http://ms.shougongker.com/index.php?c=order&a=updateAddress").a+"&time_stamp="+timest()+"&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                        type: "post",
                        dataType: "json",
                        async: true,
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", tokenNew);
                        },
                        data: {
                            type: "update",
                            source: "h5",
                            address_id: $(this).attr("data-id"),
                            consignee: adminAddEvery.find(".adminAddBuyer span").text(),
                            phone: adminAddEvery.find(".adminAddTel span").text(),
                            region: adminAddEvery.find(".adminAddress").attr("data-region"),
                            address: adminAddEvery.find(".adminAddress").attr("data-address"),
                        },
                        success: function (result) {
                            window.location.href = "edit_address.html";
                        },
                        error: function (data) {

                        }
                    });
                });
            }
        },
        error: function (data) {

        }
    });
    //点击“+”号跳转到编辑地址
    $("#adminAddIcon").click(function (e) {
        e.stopPropagation();
        window.location.href = "edit_address.html";
    });
    //点击新建地址跳转到编辑地址
    $(".adminAddBtn").click(function (e) {
        e.stopPropagation();
        window.location.href = "edit_address.html";
    });
    //点击图片跳转到编辑地址
    $(".adminAddNone").click(function () {
        window.location.href = "edit_address.html";
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