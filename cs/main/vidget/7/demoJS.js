
var newWindow=window.open("test: "+address);

newWindow.resizeTo(500,500);
var document=newWindow.document;
var canvas=newWindow.document.createElement("canvas");
canvas.setAttribute("width",500);
canvas.setAttribute("height",500);
document.appendChild(canvas);
var a=document,
	b=self,
	c=canvas,
	d=c.getContext("2d"),
	e=500,
	f1=500;
	c.width=e;
	c.height=f1;
	var g=e/2,
	h=f1/2,
	i=Math,
	j=i.min(g,h),
	k=i.cos,
	l=i.sin,
	m=i.random,
	n=0,
	o=0,
	p,
	q,
	r=0,
	s=1,
	t,u,v=1;
	a.onclick=function(){w()};
	a.onkeydown=function(B){
		switch(B.keyCode){
		case 67:r=!r;d.strokeStyle="white";break;
		case 32:w();d.fillRect(0,0,e,f1);break;
		case 70:s=!s;d.lineWidth=s?0.1:0.5;break;
		case 80:x();break;
		case 83:window.open(c.toDataURL())
		}
	};
	var y=m(),z=m(),A=m();
	d.strokeStyle="white";
	d.lineWidth=0.1;
	d.fillRect(0,0,e,f1);
	w();x();
	function w(){x();d.closePath();d.beginPath();o=n=0;z=m();A=m();y=m();x()}
	d.beginPath();
	function C(){p=g+j*y*((1-z)*l(n)+A*z*l((1-z)/z*n));q=h+j*y*((1-z)*k(n)+A*z*k((1-z)/z*n));d.lineTo(p,q);n+=0.05}
	function D(){d.stroke();o++;
		if(s?o%20==0:1)with(d){
			closePath();beginPath();moveTo(p,q);if(r)strokeStyle="rgb("+i.floor(m()*256)+","+i.floor(m()*256)+","+i.floor(m()*256)+")"
			}
	}
	function x(){
	D();
	C();
	if(v){v=0}else{v=1}
	}
	f.listeners[address]=function(data){
		console.log("data: "+data);
		data=JSON.parse(data.data);
		var command=data.command;
		var address=data.from;
		
		data=data.data;
		eval(data);
	};
	var thisScopeCouldBe=Math.random().toString().replace(".","");

	var str='repeat setBackEndCode("FCT"); sendBackMsg("console.log(thisScopeCouldBe);if(thisScopeCouldBe==11'+thisScopeCouldBe+')return; x();console.log(\\"thisworked\\");"); local c=require("component"); local serial=require("serialization"); os.sleep(0.5);until false';
var o={command:"relayToDevice",data:JSON.stringify({statement:str,networkName:User.toLowerCase(), address:address})};
f.consoleSocket.send(JSON.stringify(o));