var win=window.open();

var document=win.document;
var test=document.createElement("div");
var notificationBarHeight="37px";
document.body.appendChild(test);
notifyUser=function(str,color){
    
    var createElementd=document.createElement("div");
    createElementd.textContent=str;
	if(color)
		createElementd.style.backgroundColor=color;//(Math.random()*2100|0)+"px "+(Math.random()*400|0)+"px";
    //createElementd.style.height=notificationBarHeight;
    createElementd.className="animated lightSpeedIn";
    document.body.insertBefore(createElementd,document.body.childNodes[0]);
    
};
notifyUser("Pardon my ê¤*sA.:æ user interface, its still work in progress by my maker!");
notifyUser("Welcome to Jalopeno Central Station, where all of your glorious OpenComputers devices meet their maker all at once.");

//setInterval(function(){importScripts("http://numbersapi.com/"+(Math.random()*2100|0)+"/math?callback=tester");},5500);
//importScripts("http://numbersapi.com/+(Math.random()*2100|0)+/math?callback=tester");

/*
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	    console.log("trying"+this.readyState);
		if (this.readyState == 4) {
		    console.log(this.response);
		}
	};

   xhr.open("GET", "http://numbersapi.com/42/math?callback=tester", true);
   */
   
var f=function(){};
var idleMessageTimer=40;
f.consoleSocket=null;
notifyUser(User+" logging in personal hub station");

var f=function(){};
f.consoleSocket=null;
f.socket=function(){
    var consoleSocket = new WebSocket("ws://"+location.host+":8000/index.html");
    consoleSocket.f=this;
    consoleSocket.onopen=function(){
       // textarea.value=("\n["+getTimeStamp()+"] ")+"Opened WebSocket Connection"+textarea.value;
        var o={command:"joinNetwork",data:JSON.stringify({networkName:User.toLowerCase()})};
		this.send(JSON.stringify(o));
		networkJoined={};
		//while(userList.childNodes.length)
		  //  userList.removeChild(userList.childNodes[userList.childNodes.length-1]);
    }
    consoleSocket.onclose=function(){
        // textarea.value=("\n["+getTimeStamp()+"] ")+"Terminated WebSocket Connection"+textarea.value;
         var t=this.f;
         setTimeout(function(){t.consoleSocket=t.socket();},700);
    }
    consoleSocket.onmessage=function(eve){
	 var json=JSON.parse(eve.data);
 
     if(json.errorCatched)console.log(json.evalData);
     if(json.data){
     	var data=JSON.parse(json.data).data;
     	var type=JSON.parse(json.data).command;
     	//console.log("daata "+JSON.stringify(JSON.parse(json.data)));
     	
     	var doUpdateScroll=false;
     	switch(type){
     	    case "deviceOnline":
     	      if(data.json){
     	          var from=data.from;
     	          //console.log("data as string/object as follow: ");
     	         // console.log(data.json);
     	        var dataFromOthers=data.json||JSON.parse(data.json);
				var message=JSON.parse(dataFromOthers.message);;
     	        notifyUser(( dataFromOthers.dateCreated||getTimeStamp())+": "+message, "#363");
             	//d.textContent=(getTimeStamp(dataFromOthers.dateCreated)||getTimeStamp())+" "+from+": "+dataFromOthers.message;
     	      }
			  break;
			 case "deviceOffline":
     	      if(data.json){
     	          var from=data.from;
     	          //console.log("data as string/object as follow: ");
     	         // console.log(data.json);
     	        var dataFromOthers=data.json||JSON.parse(data.json);
				var message=JSON.parse(dataFromOthers.message);;
     	        notifyUser(( dataFromOthers.dateCreated||getTimeStamp())+": "+message, "#663");
             	//d.textContent=(getTimeStamp(dataFromOthers.dateCreated)||getTimeStamp())+" "+from+": "+dataFromOthers.message;
     	      }
			   break;
			   case "deviceRegistered":
     	      if(data.json){
     	          var from=data.from;
     	          //console.log("data as string/object as follow: ");
     	         // console.log(data.json);
     	        var dataFromOthers=data.json||JSON.parse(data.json);
				var message=JSON.parse(dataFromOthers.message);;
     	        notifyUser(( dataFromOthers.dateCreated||getTimeStamp())+": "+message, "#363");
             	//d.textContent=(getTimeStamp(dataFromOthers.dateCreated)||getTimeStamp())+" "+from+": "+dataFromOthers.message;
     	      }
     	    break;
     	    case "joiner":
     	        var from=data.from;
     	       
             	if(networkJoined[data.from])return;
     	    break;
     	    case "unjoiner":
     	        var from=data.from;
             	//if(networkJoined[from])
             	   //userList.removeChild(networkJoined[from]);
        
     	    break;
     	    case "networkUserList":
     	           for(var i=data.message.length;--i>=0;){
     	               var d=document.createElement("div");
     	               	if(networkJoined[data.message[i]])continue;
                     
                     
     	           }
     	        
     	    break;
     	}
     
     	
     }
    }
    consoleSocket.onerror=function(eve){
       
    }
    setTimeout(function(){if(this.readyState===1)this.send(0);}.bind(consoleSocket),1000*40)
    f.consoleSocket=consoleSocket;
    return consoleSocket;
}
var isWebsocketEnabled="WebSocket" in self;
if(!isWebsocketEnabled)WebSocket=function(){};//dont run websocket
else f.socket();
if(!isWebsocketEnabled)return window.open("Your browser does not support WebSocket properly. Consider updating your browser.").resizeTo(750,50);


function getTimeStamp(date){
    date=date||new Date();
 var timeNow = new Date(date);
  var hours   = timeNow.getHours();
  var minutes = timeNow.getMinutes();
  var seconds = timeNow.getSeconds();
  var timeString = "" + ((hours > 12) ? hours - 12 : hours);
  timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
  timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
  timeString  += (hours >= 12) ? " P.M." : " A.M.";
  return "["+timeString+"] ";
}