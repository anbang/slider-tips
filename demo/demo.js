define(function(require,exports,module){
    "require:nomunge,exports:nomunge,module:nomunge";
    var slieTips=require("./../src/slide-tips");

    /*parent配置方式*/
    slieTips.follow({
        parent      : '#parent_bottom_left'
    });
    slieTips.follow({
        parent      : '#parent_bottom_center',
        alignment   : 'center'
    });
    slieTips.follow({
        parent      : '#parent_bottom_right',
        alignment   : 'right'
    });

    var $selectDemo=slieTips.follow({
        parent      : '#parent_top_left',
        direction   : 'top',
        alignment   : 'left'
    });
    $("#select-click-demo").click(function () {
        $selectDemo.$panelArea.hide();
    });

    slieTips.follow({
        parent      : '#parent_top_center',
        direction   : 'top',
        alignment   : 'center'
    });
    slieTips.follow({
        parent      : '#parent_top_right',
        direction   : 'top',
        alignment   : 'right'
    });

    slieTips.follow({
        parent      : '#parent_right_top',
        direction   : 'right',
        alignment   : 'top'
    });
    slieTips.follow({
        parent      : '#parent_right_center',
        direction   : 'right',
        alignment   : 'center'
    });
    slieTips.follow({
        parent      : '#parent_right_bottom',
        direction   : 'right',
        alignment   : 'bottom'
    });

    slieTips.follow({
        parent      : '#parent_left_top',
        direction   : 'left',
        alignment   : 'top'
    });
    slieTips.follow({
        parent      : '#parent_left_center',
        direction   : 'left',
        alignment   : 'center'
    });
    slieTips.follow({
        parent      : '#parent_left_bottom',
        direction   : 'left',
        alignment   : 'bottom'
    });



    /*
    * 下面是 trigger 和  panel 配置方式
    * */
    // 顶部的配置
    slieTips.follow({
        trigger     : '#top-left',
        panel       : '#top-left-panel',
        alignment   : "left"
    });
    slieTips.follow({
        trigger     : '#top-center',
        panel       : '#top-mid-panel',
        alignment   : "center"
    });
    slieTips.follow({
        trigger     : '#top-right',
        panel       : '#top-right-panel',
        alignment   : "right",
        duration    : "0"

    });
    slieTips.follow({
        trigger     : '#top-click',
        panel       : '#top-click-panel',
        event       : "click",
        alignment   : "center",
        afterHide   : function () {
            console.log("面板隐藏之后的回调函数（顶部最右侧对应的区域）");
        }
    });



    // 左侧的配置
    slieTips.follow({
        trigger     : '#bodyer-left-top',
        panel       : '#bodyer-left-top-panel',
        direction   :  "right",
        alignment   : "top",
        beforeShow  : function () {
            console.log("显示之前的回调函数");
        }
    });
    slieTips.follow({
        trigger     : '#bodyer-left-mid',
        panel       : '#bodyer-left-mid-panel',
        direction   :  "right",
        alignment   : "center",
        afterShow   : function () {
            console.log("显示之后的回调");
        }
    });
    slieTips.follow({
        trigger     : '#bodyer-left-bot',
        panel       : '#bodyer-left-bottom-panel',
        direction   :  "right",
        alignment   : "bottom"
    });

    //右侧配置
    slieTips.follow({
        trigger     : '#bodyer-right-top',
        panel       : '#bodyer-right-top-panel',
        direction   :  "left",
        alignment   : "top",
        beforeHide  : function () {
            console.log("隐藏之前的回调函数");
        }
    });
    slieTips.follow({
        trigger     : '#bodyer-right-mid',
        panel       : '#bodyer-right-mid-panel',
        direction   :  "left",
        alignment   : "center"
    });
    slieTips.follow({
        trigger     : '#bodyer-right-bot',
        panel       : '#bodyer-right-bottom-panel',
        direction   :  "left",
        alignment   : "bottom"
    });

    // 底部的按钮
    slieTips.follow({
        trigger     : '#left-btn',
        panel       : '#footer-left-panel',
        direction   :  "top",
        alignment   : "left"
    });
    slieTips.follow({
        trigger     : '#mid-btn',
        panel       : '#footer-mid-panel',
        direction   :  "top",
        alignment   : "center"
    });
    var test=slieTips.follow({
        trigger     : '#right-btn',
        panel       : '#footer-right-panel',
        direction   :  "top",
        alignment   : "right"
    });


    //生成实例后，配置是可以再次进行修改的；
    test.panelDirection="top";
    test.panelAlignment="left";

    var pageUtilitiy={
        init:function(){
            this.bind();
        },
        bind:function(){
            var self=this;

        }
    };
    pageUtilitiy.init();
});