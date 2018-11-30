
var newWindow=window.open("test: ");

newWindow.resizeTo(500,500);

var canvas=newWindow.document.createElement("canvas");
canvas.setAttribute("width",500);
canvas.setAttribute("height",500);
var px=0;
var py=0;
newWindow.document.downed=false;
newWindow.document.addEventListener("mousedown",function(eve){
	px=eve.clientX;
	py=eve.clientY;
	newWindow.downed=true;
},false);

newWindow.document.addEventListener("mouseup",function(){
newWindow.document.downed=false;
},false);

newWindow.document.addEventListener("mousemove",function(eve){
	if(!this.downed)return;
	ctx.beginPath();
	ctx.strokeStyle="rgba(0,0,255,1)";//"rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";
        ctx.moveTo(px, py);
        ctx.lineTo(eve.clientX, eve.clientY);
		var differences=2;
		//ctx.lineWidth=differences
		while(differences-->=0){
			ctx.shadowBlur =differences;
			ctx.stroke();
			
		}
		ctx.closePath();
		 //ctx.shadowColor = "rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";;
		px=eve.clientX;
		py=eve.clientY;
}.bind(newWindow),false);
newWindow.document.body.appendChild(canvas);

var ctx=canvas.getContext("2d");
 ctx.shadowColor = "rgb(150,150,255)";
  ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
 
 
 setInterval(function(){if(ctx.fillStyle!="rgba(0,0,0,0.3)")ctx.fillStyle="rgba(0,0,0,0.3)"; ctx.fillRect(0,0,500,500)},40);