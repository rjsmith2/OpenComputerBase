function typeOf(value) {
    var s = typeof value;
    if (s === "object") {
        s = ({}).toString.call(value).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    return s;
}

function isDefined(o) {
    return !isEmpty(o);
}

function isEmpty(o) {
    if (typeOf(o) === "array" || typeOf(o) === "nodelist" || typeOf(o) === "htmlcollection") {
        return o.length == 0;
    }
    if (typeOf(o) === "object") {
        for (var i in o) {
            var v = o[i];
            if (v !== undefined && typeOf(v) !== "function") {
                return false;
            }
        }
    }
    if (typeOf(o) === "string") {
        return o.trim() === "";
    }
    if (typeOf(o) !== "null" && typeOf(o) !== "undefined") {
        return false;
    }
    return true;
}