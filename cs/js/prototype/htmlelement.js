HTMLElement.prototype.hasClass = function(cls) {
    //need 4 slahses becuase it gets double quoted
    //return this.className.match(new RegExp("(\\s|^)"+cls+"(\\s|$)"));
    //return this.className.match(new RegExp("(\\\\s|^)" + cls + "(\\\\s|$)"));
    //return this.className.match(new RegExp("(^| )" + cls + "( |$)"));
    return (" " + this.className + " ").indexOf(" " + cls + " ") !== -1;
};

HTMLElement.prototype.addClass = function(cls) {
    if (!this.hasClass(cls)) {
        this.className += (this.className ? " " : "") + cls;
    }
};

HTMLElement.prototype.removeClass = function(cls) {
    if (this.hasClass(cls)) {
        this.className = this.className.replace(new RegExp("\\s?\\b" + cls + "\\b"), "").replace(/^\s+/, "");
        //this.className = this.className.replace(new RegExp("\\\\s?\\\\b" + cls + "\\\\b"), "").replace(/^\\s+/, "");
    }
};

HTMLElement.prototype.hoverClass = function(cls) {
    this.onmouseover = function() {
        this.addClass(cls);
    };
    this.onmouseout = function() {
        this.removeClass(cls);
    };
};

HTMLElement.prototype.toggleClass = function(cls) {
    if (this.hasClass(cls)) {
        this.removeClass(cls);
    }
    else {
        this.addClass(cls);
    }
};

HTMLElement.prototype.getActiveElementByClassName = function(cls) {
    var el = this.getElementsByClassName(cls);
    if (el.length > 0) {
        for (var i = el.length - 1; i >= 0; i--) {
            if (el[i].offsetHeight > 1 && el[i].offsetWidth > 1) {
                return el[i];
            }
        }
    }
    return undefined;
};

HTMLElement.prototype.replaceClass = function (ocls, ncls) {
    if (this.hasClass(ocls)) {
        this.removeClass(ocls);
        this.addClass(ncls);
    }
};

HTMLElement.prototype.click = function() {
    //var evt = this.ownerDocument.createEvent("MouseEvents");
    //evt.initMouseEvent("click", true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(evt);
};

HTMLElement.prototype.mouseup = function() {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(evt);
};

HTMLElement.prototype.mousedown = function() {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    this.dispatchEvent(evt);
};

HTMLElement.prototype.toString = function() {
    var serialized;
    try {
        // XMLSerializer exists in current Mozilla browsers
        serializer = new XMLSerializer();
        serialized = serializer.serializeToString(this);
    } catch (e) {
        // Internet Explorer has a different approach to serializing XML
        serialized = this.xml;
    }
    return serialized;
};