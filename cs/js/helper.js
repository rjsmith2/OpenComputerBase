{
    //search for dom until it is created
    queueDom = function (query, parent, callback, remaining) {
        //console.log(z,([]).slice.call(arguments).splice(0,3));
        if (!remaining) {
            //console.log([/i50/, query, this, g, QUEUED]);
            for (var q = 0; q < QUEUED.length; q++) {
                if (QUEUED[q][0] === query) {
                    
                    //merge callbacks
                    if (QUEUED[q][2] && callback) {
                        var cb = QUEUED[q][2].toString().length > callback.toString().length ? QUEUED[q][2] : callback;
                        callback = QUEUED[q][2] = cb;
                    }
                    QUEUED.push([query, parent, callback]);
                    return;
                }
            }
            QUEUED.push([query, parent, callback]);
        }

        window.setTimeout(function () {
            var dom = selectDom(query, parent);
            remaining = remaining || 50;
            //console.log(["queueDom","remaining:"+remaining,query,dom,dom==null?null:dom.length,typeof(callback),isEmpty(dom)]);
            if (isEmpty(dom)) {
                if (remaining == 1) {
                    for (var m = false, q = 0; q < QUEUED.length; q++) {
                        if (QUEUED[q][0] === query) {
                            if (m) {
                                //console.log([/QUEUED/, QUEUED[q]]);
                                return window.setTimeout(function () {
                                    queueDom(QUEUED[q][0], QUEUED[q][1], QUEUED[q][2], 50)
                                }, 250);
                            } else {
                                QUEUED.splice(q--, 1);
                                m = true;
                            }
                        }
                    }
                    return;
                }
                return window.setTimeout(function () {
                    queueDom(query, parent, callback, --remaining)
                }, 250);
            }
            if (callback && typeof (callback) === "function") {
                //console.log([/q callback/, dom, callback, callback.toString()]);
                //call merged function from the stack
                for (var q = 0; q < QUEUED.length; q++) {
                    if (QUEUED[q][0] === query) {
                        QUEUED[q][2].call(g, dom);
                        break;
                    }
                }
            }
            //clear all the queued queries
            for (var q = 0; q < QUEUED.length; q++) {
                if (QUEUED[q][0] === query) QUEUED.splice(q--, 1);
            }
            return;
        }, 1);

        return;
    };

    //node selector
    selectDom = function (query, parent) {
        var d = parent || document;
        //console.log([/selectDom/,g,d,query.replace(/\.|#/g, " "),window.document,parent]);
        if (query[0] === "#") {
            return d.getElementById(query.substr(1));
        }
        if (query[0] === ".") {
            return d.getElementsByClassName(query.substr(1).replace(/\./g, " "));
            //return d.getElementsByClassName(query.substr(1).replace(/\\./g, " "));
        }
        if (query.match(/^[\/*]|^\.[\/\.]/)) {
        //if (query.match(/^[\\/*]|^\\.[\\/\\.]/)) {
            var nodes = [];
            var xpath = document.evaluate(query, d, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (query.lastIndexOf("@id") > (query.lastIndexOf("@class") | query.lastIndexOf("/"))) {
                return xpath.snapshotItem(0);
            }
            for (var i = 0; i < xpath.snapshotLength; i++) {
                nodes.push(xpath.snapshotItem(i));
            }
            return nodes;
        }
        return d.getElementsByTagName(query);
    };

    //create node
    createDom = function (tag, properties) {
        var el = document.createElement(tag);
        setAttributes(el, properties);
        return el;
    };

    //check if dom exists in current context
    domExists = function (el) {
        while (el = el.parentNode) {
            if (el == document) return true;
        }
        return false;
    };

    //used for merging json objects
    mergeObject = function (nevv, old) {
        for (var i in old) {
            //ORIGINAL MUST HAVE THE KEY IN ORDER TO MERGE
            if (old.hasOwnProperty(i) && nevv.hasOwnProperty(i)) {
                //these will always override from the script itself
                if (i === "version") continue;
                nevv[i] = old[i];
            }
        }
        return nevv;
    };

    setAttributes = function (el, properties) {
        if (el instanceof HTMLElement && properties && typeof(properties) === "object") {
            for (each in properties) {
                if (each && properties[each] !== null) {
                    //console.log([/$.setAttributes/, each, properties[each], el.hasOwnProperty(each)]);
                    //need these because of Firefox
                    if (each === "className") el.className = properties[each];
                    else if (each === "innerHTML") el.innerHTML = properties[each];
                    else if (each === "innerText") el.innerText = properties[each];
                    else if (each === "onclick") el.onclick = properties[each];
                    else if (each === "ondblclick") el.ondblclick = properties[each];
                    else if (each === "ondragstart") el.ondragstart = properties[each];
                    else if (each === "onmousedown") el.onmousedown = properties[each];
                    else if (each === "onmouseover") el.onmouseover = properties[each];
                    else if (each === "onmouseout") el.onmouseout = properties[each];
                    else if (each === "style" && typeof(properties[each]) === "object") {
                        for (css in properties[each]) {
                            el.style[css] = properties[each][css];
                        }
                    } else if (each === "textContent") el.textContent = properties[each];
                    else if (el.hasOwnProperty(each) || el.getAttribute(each)) el[each] = properties[each];
                    else el.setAttribute(each, properties[each]);
                }
            }
        }
    };
    
    /*
    //get message
    getMessage = function (msg) {
        try {
            return getMessage(msg, this.settings.language);
        } catch (e) {
            try {
                return getMessage(msg, "en");
            } catch (e) {
                return "Unknown message " + this.settings.language + ":" + msg;
            }
        }
    };
    */
    
    //get local value
    getValue = function (key, def, unique) {
        unique = unique || "";
        return localStorage.getItem(unique + key) || def;
    };

    //set local value
    setValue = function (key, val, unique) {
        unique = unique || "";
        return localStorage.setItem(unique + key, val)
    };

    //delete local value
    deleteValue = function (key, unique) {
        unique = unique || "";
        return localStorage.removeItem(unique + key);
    };

    //insert style sheet to header
    addStyle = function (script, id) {
        var h = selectDom("head")[0];
        h.appendChild(createDom("style", {
            id: id || "",
            type: "text/css",
            media: "screen",
            innerHTML: script
        }));
    };

    //remove style sheet from header
    removeStyle = function (script) {
        var h = selectDom("head")[0];
        if (script instanceof HTMLElement) {
            h.removeChild(script);
        } else if (typeof (script) === "string" && selectDom("#".concat(script))) {
            h.removeChild(selectDom("//style[@id=" + script.quote() + "]"));
        }
    };
    
    /*
    //only save if userkey is valid
    saveThis = function (key) {
        //console.log([/saveSettings/, this, g]);
        if (this && this.userkey) {
            this.settings.time = new Date().getTime();
            //setValue(this.userkey, this.settings.toSource(), this._U_);
            setValue(this.userkey, JSON.stringify(this.settings), this._U_);
        }
    };
    */
    
    head = selectDom("head")[0] || document.documentElement;
    body = selectDom("body")[0] || document.documentElement;
    
} //public functions