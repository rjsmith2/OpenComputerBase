{//steps
    function animateText(textArea) {
        var text = textArea.value;
        var from = 0;
        var to = text.length;
      
        animate({
            object: textArea,
            delay: 20,
            duration: 5000,
            delta: bounce,
            step: function(delta) {
                var result = (to - from) * delta + from;
                textArea.value = text.substr(0, Math.ceil(result));
            }
        });
    }
}

{//animate
    function animate(ele, delta, from, to, memory, duration, interval) {
        if (ele.memInterval) window.clearInterval(ele.memInterval);
        
        var started = new Date;
        ele.memInterval = window.setInterval(
            function() {
                var timePassed = new Date - started;
                var progress = timePassed / (duration || 500);
                
                if (progress > 1) progress = 1;
                
                for (var each in from) {
                    if (memory) {
                        ele.currentDelta[each] = delta(progress);
                        ele.style[each] = from[each] + (ele.currentDelta[each] * (to[each] - from[each])) + "px";
                    }
                    else {
                        ele.style[each] = from[each] + (delta(progress) * (to[each] - from[each])) + "px";
                    }
                }
                
                if (progress == 1) window.clearInterval(ele.memInterval);
            }
        , interval || 10);
    }
    
    function highlight(ele, delta, from, to, memory, duration, interval) {
        if (ele.memInterval) window.clearInterval(ele.memInterval);
        
        //var actStep = 0;
        var started = new Date;
        ele.memInterval = window.setInterval(
            function() {
                var timePassed = new Date - started;
                var progress = timePassed / (duration || 500);
                
                if (progress > 1) progress = 1;
                
                if (memory) {
                    ele.currentDelta = [
                        Math.max(Math.min(parseInt((delta(progress) * (to[0] - from[0])) + from[0], 10), 255), 0)
                        , Math.max(Math.min(parseInt((delta(progress) * (to[1] - from[1])) + from[1], 10), 255), 0)
                        , Math.max(Math.min(parseInt((delta(progress) * (to[2] - from[2])) + from[2], 10), 255), 0)
                    ];
                    
                    ele.style.backgroundColor = "rgb(" +
                        ele.currentDelta[0] + "," +
                        ele.currentDelta[1] + "," +
                        ele.currentDelta[2] + ")";
                }
                else {
                    ele.style.backgroundColor = "rgb(" +
                        Math.max(Math.min(parseInt((delta(progress) * (to[0] - from[0])) + from[0], 10), 255), 0) + "," +
                        Math.max(Math.min(parseInt((delta(progress) * (to[1] - from[1])) + from[1], 10), 255), 0) + "," +
                        Math.max(Math.min(parseInt((delta(progress) * (to[2] - from[2])) + from[2], 10), 255), 0) + ")";
                }
                
                if (progress == 1) window.clearInterval(ele.memInterval);
            }
        , interval || 10);
    }
}

{//deltas
    function linear(progress) {
        return progress;
    }
    
    function elastic(progress) {
        return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * 1.5 / 3 * progress);
    }
    
    function squared(progress) {
        return Math.pow(progress, 2);
    }
    
    function quad(progress) {
        return Math.pow(progress, 4);
    }
    
    function quint(progress) {
        return Math.pow(progress, 5);
    }
    
    function hex(progress) {
        return Math.pow(progress, 6);
    }
    
    function circ(progress) {
        return 1 - Math.sin(Math.acos(progress));
    }
    
    function back(progress) {
        return Math.pow(progress, 2) * ((1.5 + 1) * progress - 1.5);
    }
    
    function bounce(progress) {
        for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
            if (progress >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
            }
        }
    }
    
    function makeEaseInOut(delta) {  
        return function(progress) {
            if (progress < .5)
                return delta(2 * progress) / 2;
            else
                return (2 - delta(2 * (1 - progress))) / 2;
        }
    }
    
    function makeEaseOut(delta) {  
        return function(progress) {
            return 1 - delta(1 - progress);
        }
    }
}