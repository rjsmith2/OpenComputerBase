var f=function(){};
f.consoleSocket=null;
f.socket=function(){
    var consoleSocket = new WebSocket("ws://andrei-rocko.rhcloud.com:8000/index.html");
    consoleSocket.f=this;
    consoleSocket.onopen=function(){
        textarea.value=("\n["+getTimeStamp()+"] ")+"Opened WebSocket Connection"+textarea.value;
        newWindow.title="Console Interface: {status: "+f.consoleSocket.readyState+"}"
    }
    consoleSocket.onclose=function(){
         textarea.value=("\n["+getTimeStamp()+"] ")+"Terminated WebSocket Connection"+textarea.value;
         var t=this.f;
         setTimeout(function(){t.consoleSocket=t.socket();},700);
         newWindow.title="Console Interface: {status: "+f.consoleSocket.readyState+"}"
    }
    consoleSocket.onmessage=function(eve){
         textarea.value=("\n\n["+getTimeStamp()+"]Server Console: ")+(eve.data)+""+textarea.value;
         newWindow.title="Console Interface: {status: "+f.consoleSocket.readyState+"}"
    }
    consoleSocket.onerror=function(eve){
         textarea.value=("\n["+getTimeStamp()+"]Connection Error: ")+eve+""+textarea.value;
         newWindow.title="Console Interface: {status: "+f.consoleSocket.readyState+"}"
    }
    f.consoleSocket=consoleSocket;
    return consoleSocket;
}
if(WebSocket!=null)
    f.socket();
var newWindow=window.open("Console Interface: {Initializing}");
newWindow.resizeTo(500,500);
var document=newWindow.document;
var textarea=document.createElement("textarea");
textarea.value="";
textarea.setAttribute("style","width:99%;height:350px;")
document.body.appendChild(textarea);
var input=document.createElement("input");
input.setAttribute("style","width:100%;");
input.inputRemembered=[];
input.iInput=input.inputRemembered.length;
input.addEventListener("keydown",function(e){
    if(13 == e.keycode){
         textarea.value=("\n["+getTimeStamp()+"] ")+""+input.value+ textarea.value;
        f.consoleSocket.send(input.value);
        input.inputRemembered.push(input.value);
        input.value="";
        input.iInput=input.inputRemembered.length;
        
        
    }
    else if(38 == e.keycode){//up
          input.value=input.inputRemembered[Math.max(--input.iInput,0)]||("NULL"+(++input.iInput)).substring(0,0);
    }
     else if(40 == e.keycode){//down
 
            input.value=input.inputRemembered[Math.min(++input.iInput,input.inputRemembered.length)]||("NULL"+(--input.iInput)).substring(0,0);
    }
    
})
document.body.appendChild(input);
function getTimeStamp(){
    
 var timeNow = new Date();
  var hours   = timeNow.getHours();
  var minutes = timeNow.getMinutes();
  var seconds = timeNow.getSeconds();
  var timeString = "" + ((hours > 12) ? hours - 12 : hours);
  timeString  += ((minutes < 10) ? ":0" : ":") + minutes;
  timeString  += ((seconds < 10) ? ":0" : ":") + seconds;
  timeString  += (hours >= 12) ? " P.M." : " A.M.";
  return timeString
}

if(!WebSocket)
textarea.value="Your browser has a bug with WebSocket. Your application may not work properly.";