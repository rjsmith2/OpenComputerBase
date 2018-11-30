var demo=window.open("");
demo.resizeTo(550,550);
var documentd=demo.document;
var decanvas=documentd.createElement("canvas");
var startDesktop=documentd.body;
var D=9;

backgroundanimation = function () {
	C = Math.cos; // cache Math objects
	S = Math.sin;
	var U = 0;
	var w = demo;
	var j = documentd;
	var d = decanvas;
	var A,B,t;
	d.setAttribute("style","top:0px;left:0px;z-index:0;width:100%;height:100%;");
	documentd.body.appendChild(d);
	var c = d.getContext("2d");
	W = d.setAttribute("width",550);
	H = d.setAttribute("height",550);
	c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
	c.globalCompositeOperation = "lighter"; // switch to additive color application
	c.lineWidth = 0.3;
	c.lineCap = "round";
	var bool = 0, 
		t = 0; // theta
	//j.addEventListener("mousemove",function(e){j.onclick(e)})
	j.addEventListener("click",function (e) {
		if(window.T) {
			if(D==9) { var D=Math.random()*15; f(1); }
			clearTimeout(window.T);
		}
		var X = e.pageX; // grab mouse pixel coords
		var Y = e.pageY;
		var a=0; // previous coord.x
		var b=0; // previous coord.y 
		A = X, // original coord.x
		B = Y; // original coord.y
		var R=(e.pageX/W * 999>>0)/999;
		var r=(e.pageY/H * 999>>0)/999;
    	var U=e.pageX/(Math.random()*400|0) * 360 >>0;
		c.fillStyle = "rgba(0,0,0,0.22)";
		D=9;
	 var g = 360 * Math.PI / 180;
		window.T = setInterval(f = function (e) { // start looping spectrum
			c.save();
			c.globalCompositeOperation = "source-over"; // switch to additive color application
			if(e!=1) {
				
				c.fillRect(0, 0, W, H); // resize <canvas> and draw black rect (default)
			}
			c.restore();
			var i = 13; while(i --) {
				c.beginPath();
			
				if(D > 450 || bool) { // decrease diameter
					if(!bool) { // has hit maximum
						bool = 1;
					}
					if(D < 0.1) { // has hit minimum
						bool = 0;
					}
					t -= g; // decrease theta
					D -= 0.05; // decrease size
				}
				if(!bool) {
					t += g; // increase theta
					D += 0.05; // increase size
				}
				q = (R / r - 1) * t; // create hypotrochoid from current mouse position, and setup variables (see: http://en.wikipedia.org/wiki/Hypotrochoid)
				var x = (R - r) * C(t) + D * C(q) + (A + (X - A) * (i / 25)) + (r - R); // center on xy coords
				var y = (R - r) * S(t) - D * S(q) + (B + (Y - B) * (i / 25));
				if (a) { // draw once two points are set
					c.moveTo(a, b);
					c.lineTo(x, y)
				}
				c.strokeStyle = "hsla(" + (U % 360) + ",100%,50%,0.95)"; // draw rainbow hypotrochoid
				c.stroke();
				a = x; // set previous coord.x
				b = y; // set previous coord.y
			
			}
				c.closePath();
			U -= 0.5; // increment hue
			A = X; // set original coord.x
			B = Y; // set original coord.y
		}, 15);
	});
decanvas.addEventListener("keydown",function(e) { a=b=0; R += 0.05 });
j.onclick({pageX:120, pageY:100})
}();
