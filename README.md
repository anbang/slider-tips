# slider-tips

**演示地址**：https://zhubangbang.com/demo/slider-tips/demo/index.html

##### 名词解释：

- 触点区域：可以触发事件的区域；
- 面板区域：触发后需要显示的区域；

##### 说明
- 1、如果点击或hove触发后，面板展开后又马上收起，可能是因为重复配置了,请检查下配置；
- 2、如果不需要本模块设置面板区的显示位置，参数direction 和 alignment中任意一个 传值"ignore" 或 ""即可；
- 3、parent配置说明: 如果DOM结构中，触点区和面板区均属于#selected_wrap的直接子元素，则配置parent:"#selected_wrap"即可（配父级的ID，默认是出现在触点区下方，相对触点区左对齐的方式）,此时不需要再配置模块的trigger和panel参数 (如果配置了，也会忽略掉)但是需要在DOM结构的 
	- 触点区放入 slide_tip_trigger 的class名
	- 面板区放入 slide_tip_panel   的class名
- 4、trigger和panel配置说明：如果触点区和面板区不在一个DOM层级下,可以分别配置trigger和panel；注意，此时请勿配置parent;

##### 参数配置 

        parent      : '',               //触点区和面板区共同的parent,例如 #selected_wrap   注：如果设置了parent，会自动忽略trigger和panel参数；
        trigger     : '',               //触发区域 的包裹层ID，例如#contact_area；
        panel       : '',               //显示区域 的包裹层ID，例如#panel_wrap
        direction   : 'bottom',         //面板相对按钮的 显示位置,默认bottom                参数: top | right | bottom | left | ignore
        alignment   : 'left',           //面板相对按钮的 对齐方式,默认left                  参数: right | left | center | top | bottom | ignore
        event       : 'hover',          //事件触发的类型 默认是hover方式                    参数: hover | click
        duration    : 0,                //面板展开的速度 可传毫秒数 如1500/0是不需要动画      参数: slow | normal |fast | 1500 | 0 (0是不需要动画)
        beforeShow  : function () {},
        afterShow   : function () {},
        beforeHide  : function () {},
        afterHide   : function () {}

##### 用法
** html结构 **


        <div class="parent_demo_item" id="parent_bottom_left">
            <div class="demo_trigger slide_tip_trigger">
                <input type="button" class="wui-button wui-button-orange " value="下方 左对齐"/>
            </div>
            <div class="demo_panel slide_tip_panel bottom-left-arrow   tip-border-color-red">阿斯大苏打撒旦撒旦
                <a href="javascript:window.location.reload();">点击刷新</a>
            </div>
        </div>

        <div class="parent_demo_item" id="parent_bottom_center">
            <div class="demo_trigger slide_tip_trigger">
                <input type="button" class="wui-button wui-button-orange " value="下方 中对齐"/>
            </div>
            <div class="demo_panel slide_tip_panel bottom-center-arrow no-rely tip-border-color-orange"></div>
        </div>

        <div class="parent_demo_item" id="parent_bottom_right">
            <div class="demo_trigger slide_tip_trigger">
                <input type="button" class="wui-button wui-button-orange " value="下方 右对齐"/>
            </div>
            <div class="demo_panel slide_tip_panel bottom-right-arrow tip-border-color-green"></div>
        </div>

**js的写法**

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



下面是触点区和展示区的DEMO不写在同一地方的

    //下面是 trigger 和  panel 配置方式
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


上面是CMD模式的开发代码；

- 引入JS: src/slide-tips.js
- 引入CSS: css/slide-tips.css  //里面配置了一些基本的箭头样式和边框样式，非必须引用；

##### 如果您是直接使用jQuery的

直接jQuery（没有基于CMD），需要构造函数的方法使用，不能使用上面的js用法,文件请引入jQuery文件夹下的slide-tips.js；

	var slieTips=New Follow(options);//slieTips是当前实例；实例中可以直接获取内部属性和方法；

比如：

    var slieTips=New Follow({
        trigger     : '#top-click',
        panel       : '#top-click-panel',
        event       : "click",
        alignment   : "center",
        afterHide   : function () {
            console.log("面板隐藏之后的回调函数（顶部最右侧对应的区域）");
        }
    });

注：生成实例后，配置是可以再次进行修改的；


##### class名，可简单的设置箭头方向，边框演示，有无padding和圆角等；

仅仅是简单的配置，如果您是自定义面板区域的样式，则不需要引入slide-tips.css,非必须引入

- slide_tip_panel //面板区DOM包裹层的类名，下面所有类名均放在此类目的同级

** 包裹层的设置 **

- slide-no-padding //无padding,放在 slide_tip_panel 同级
- panel-has-radius //有圆角,放在 slide_tip_panel 同级

**边框颜色**

- tip-border-color-default
- tip-border-color-white
- tip-border-color-black
- tip-border-color-gray
- tip-border-color-blue
- tip-border-color-green
- tip-border-color-orange
- tip-border-color-red

** 箭头出现的位置 **

- top-left-arrow
- top-center-arrow
- top-right-arrow
- right-top-arrow
- right-center-arrow
- right-bottom-arrow
- bottom-left-arrow
- bottom-center-arrow
- bottom-right-arrow
- left-top-arrow
- left-center-arrow
- left-bottom-arrow

** 面板区域与触点区域分割开 **

- no-rely  //加此类名可以使两者分开，不连在一起；


#### 可能出现的问题：

问题出现的场景：需同时满足下面4个条件：

- 1、一个页面有多个 slider-tips 实例；
- 2、所有实例的面板区都显示的时候，面板区域存在重叠的情况；
- 3、所有重叠的实例，都使用的是hover事件触发；
- 4、鼠标从实例A区域，快速移动到实例B区域，并且移入后鼠标立即停止不动

出现的问题：**可能会同时展示2个面板区域，DEMO中已经做出演示**，如果条件4中，鼠标移入后没有立即暂停，则不会出现此情况；



## 基于VUE.JS的slider-tips（后续开发，暂无）
