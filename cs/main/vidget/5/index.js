var f=function(){};
var idleMessageTimer=40;
f.consoleSocket=null;


var f=function(){};
f.consoleSocket=null;
f.socket=function(){
    var consoleSocket = new WebSocket("ws://"+location.host+":8000/index.html");
    consoleSocket.f=this;
    consoleSocket.onopen=function(){
       // textarea.value=("\n["+getTimeStamp()+"] ")+"Opened WebSocket Connection"+textarea.value;
        var o={command:"joinNetwork",data:JSON.stringify({networkName:"defaultRoom"})};
        console.log(JSON.stringify(o));
		this.send(JSON.stringify(o));
		networkJoined={};
		while(userList.childNodes.length)
		    userList.removeChild(userList.childNodes[userList.childNodes.length-1]);
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
     	console.log("daata "+JSON.stringify(JSON.parse(json.data)));
     	
     	var doUpdateScroll=false;
        if(hr.scrollHeight<=hr.scrollTop+1000)doUpdateScroll=true;
     	switch(type){
     	    case "sendJSON":
     	      if(data.json){
     	          var from=data.from;
     	          console.log("data as string/object as follow: ");
     	          console.log(data.json);
     	        var dataFromOthers=data.json||JSON.parse(data.json);
     	        var d=document.createElement("div");
             	d.textContent=(getTimeStamp(dataFromOthers.dateCreated)||getTimeStamp())+" "+from+": "+dataFromOthers.message;
             	hr.appendChild(d);
             	d.style.boxShadow="0px 0px 1px 1px white";
             	setTimeout(function(){d.style.boxShadow="0px 0px 1px 1px gray";setTimeout(function(){d.style.boxShadow=""},150)},150);
     	      }
     	    break;
     	    case "joiner":
     	        var from=data.from;
     	        var d=document.createElement("div");
             	d.textContent=getTimeStamp()+from+" has joined the network";
             	hr.appendChild(d);
             	if(networkJoined[data.from])return;
             	d=document.createElement("div");
                d.textContent=data.from;
                userList.appendChild(d);
                networkJoined[data.from]= d;
     	    break;
     	    case "unjoiner":
     	        var from=data.from;
     	        var d=document.createElement("div");
             	d.textContent=getTimeStamp()+from+" has left the network";
             	if(networkJoined[from])
             	    userList.removeChild(networkJoined[from]);
             	hr.appendChild(d);
     	    break;
     	    case "networkUserList":
     	           for(var i=data.message.length;--i>=0;){
     	               var d=document.createElement("div");
     	               	if(networkJoined[data.message[i]])continue;
                     	d.textContent=data.message[i];
                     	userList.appendChild(d);
                     	networkJoined[data.message[i]]= d;
     	           }
     	        
     	    break;
     	}
     	if(doUpdateScroll)
         hr.scrollTop=hr.scrollHeight+hr.scrollTop;
     	
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

var composeBarinforBarStyleString,pattern1;
var win=window.open("Is this the changelog or the chat room?");
doLoadThisBefore();
win.resizeTo(750,750);

var networkJoined={};
var document=win.document;
document.body.setAttribute("style","height: inherit;background:linear-gradient(45deg, #8bd 25%,\
    #8bf 25%, #8bf 50%, \
    #8bd 50%, #8bd 75%, \
   #8bf 75%);\
   background-size:50px 50px;\
	background-repeat:repeat;");
   
var composing=document.createElement("div");
composing.style.backgroundPosition="1px 1px";
document.body.appendChild(composing);
var textAreaCompose=document.createElement("textarea");
textAreaCompose.setAttribute("style","margin-right:auto;margin-left:auto;width:80%;display:block;height:30%;resize:none;margin-bottom:10px;")
composing.appendChild(textAreaCompose);

var input=textAreaCompose;
input.list="rememberCommands";
input.datalistEle=generateDataList("rememberCommands",[]);
document.body.appendChild(input.datalistEle);
input.name="sendMessage";
input.idCounter=0;
input.addEventListener("keydown",function(e){
   
    if(13 == e.keycode){
        var o={command:"sendJSONTo",data:JSON.stringify({networkName:"defaultRoom",json:{message:input.value,dateCreated:new Date()}})}
		 f.consoleSocket.send(JSON.stringify(o));
		 console.log("test "+JSON.stringify(o));
        input.value="";
        
    }
    
})

var hr=document.createElement("div");
hr.style.overflow="auto";
hr.style.height="80%";
hr.style.padding="1%";
hr.style.cssFloat=hr.style.float="left";
hr.style.width="78%";
hr.style.backgroundColor="rgba(120,50,90,0.64)";
document.body.appendChild(hr);
var userList=document.createElement("div");
userList.style.overflow="auto";
userList.style.height="80%";
userList.style.cssFloat=userList.style.float="left";
userList.style.width="20%";
userList.style.backgroundColor="rgba(220,120,0,0.74)";
document.body.appendChild(userList);
function generateDataList(IDName,arrayValues){
var datalist=document.createElement("datalist");
datalist.listValues={};
 arrayValues.forEach(function(d){
   var option=document.createElement("option");
   option.value=d;
   datalist.listValues[d]=option;
   datalist.appendChild(option);
  
 });
 
datalist.id=IDName;

datalist.newOption=function(msg){
 if(this.listValues[msg])return;
 var opt=document.createElement("option");
 opt.value=msg;
 this.listValues[msg]=opt;
 this.appendChild(opt);
 
}
return datalist;

}

function doLoadThisBefore(){};
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

