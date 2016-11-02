/**
 * Created by Administrator on 2016/10/26.
 */
define(function (require, exports, module) {
    function Certificate (option){
        var option = $.extend(true,{
            url:'data/scm.product.queryRegistList',
            classes :'ui-tips',
            text : 'name',
            ajaxOption : {
                pageIndex : 1,
                pageSize : 10
            }
        },option);
        this.option = option;
    }
    var PAGE = {
        PAGER : {
            /**
             * GLOBAL.PAGER.initPager 分页
             *
             * @param data
             * @param func
             * @param func_options 用法:
             *
             * <pre>
             * $('#goods_pager').html(GLOBAL.PAGER.initPager(data, 'GOODS.refresh', {
			 * 	pageSize : 10,
			 * 	pageIndex : 1
			 * }));
             * </pre>
             */
            initPager : function(data, func, func_options) {
                if (typeof (func_options) == 'string' && func_options != '') {
                    func_options = jQuery.parseJSON(func_options);
                }
                data = data || {};
                data.total = data.total || 0; // 总条数
                data.pageIndex = data.pageIndex || 0; // 当前页
                data.pageSize = data.pageSize || func_options.pageSize || 20; // 每页条数
                var count = ((data.total % data.pageSize == 0) ? (data.total / data.pageSize) : (parseInt(data.total / data.pageSize) + 1)); // 总页数
                var pageIndex = parseInt(data.pageIndex || func_options.pageIndex || 0); // 当前页
                var a = [];
                // 分页统计信息
                var phtml = '';
                phtml += '<ul> ';
                // 总页数少于10 全部显示,大于10 显示前3 后3 中间3 其余....
                if (pageIndex == 1) {
                    a[a.length] = '<li><span class="disabled">上一页</span></li>';
                } else {
                    a[a.length] = '<li><a data-index="' + (pageIndex - 1) + '" >上一页</a></li>';
                }


                if (pageIndex == count) {
                    a[a.length] = '<li><span class="disabled">下一页</span></li>';
                } else {
                    a[a.length] = '<li><a data-index="' + (pageIndex + 1) + '" class="next">下一页</a></li>';
                }
                phtml += a.join('');
                phtml += '</ul>';
                // phtml += '</div>';

                return phtml;
            },
            /**
             * GLOBAL.PAGER.buildPager
             *
             * @param target
             * @param data
             * @param func
             * @param func_options
             */
            buildPager : function(target, data, func, func_options) {
                if (typeof (func_options) == 'string' && func_options != '') {
                    func_options = jQuery.parseJSON(func_options);
                }

                $(target).html(PAGE.PAGER.initPager(data, func, func_options));

                // 分页 click事件
                $(target + ' ul a').on('click',function() {
                    var _pageIndex = $(this).data('index');
                    func_options.pageIndex = _pageIndex;
                    if (typeof (func) == 'function') {
                        func(func_options);
                    } else {
                        eval(func + '(' + func_options + ')');
                    }
                });

            }
        },
        init : function () {
            var self = this;
            self.target =  $("#"+self.option.target);
            self.testFrist();
        },
        testFrist : function () {
            var self = this,
                tips = $(self.target).parent().find(".ui-tips");
            self.element = tips;
            if(!tips.length){
                self.destroy();
                self.buildHtml();
            }else{
                self.toggle();
            }
        },
        initTable : function (data,options) {
            var self = this,
                str = $('<ul></ul>');
            $.each(data.rows || data.registList,function (i,item) {
                item.msg = JSON.stringify(item);

                str.append('<li data-msg='+item.msg+'>'+  item[self.option.text] +'</li>');
            });
            $(".ui-tips .ui-tips-body").html(str);
            self.PAGER.buildPager(".ui-tips .ui-tips-pager",data,function (opt) {
                self.searchData(opt);
            },options);

        },
        searchData : function (options) {
            var self = this,
                options = $.extend(self.option.ajaxOption,options,{keyword : $('input[name=tips-keyword]').val()});
            GLOBAL.AJAX.getAjaxData({
                url : self.option.url,
                data : {
                    params : options
                }
            },$.proxy(self,"initTable"));
        },
        buildHtml : function () {
            var self = this,
                str = $('<div class="ui-tips "> ' +
                '<div class="ui-tips-body">' +
            '</div>' +
            '<div class="ui-tips-footer tableoptions">' +
            '<div class="ui-tips-pager pagination">' +
            '</div>' +
            '<div class="ui-tips-search"><input type="text" name="tips-keyword"> ' +
            ' <button class="tips-btn" name="tips-search">搜索</button>' +
            '</div>' +
            '</div>' +
            '</div>'),
                wd = self.option.width || Math.max(350, $(self.target).width());
            str.width(wd);
            str.insertAfter(self.target);
            self.bindEvent();
            self.searchData();
        },
        bindEvent:function () {
            var self = this;
            $(".ui-tips .tips-btn").on('click',function () {
                self.searchData();
            });
            $("body").delegate('.ui-tips-body ul>li','click',function () {
                var msg = $(this).data("msg");
                self.target.val($(this).html());
                (self.option.done || self.option.callback || $.noop) (msg);
                self.toggle();
            });
            $("body").delegate('#modal_add','click',function (e) {
                var target = e.target;
                target != self.target[0] &&  !$(target).parents(".ui-tips").length && self.hide();
            });

        },
        hide : function () {
            var self = this;
            self.toggle(true);
        },
        toggle : function (isHide) {
            var self = this,
                tips = $(self.target).parent().find(".ui-tips"),
                isHide = isHide || !tips.hasClass("tips-hide");
            if(isHide){
                tips.addClass("tips-hide");
                tips.fadeOut("fast");
            }else{
                tips.fadeIn("fast");
                tips.removeClass("tips-hide");
            }

        },
        destroy : function () {
            var self = this;
            $(self.target).parent().find(".ui-tips").remove();
            $(".ui-tips .tips-btn").off();
            $("body").undelegate('.ui-tips-body ul>li','click');
            $("body").undelegate('#modal_add','click');
        }
    };
    Certificate.prototype =  $.extend(Certificate.prototype,PAGE);

    return Certificate;
});
