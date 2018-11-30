var f=function(){};
var idleMessageTimer=40;
f.consoleSocket=null;
f.socket=function(){
    var consoleSocket = new WebSocket("ws://" + location.host + ":8000/index.html");
    consoleSocket.f=this;
    consoleSocket.onopen=function(){
       // textarea.value=("\n["+getTimeStamp()+"] ")+"Opened WebSocket Connection"+textarea.value;
        newWindow.title="Device Interface: {status: "+f.consoleSocket.readyState+"}";
    }
    consoleSocket.onclose=function(){
        // textarea.value=("\n["+getTimeStamp()+"] ")+"Terminated WebSocket Connection"+textarea.value;
         var t=this.f;
         setTimeout(function(){t.consoleSocket=t.socket();},700);
         newWindow.title="Console Interface: {status: CLOSED "+f.consoleSocket.readyState+"}"
    }
    consoleSocket.onmessage=function(eve){
     var doUpdateScroll=false;
     console.log(divTextBox.scrollHeight+" "+divTextBox.scrollTop)
     if(divTextBox.scrollHeight<=divTextBox.scrollTop+1000)doUpdateScroll=true;
        newWindow.title="Console Interface: {status: "+(f.consoleSocket.readyState)+"}";
       //console.log("Server generated:" +eve.data);
        var json=JSON.parse(eve.data);
        if(json["jsonOrigin"]){
         var id=JSON.parse(json["jsonOrigin"])["id"];
         divElementCommand[id].dataResult.textContent=(JSON.parse(json["evalData"]));
        }
        else if(json["ERROROBJECTforJSON"]){
            var id=JSON.parse(json["ERROROBJECTforJSON"])["id"];
            divElementCommand[id].dataResult.textContent=(json["error"]);
        }
        else if(json["data"]){
          divTextBox.childrenArray[++input.idCounter]=dataBarHTML(input.idCounter,getTimeStamp(),null,"server response: "+json["data"],"");
          //console.log(divTextBox.childrenArray[input.idCounter].idNum);
          divTextBox.childrenArray[input.idCounter].removeChild(divTextBox.childrenArray[input.idCounter].dataResult);
          divTextBox.childrenArray[input.idCounter].dataDisplay.setAttribute("style","background-color:lightblue;");
         // console.log(json["data"]);
        }
        //var div=dataBarHTML(json.id,getTimeStamp(),json);
        if(doUpdateScroll)
         divTextBox.scrollTop=divTextBox.scrollHeight+divTextBox.scrollTop;//not proper way do this since vidget thread doesn't do page reflow yet in this thread.
         console.log(doUpdateScroll);
         
    }
    consoleSocket.onerror=function(eve){
        
        // textarea.value=("\n["+getTimeStamp()+"]Connection Error: ")+eve+""+textarea.value;
         newWindow.title="Console Interface: {status: ERROR "+f.consoleSocket.readyState+"}"
    }
    setTimeout(function(){if(this.readyState===1)this.send(0);}.bind(consoleSocket),1000*idleMessageTimer)
    f.consoleSocket=consoleSocket;
    return consoleSocket;
}
if(WebSocket!=null)
    f.socket();
var windowOptions=[
 "Restart Server",
 "Force Echo Response",
 "Force Reconnect"
 ];
 function forceServerResponse(){
  var o={command:"evaler",data:'echo("I am forced to echo")',id:++input.idCounter}
        divTextBox.childrenArray[input.idCounter]=dataBarHTML(input.idCounter,getTimeStamp(),null,"Echoing the echo'd",JSON.stringify(o));
    f.consoleSocket.send(JSON.stringify(o));

 }
 function restartServer(){
  var o={command:"evaler",data:'process.abort()',id:++input.idCounter}
        divTextBox.childrenArray[input.idCounter]=dataBarHTML(input.idCounter,getTimeStamp(),null,"Sent Restart Command",JSON.stringify(o));
    f.consoleSocket.send(JSON.stringify(o));

 }
var newWindow=window.open("Console Interface: {Initializing}",windowOptions);
newWindow.addEventListener("message",function(msg){
 var responseID=windowOptions.indexOf(msg.toString());
 if(responseID==1) forceServerResponse();
 if(responseID==0) restartServer();
 if(responseID==2) f.socket();

});
newWindow.addEventListener("close",function(msg){
 console.log("closing");
 window.terminateAll();

});
newWindow.resizeTo(500,500);
var document=newWindow.document;
var inforBarStyleString;
doLoadThisBefore();//initalize the style (premature style support filler)



document.body.appendChild(generateDataList("commandAs",["register","install","uninstall","evaler","login","info","notify","sendJSONTo","joinNetwork"]));
var infoBar=document.createElement("div");
infoBar.setAttribute("style",inforBarStyleString);
var inputBarCommandAs=document.createElement("input");
inputBarCommandAs.value="evaler";
inputBarCommandAs.name="commandJSON";
inputBarCommandAs.list="commandAs";
infoBar.appendChild(inputBarCommandAs);
document.body.appendChild(infoBar);
document.body.setAttribute("style","height: inherit;");
var divTextBox=document.createElement("div");
divTextBox.setAttribute("style","width:99%;min-height:350px;height:90%;overflow:auto;");
divTextBox.childrenArray=[];
document.body.appendChild(divTextBox);
var gFiller=document.createElement("div");//
divTextBox.appendChild(gFiller);
var input=document.createElement("input");
input.list="rememberCommands";
input.datalistEle=generateDataList("rememberCommands",[]);
document.body.appendChild(input.datalistEle);
input.name="inputEval";
input.setAttribute("style","width:100%;");
input.inputRemembered=[];
input.iInput=input.inputRemembered.length;
input.idCounter=0;
input.addEventListener("keydown",function(e){
   
    if(13 == e.keycode){
        //textarea.value=("\n["+getTimeStamp()+"] ")+""+input.value+ textarea.value;
         //console.log("this is the prefix of sending as: "+(o));
          var sdo=input.value.replace(/[^\w\[\]`!@#$%\^&*()={}:;<>+'\\\-\.\'\"\,\s\/]/g,"");
        //input.value=input.value.replace(/[^\w\[\]`!@#$%\^&*()={}:;<>+'\\\-\.\'\"]/g,"?"); 
       
        var o={command:inputBarCommandAs.value,data:sdo,id:++input.idCounter}
        divTextBox.childrenArray[input.idCounter]=dataBarHTML(input.idCounter,getTimeStamp(),null,sdo,JSON.stringify(o));
        f.consoleSocket.send(JSON.stringify(o));
        console.log("trying");
        input.datalistEle.newOption(sdo);
        input.inputRemembered.push(sdo);
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



function doLoadThisBefore(){
inforBarStyleString="height:25px;\
background:radial-gradient(silver 45%, transparent 16%) 0 0,\
radial-gradient(black 1%, transparent 16%) 8px 8px,\
radial-gradient(rgba(255,100,100,.1) 15%, transparent 20%) 0 1px,\
radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px;\
background-size:8px 8px;\
border-bottom:1px solid black;\
background-repeat:repeat;";

commandUsedStyle="background-color: orangered;\
display: block;\
float: left;\
min-width: 80%;\
white-space:pre;\
padding: 5px;"
timeSpanStyle="background-color: beige;\
display: block;\
float: left;\
font-size:65%;"
dataResultStyle="background-color: orange;\
display: block;\
clear:both;\
padding-left:10px;\
white-space:pre;\
width:100%;"
}
var divElementCommand=[];
function dataBarHTML(id,time,jsonObject,commandUsed,JSONSentAs){
    var div=document.createElement("div");
    div.commandUsed=commandUsed;
    var timeSpan=document.createElement("span");
    timeSpan.dateCreated=getTimeStamp();
    timeSpan.textContent=getTimeStamp();
    var dataDisplay=document.createElement("span");
    div.dataDisplay=dataDisplay;
    dataDisplay.textContent=commandUsed;
    dataDisplay.commandUsed=commandUsed;
    dataDisplay.jsonStringOutput=JSONSentAs;
    dataDisplay.addEventListener("click",function(){}.bind(div));
    timeSpan.setAttribute("style",timeSpanStyle);
    dataDisplay.setAttribute("style",commandUsedStyle);
    var dataResult=document.createElement("div");
    dataResult.textContent="[Fetching...]";
    dataResult.setAttribute("style",dataResultStyle);
    div.dataResult=dataResult;
    div.appendChild(timeSpan);
    div.appendChild(dataDisplay);
    div.appendChild(dataResult);
    divTextBox.appendChild(div,gFiller);
    divElementCommand[id]=div;
    
    dataDisplay.toggle=0;
    dataDisplay.addEventListener("dbclick",function(){
     if(this.toggle)
       this.textContent=this.commandUsed;
     else
      this.textContent=this.jsonStringOutput;
      this.toggle!=this.toggle;
    }.bind(dataDisplay))
    return div;
    
}


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