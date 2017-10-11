define(function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    /*
    * **read me***
    * 触点区域：可以触发事件的区域；
    * 面板区域：触发后需要显示的区域；
    * 1、如果点击或hove触发后，面板展开后又马上收起，可能是因为重复配置了,请检查下配置；
    * 2、如果不需要本模块设置面板区的显示位置，参数direction 和 alignment中任意一个 传值"ignore" 或 ""即可；
    * 3、parent配置说明: 如果DOM结构中，触点区和面板区均属于#selected_wrap的直接子元素，
    *                   则配置parent:"#selected_wrap"即可（配父级的ID，默认是出现在触点区下方，相对触点区左对齐的方式）,
    *                       此时不需要再配置模块的trigger和panel参数 (如果配置了，也会忽略掉)
    *                       但是需要在DOM结构的 触点区放入 slide_tip_trigger 的class名
    *                                         面板区放入 slide_tip_panel   的class名
    *
    *  4、trigger和panel配置说明：如果触点区和面板区不在一个DOM层级下,可以分别配置trigger和panel；注意，此时请勿配置parent;
    * */
    var Follow  = function (options) {
        var defaults = {
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
        };
        this._options = $.extend({},defaults, options);

        if(typeof jQuery == 'undefined'){
            console.warn("请引入jQuery,否则无法正常使用...");
            return;
        }

        //如果不是parent的配置方式
        var parent=this.parent=this._options.parent,
            $parent=$(parent);
        if(!parent){
            //判断参数是否可以正常获取
            if($(this._options.trigger).length !== 1){
                console.log("参数：trigger 错误");
                return;
            }
            if($(this._options.panel).length !== 1  ){
                console.log("参数：panel 错误");
                return;
            }
        }else if($parent.length === 1){
            //如果是parent的配置方式
            this._options.trigger=".slide_tip_trigger";
            this._options.panel=".slide_tip_panel";
            this.$triggerArea   = $parent.find(this._options.trigger);
            this.$panelArea     = $parent.find(this._options.panel);

            $parent.css("position","relative");
        }else{
            console.log("请检查parent的书写是否有误")
        }


        this.init();
    };

    Follow.prototype = {
        constructor:Follow,
        init: function () {
            var durationToNum=Number(this._options.duration);
            //初始化参数,下面this对应属性都会返回出去; 模块外接收到的实例,可以在外面随时修改对应的属性；
            this.$triggerArea   = this.$triggerArea || $(this._options.trigger);
            this.$panelArea     = this.$panelArea || $(this._options.panel);
            this.panelAlignment = this._options.alignment;
            this.panelDirection = this._options.direction;
            this.event          = this._options.event;
            this.duration       = !durationToNum && durationToNum !=0 ? this._options.duration : durationToNum;
            this.beforeShow     = this._options.beforeShow;
            this.afterShow      = this._options.afterShow;
            this.beforeHide     = this._options.beforeHide;
            this.afterHide      = this._options.afterHide;

            this.controlFlag = false;//辅助标记；如非必要，请勿在实例上修改此参数，用来处理鼠标移动相关
            this.timer = null;//解决面板与触点分开布局时，鼠标移动的BUG；

            //自定义属性，供事件委托的判断使用；
            this.$triggerArea.attr("data-subordinate", this.parent+this._options.trigger);
            this.$panelArea.attr("data-subordinate", this.parent+this._options.trigger);

            this.bind();
        },
        bind:function () {
            var self=this;
            //如果是hover事件；
            if(self.event=="hover"){
                self.$triggerArea.hover(function (e) {
                    clearTimeout(self.timer);
                    self.timer = null;
                    self.controlFlag = false;
                    setTimeout(function () {
                        self.unfolded();
                    }, 200);
                }, function () {
                    self.timer = setTimeout(function () {
                        self.controlFlag = true;
                    }, 200);

                    $(document).on("mousemove", function (e) {
                        if(self.controlFlag){
                            self.eventHandling(e);
                        }
                    })
                })
            }else if(self.event=="click"){
                //如果是点击事件；
                self.$triggerArea.click(function (e) {
                    self.panelDisplayControl();
                });

                //兼容处理
                $("html,body").on("click", function (e) {
                    self.eventHandling(e)
                });

                //浏览器大小改变时的处理
                $(window).resize(function () {
                    self.$panelArea.is(":hidden")? void(0):self.putAway()
                });
            }else {
                console.log("只接受click 和 hover 这两种方式。。。。");
            }
        },
        panelDisplayControl:function () {
            this.$panelArea.is(":hidden") ? this.unfolded() : this.putAway()
        },

        //收起面板
        putAway:function () {
            var self=this;
            this.beforeHide();
            if(self.duration === 0){
                this.$panelArea.css("display","none");
                self.afterHide();
            }else{
                this.$panelArea.stop().slideUp(self.duration,function () {
                    self.afterHide();
                })
            }
        },

        //展开面板
        unfolded:function () {
            var self=this;
            this.beforeShow();
            this.setPosition();
            if(self.duration ===0){
                this.$panelArea.css("display","block");
                self.afterShow();
            }else{
                this.$panelArea.stop().slideDown(self.duration,function () {
                    self.afterShow();
                });
            }
        },

        //设置显示位置
        setPosition:function () {
            if((this.panelAlignment=="ignore") || !this.panelAlignment || (this.panelDirection=="ignore") || !this.panelDirection){
                return;
            }else{
                this.$panelArea.css({"position":"absolute"});
            }

            var triggerMargin=this.getMarginVal(this.$triggerArea);

            var triggerOffset = this.getOffset.call(this.$triggerArea[0]),

                triggerOffsetLeft=Boolean(this.parent) ? parseFloat($(this.parent).css("paddingLeft"))+triggerMargin.marginLeft : triggerOffset.left,
                triggerOffsetTop =Boolean(this.parent) ? parseFloat($(this.parent).css("paddingTop"))+triggerMargin.marginTop : triggerOffset.top;

            var triggerCompleteWidth = this.$triggerArea.outerWidth(),//以内容宽度为准，忽略margin
                triggerCompleteHeight = this.$triggerArea.outerHeight(),//以内容高度为准，忽略margin

                panelCompleteWidth = this.$panelArea.outerWidth(true),
                panelCompleteHeight = this.$panelArea.outerHeight(true);


            //四个方向的判断
            if(this.panelDirection=="top"){
                //下面是均在上方展示的； 左对齐 | 居中 | 右对齐
                switch (this.panelAlignment) {
                    case "left":
                        this.$panelArea.css({
                            left: triggerOffsetLeft,
                            top: triggerOffsetTop-panelCompleteHeight
                        });
                        break;
                    case "center":
                        this.$panelArea.css({
                            left: triggerOffsetLeft  + triggerCompleteWidth / 2 - panelCompleteWidth / 2,
                            top: triggerOffsetTop-panelCompleteHeight
                        });
                        break;
                    case  "right":
                        this.$panelArea.css({
                            left: triggerOffsetLeft + triggerCompleteWidth - panelCompleteWidth,
                            top: triggerOffsetTop-panelCompleteHeight
                        });
                        break;
                    default:
                        this.$panelArea.css({
                            left: triggerOffsetLeft,
                            top: triggerOffsetTop-panelCompleteHeight
                        });
                }
            }else if(this.panelDirection=="bottom"){
                //下面是均在下方展示的； 左对齐 | 居中 | 右对齐
                switch (this.panelAlignment) {
                    case "left":
                        this.$panelArea.css({
                            left: triggerOffsetLeft,
                            top : triggerOffsetTop + triggerCompleteHeight
                        });
                        break;
                    case "center":
                        this.$panelArea.css({
                            left: triggerOffsetLeft  + triggerCompleteWidth / 2 - panelCompleteWidth / 2,
                            top : triggerOffsetTop + triggerCompleteHeight
                        });
                        break;
                    case    "right":
                        this.$panelArea.css({
                            left: triggerOffsetLeft + triggerCompleteWidth - panelCompleteWidth ,
                            top : triggerOffsetTop + triggerCompleteHeight
                        });
                        break;
                    default:
                        this.$panelArea.css({
                            left: triggerOffsetLeft,
                            top : triggerOffsetTop + triggerCompleteHeight
                        });

                }
            }else if(this.panelDirection=="right"){
                //在右侧展示的； 上对齐 | 居中 | 下对齐
                switch (this.panelAlignment) {
                    case "top":
                        this.$panelArea.css({
                            left: triggerOffsetLeft+triggerCompleteWidth,
                            top : triggerOffsetTop
                        });
                        break;
                    case "center":
                        this.$panelArea.css({
                            left: triggerOffsetLeft +triggerCompleteWidth,
                            top : triggerOffsetTop + triggerCompleteHeight/2-panelCompleteHeight/2
                        });
                        break;
                    case  "bottom":
                        this.$panelArea.css({
                            left: triggerOffsetLeft +triggerCompleteWidth,
                            top : triggerOffsetTop + triggerCompleteHeight-panelCompleteHeight
                        });
                        break;
                    default:
                        this.$panelArea.css({
                            left: triggerOffsetLeft  +triggerCompleteWidth,
                            top : triggerOffsetTop
                        });
                }
            }else if(this.panelDirection=="left"){
                //在左侧展示的； 上对齐 | 居中 | 下对齐
                switch (this.panelAlignment) {
                    case "top":
                        this.$panelArea.css({
                            left: triggerOffsetLeft-panelCompleteWidth,
                            top : triggerOffsetTop
                        });
                        break;
                    case "center":
                        this.$panelArea.css({
                            left: triggerOffsetLeft-panelCompleteWidth,
                            top : triggerOffsetTop + triggerCompleteHeight/2-panelCompleteHeight/2
                        });
                        break;
                    case  "bottom":
                        this.$panelArea.css({
                            left: triggerOffsetLeft-panelCompleteWidth,
                            top : triggerOffsetTop + triggerCompleteHeight-panelCompleteHeight
                        });
                        break;
                    default:
                        this.$panelArea.css({
                            left: triggerOffsetLeft-panelCompleteWidth,
                            top : triggerOffsetTop
                        });
                }
            }

        },
        //下面的函数可以算出元素的距离浏览器顶部的绝对位置,
        getOffset: function () {
            //注：offset是已经包含当前元素的margin对应值，外部计算时需要注意
            /*
            * offsetLeft=(offsetParent的padding-left)+(中间元素的offsetWidth)+(当前元素的margin-left)
            * offsetTop =(offsetParent的padding-top)+(中间元素的offsetHeight)+(当前元素的margin-top)
            * */
            var left = this.offsetLeft,
                top = this.offsetTop,
                par = this.offsetParent;
            while (par) {

                left += par.offsetLeft;
                top += par.offsetTop;
                if (window.navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
                    left += par.clientLeft;
                    top += par.clientTop;
                }
                par = par.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        },
        getMarginVal:function ($ele) {
            return {
                marginTop: parseFloat($ele.css("marginTop")),
                marginRight:parseFloat($ele.css("marginRight")),
                marginBottom: parseFloat($ele.css("marginBottom")),
                marginLeft: parseFloat($ele.css("marginLeft"))
            };
        },
        //事件处理
        eventHandling:function (e) {
            e = e || window.event;
            for(var eventSource = e.target || e.srcElement;eventSource;){
                //如果当前的事件源在目标区域，则终止；如果不是则收起
                if ($(eventSource).attr("data-subordinate") && $(eventSource).attr("data-subordinate").indexOf(this.parent+this._options.trigger) > -1){
                    return;
                }
                eventSource = eventSource.parentNode;
            }
            this.controlFlag = false;
            this.$panelArea.is(":hidden")? void(0):this.putAway();//鼠标移出去了，这时候需要收起面板

        }
    };


    module.exports = {
        follow: function (options) {
            return new Follow(options);
        }
    }
});
