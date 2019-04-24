$(function () {
    var newAddressId;
    var isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            window.location.reload()
        }
    });
    window.addEventListener('pagehide', function () {
        isPageHide = true
    });
    var tokenNew = $.cookie("token");
    var currentAddress = sessionStorage.getItem("currentAddress");
    var goodInfoObj = JSON.parse(sessionStorage.getItem("goodInfoObj"));
    $(".orderGoodImgBox img").attr("src", goodInfoObj.goodInfoImg);
    $(".orderGoodTitle").text(goodInfoObj.goodInfoName);
    $(".orderGoodKind").text(goodInfoObj.goodInfoSku);
    $(".orderGoodPrice span").text(goodInfoObj.goodInfoPrice);
    $(".orderGoodMount span").text(goodInfoObj.goodInfoCount);
    $(".orderGoodMoney").text((parseFloat(goodInfoObj.goodInfoPrice) * parseFloat(goodInfoObj.goodInfoCount)).toFixed(2));
    $(".orderGoodDelVal").text(goodInfoObj.goodInfoDelivery);
    $(".orderGoodCount span").text(goodInfoObj.goodInfoCount);
    var shop_id = goodInfoObj.shop_id;
    var good_id = goodInfoObj.good_id;
    var sku_id = goodInfoObj.sku_id;
    if (currentAddress != "" && currentAddress != null && currentAddress != undefined) {
        $(".orderAddNoneBox").hide();
        $(".orderAddContentBoxBig").show();
        $.ajax({
            url: "http://ms.shougongker.com/index.php?c=Order&a=userAddress&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").c + "&a=" + getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
            type: "post",
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", tokenNew)
            },
            async: true,
            data: {
                type: "single",
                source: "h5",
                address_id: currentAddress
            },
            success: function (result) {
                var htmlAll = "";
                htmlAll = ` < div class = "orderAddContentBox" > < div class = "orderAddIcon" > < img src = "../images/submit_addIcon.png"
                alt = "" > < /div><div class="orderAddContent"><div class="orderAddTop"><p class="orderAddConsignee">收货人：<span>${result.data.consignee}</span > < /span></p > < p class = "orderAddTel" > $ {
                    result.data.phone
                } < /p></div > < p class = "orderAddDetailed" > $ {
                    result.data.region
                }
                $ {
                    result.data.address
                } < /p></div > < p class = "orderAddGo" > < img src = "../images/details_go.png"
                alt = "" > < /p></div > `;
                $(".orderAddContentBoxBig").html(htmlAll)
            },
            error: function (data) {}
        })
    } else {
        $.ajax({
            url: "http://ms.shougongker.com/index.php?c=Order&a=userAddress&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").c + "&a=" + getUrlParamsObj("http://ms.shougongker.com/index.php?c=Order&a=userAddress").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
            type: "post",
            dataType: "json",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", tokenNew)
            },
            async: true,
            data: {
                type: "all",
                source: "h5"
            },
            success: function (result) {
                if (result && result.data && result.data.length > 0) {
                    for (var i = 0; i < result.data.length; i++) {
                        if (result.data[i].is_default == 1) {
                            $(".orderAddNoneBox").hide();
                            $(".orderAddContentBoxBig").show();
                            var htmlAll = ` < div class = "orderAddContentBox"
                            data - id = "${result.data[i].address_id}" > < div class = "orderAddIcon" > < img src = "../images/submit_addIcon.png"
                            alt = "" > < /div><div class="orderAddContent"><div class="orderAddTop"><p class="orderAddConsignee">收货人：<span>${result.data[i].consignee}</span > < /span></p > < p class = "orderAddTel" > $ {
                                result.data[i].phone
                            } < /p></div > < p class = "orderAddDetailed" > $ {
                                result.data[i].region
                            }
                            $ {
                                result.data[i].address
                            } < /p></div > < p class = "orderAddGo" > < img src = "../images/details_go.png"
                            alt = "" > < /p></div > `;
                            $(".orderAddContentBoxBig").html(htmlAll);
                            newAddressId = $(".orderAddContentBox").attr("data-id");
                            return false
                        } else if (result.data[i].is_default == 0) {
                            $(".orderAddNoneBox").show();
                            $(".orderAddContentBoxBig").hide()
                        }
                    }
                } else {
                    $(".orderAddNoneBox").show();
                    $(".orderAddContentBoxBig").hide()
                }
            },
            error: function (data) {}
        })
    }
    if (isWeixin()) {
        $(".orderzhifubaoBox").hide()
    }
    $(".orderAddressBox").click(function () {
        window.location.href = "address_admin.html"
    });
    $(".zhifubaoChooseSure").click(function () {
        $(this).addClass("active");
        $(".weixinChooseSure").removeClass("active")
    });
    $(".weixinChooseSure").click(function () {
        $(this).addClass("active");
        $(".zhifubaoChooseSure").removeClass("active")
    });
    $(".orderFootPay").click(function () {
        if (currentAddress != "" && currentAddress != null && currentAddress != undefined) {
            var order_data = [{
                shop_id: shop_id,
                user_remarks: $(".orderGoodMesVal").val(),
                goods: [{
                    good_id: good_id,
                    quantity: goodInfoObj.goodInfoCount,
                    sku_id: sku_id
                }],
            }];
            var newOrderData = JSON.stringify(order_data);
            var payData = {
                buy_way: "1",
                pay_type: $(".weixinChooseSure").hasClass("active") ? "weixin" : "zhifubao ",
                source: "h5",
                address_id: currentAddress,
                order_data: newOrderData
            };
            if (isWeixin()) {
                payData.source = "weixin"
            }
            $.ajax({
                url: "https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder").c + "&a=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", tokenNew)
                },
                async: true,
                data: payData,
                success: function (result) {
                    var newAlipay = decodeURIComponent(result.data.Alipay);
                    if (result.data.pay_type == "weixin") {
                        var weixinData = {
                            oid: result.data.order_id,
                            source: "h5",
                            platform: "shop_mweb"
                        };
                        if (isWeixin()) {
                            weixinData.platform = "shop_jsapi"
                        }
                        $.ajax({
                            url: "https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder").c + "&a=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                            type: "post",
                            dataType: "json",
                            beforeSend: function (request) {
                                request.setRequestHeader("Authorization", tokenNew)
                            },
                            async: true,
                            data: weixinData,
                            success: function (result) {
                                if (!isWeixin()) {
                                    window.location.href = result.data.mweb_url + "&redirect_url=" + encodeURIComponent(window.location.href = "h5.shougongker.com/pay_success.html");
                                    return false
                                }
                                function onBridgeReady() {
                                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                        "appId": result.data.wxappid,
                                        "timeStamp": result.data.timestamp,
                                        "nonceStr": result.data.noncestr,
                                        "package": result.data.package,
                                        "signType": "MD5",
                                        "paySign": result.data.sign
                                    }, function (res) {
                                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                                            window.location.href = "h5.shougongker.com/pay_success.html"
                                        }
                                    })
                                }
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                                    }
                                } else {
                                    onBridgeReady()
                                }
                            },
                            error: function (data) {}
                        })
                    } else if (result.data.pay_type == "zhifubao ") {
                        $('body').append(newAlipay);
                        $("form").attr("target", "_0")
                    }
                },
                error: function (data) {}
            })
        } else if ((currentAddress == "" || currentAddress == null || currentAddress == undefined) && (newAddressId != "" || newAddressId != null || newAddressId != undefined)) {
            console.log(newAddressId);
            var order_data = [{
                shop_id: shop_id,
                user_remarks: $(".orderGoodMesVal").val(),
                goods: [{
                    good_id: good_id,
                    quantity: goodInfoObj.goodInfoCount,
                    sku_id: sku_id
                }],
            }];
            var newOrderDataDefault = JSON.stringify(order_data);
            var payDataDefault = {
                buy_way: "1",
                pay_type: $(".weixinChooseSure").hasClass("active") ? "weixin" : "zhifubao ",
                source: "h5",
                address_id: newAddressId,
                order_data: newOrderDataDefault
            };
            if (isWeixin()) {
                payDataDefault.source = "weixin"
            }
            $.ajax({
                url: "https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder").c + "&a=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Mallorder&a=createOrder").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                type: "post",
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", tokenNew)
                },
                async: true,
                data: payDataDefault,
                success: function (result) {
                    var newAlipay = decodeURIComponent(result.data.Alipay);
                    if (result.data.pay_type == "weixin") {
                        var weixinData = {
                            oid: result.data.order_id,
                            source: "h5",
                            platform: "shop_mweb"
                        };
                        if (isWeixin()) {
                            weixinData.platform = "shop_jsapi"
                        }
                        $.ajax({
                            url: "https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder&accessId=H1707137&time_stamp=" + timest() + "&signature=" + $.md5("accessId=H1707137&c=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder").c + "&a=" + getUrlParamsObj("https://ms.shougongker.com/index.php?c=Cashier&a=mallOrder").a + "&time_stamp=" + timest() + "&secret=3b0ee641beeb0c249a7a8f52682d0544"),
                            type: "post",
                            dataType: "json",
                            beforeSend: function (request) {
                                request.setRequestHeader("Authorization", tokenNew)
                            },
                            async: true,
                            data: weixinData,
                            success: function (result) {
                                if (!isWeixin()) {
                                    window.location.href = result.data.mweb_url + "&redirect_url=" + encodeURIComponent(window.location.href = "h5.shougongker.com/pay_success.html");
                                    return false
                                }
                                function onBridgeReady() {
                                    WeixinJSBridge.invoke('getBrandWCPayRequest', {
                                        "appId": result.data.wxappid,
                                        "timeStamp": result.data.timestamp,
                                        "nonceStr": result.data.noncestr,
                                        "package": result.data.package,
                                        "signType": "MD5",
                                        "paySign": result.data.sign
                                    }, function (res) {
                                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                                            window.location.href = "h5.shougongker.com/pay_success.html"
                                        }
                                    })
                                }
                                if (typeof WeixinJSBridge == "undefined") {
                                    if (document.addEventListener) {
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
                                    } else if (document.attachEvent) {
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
                                    }
                                } else {
                                    onBridgeReady()
                                }
                            },
                            error: function (data) {}
                        })
                    } else if (result.data.pay_type == "zhifubao ") {
                        $('body').append(newAlipay);
                        $("form").attr("target", "_0")
                    }
                },
                error: function (data) {}
            })
        } else {
            mui.toast("请填写地址")
        }
    })
});

function getUrlParamsObj(href) {
    if (href.indexOf("?") == -1) {
        return {}
    }
    href = decodeURIComponent(href);
    var queryString = href.substring(href.indexOf("?") + 1);
    var parameters = queryString.split("&");
    var all = {};
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) {
            continue
        }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        all[paraName] = paraValue
    }
    return all
}
function timest() {
    var tmp = Date.parse(new Date()).toString();
    tmp = tmp.substr(0, 10);
    return tmp
}
function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
}
var currentUrl = window.location.href;