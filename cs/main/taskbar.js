var Taskbar = function() {
    var $ = this;
    
    var _private = {
        barBottom: -26
        , startTop: -27
    };
    
    this.id = "taskbar";
    
    //start button w/ icon
    this.start = (function() {
        var button = createDom("div", {
            className: "startbutton"
            , style: {
                //top: "-27px"
                top: "0"
            }
        });
        button.currentDelta = {
            top: 0
        };
        var icon = createDom("div", {
            className: "starticon"
            , textContent: "start"
        });
        
        button.appendChild(icon);
        return button;
    })();
    
    //entire bar
    this.bar = createDom("div", {
        id: $.id
        , style: {
            //bottom: "0"
            bottom: _private.barBottom + "px"
        }
        , onmouseover: function(evt) {
            if (this.timeout) {
                window.clearTimeout(this.timeout);
                this.timeout = false;
            }
            
            animate(
                this
                , makeEaseOut(quint)
                , {bottom: parseInt(this.style.bottom)} //from
                , {bottom: 0} //to
                , true);
            animate(
                $.start
                , makeEaseOut(quint)
                , {top: parseInt($.start.style.top)} //from
                , {top: _private.startTop} //to
                , true);
        }
        , onmouseout: function(evt) {
            var that = this;
            
            //only need this once
            if (!that.timeout) {
                that.timeout = window.setTimeout(function() {
                    animate(
                        that
                        , makeEaseOut(quint)
                        , {bottom: parseInt(that.style.bottom)} //from
                        , {bottom: _private.barBottom} //to
                        , true);
                    
                    animate(
                        $.start
                        , makeEaseOut(quint)
                        , {top: parseInt($.start.style.top)} //from
                        , {top: 0} //to
                        , true);
                }, 500);
            }
        }
    });
    this.bar.currentDelta = {
        bottom: _private.barBottom
    };
    this.bar.timeout = false;
    
    this.menu;
    
    this.tasks = [];
    this.taskicons = [];
    
    var windowExists = function(dom) {
        for (var i = 0; i < $.tasks.length; i++) {
            if ($.tasks[i] === dom) {
                return true;
            }
        }
        return false;
    };
    
    var getTaskIndex = function(dom) {
        //console.log(dom);
        for (var i = 0; i < $.tasks.length; i++) {
            //console.log($.tasks[i] === dom, $.tasks[i]);
            if ($.tasks[i] === dom) {
                return i;
            }
        }
        return -1;
    };
    
    this.addWindow = function(dom) {
        if (!windowExists(dom)) {
            this.tasks.push(dom);
            
            var newicon = createDom("div", {
                id: "taskapp_" + dom.id
                , className: "taskicons " + dom.id
                , textContent: selectDom(".windowTitleText", dom)[0].textContent || selectDom(".windowTitleContainer", dom)[0].textContent
                , onclick: function(evt) {
                    dom.onfocusAction();
                    dom.removeClass("taskbariconhover");
                    dom.clicked = true;
                }
                , onmouseover: function(evt) {
                    dom.oldzIndex = parseInt(dom.style.zIndex);
                    dom.alreadyActive = dom.hasClass("windowContainerFocused");
                    dom.clicked = false;
                    
                    dom.style.zIndex = dom.oldzIndex + 100;
                    dom.addClass("windowContainerFocused");
                    dom.addClass("taskbariconhover");
                }
                , onmouseout: function(evt) {
                    if (!dom.clicked) dom.style.zIndex = dom.oldzIndex;
                    if (!dom.clicked && !dom.alreadyActive) dom.removeClass("windowContainerFocused");
                    dom.removeClass("taskbariconhover");
                }
            });
            
            $.taskicons.push(newicon);
            $.bar.appendChild(newicon);
        }
    };
    
    this.removeWindow = function(dom) {
        var index = getTaskIndex(dom);
        if (index != -1) {
            //remove dom from
            $.tasks.splice(index, 1);
            //remove icon from
            $.taskicons.splice(index, 1);
            //remove task from taskbar
            $.bar.removeChild(selectDom("." + dom.id, $.bar)[0]);
        }
    };
    
    this.updateTaskTitle = function(dom) {
        var index = getTaskIndex(dom);
        if (index != -1) {
            $.taskicons[index].textContent = selectDom(".windowTitleContainer", dom)[0].textContent;
        }
    };
    
    //init
    var init = (function() {
        //get the desktop element
        var dt = desktops.ele[0] || selectDom(".desktopView");
        
        $.bar.appendChild($.start);
        dt.appendChild($.bar);
    })();
};