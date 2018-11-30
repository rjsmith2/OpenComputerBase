importScripts('main/vidget/7/iguiComponent.js');
var socketerCounter=0;
var f=function(){};
f.consoleSocket=null;
doFunction={};

f.socket=function(){
    var consoleSocket = new WebSocket("ws://" + location.host + ":8000/index.html");
    consoleSocket.fz=this;
    consoleSocket.onopen=function(){
		getDeviceList();
		var o={command:"joinNetwork",data:JSON.stringify({networkName:User.toLowerCase()})};
		this.send(JSON.stringify(o));
		networkJoined={};
    }
    consoleSocket.onclose=function(){
	   	setTimeout(function(){
			socket=f.socket();
		},500);
    }
    consoleSocket.onmessage=function(eve){
    	var json=JSON.parse(eve.data);
    	if(json.id) this.arrFunct[json.id](json["data"]);
		
		var innerJSON=JSON.parse(json.data);
		var command=innerJSON.command;
    	if(doFunction[command])doFunction[command](json);
     }
    consoleSocket.onerror=function(eve){
    	console.log("socket error main");
    }
    consoleSocket.arrFunct=[];
	consoleSocket.sendListen=function(data,callBack){
		data["idc"]=++socketerCounter;
		this.arrFunct[socketerCounter]=callBack;
		this.send(JSON.stringify(data));
		return prevFunctionSearch;
	}
    f.consoleSocket=consoleSocket;
    
    return consoleSocket;
}
var isWebsocketEnabled="WebSocket" in self;
if(!isWebsocketEnabled)WebSocket=function(){};//dont run websocket
else socket=f.socket();
if(!isWebsocketEnabled)return window.open("Your browser does not support WebSocket properly").resizeTo(750,50);
setInterval(function(){socket.send(0)},30000);

var win=window.open("My Devices");
win.resizeTo(300,500);
var document=win.document;
document.body.style.height="inherit";
document.body.style.width="inherit";
var searchBar=document.createElement("input"); 
searchBar.type="text";
searchBar.placeholder="Filter...";
var searchTimer=0;
searchBar.oldValue=null;
var prevFunctionSearch=0;

searchBar.addEventListener("keyup",getDeviceList)
document.body.appendChild(searchBar);

var searchBox=document.createElement("div");
document.body.appendChild(searchBox);
searchBox.style.height="92%"
searchBox.style.overflow="auto"
 var counter=0;
function processDeviceListFromServer(data){
		data=JSON.parse(data);
		var command=data.command;
		data=data.data;
		var address=data.message;
		if(command=="listDevices"){
			
			var newChild=document.createElement("div");
			newChild.className="animated bounceIn searchBoxResult";
			newChild.textContent=data.message;
			
			var terminal=document.createElement("span");
			terminal.textContent="[TERMINAL] ";
			terminal.addEventListener("click",function(){
				openConnectionToDevice(this);
			}.bind(address));
			
			var inspect=document.createElement("span");
			inspect.textContent="[MORE] ";
			 inspect.addEventListener("click",function(){
				openDeviceFeatures(this);
				loadComponentFrom(data.message);
				loadJSProgramsFrom(data.message);
			}.bind(address))
			newChild.appendChild(terminal);
			newChild.appendChild(inspect);
			var subText=document.createElement("div");
			subText.textContent= "--------------";

			newChild.appendChild(subText);
			searchBox.appendChild(newChild);
			++counter;
		}
     }

function getDeviceList(){
    var o={command:"listDevices",data:JSON.stringify({deviceAddress:searchBar.value,networkName:User.toLowerCase()})}
   
    win.title="Herobrines n Machines "
    for(var i=searchBox.childNodes.length;--i>=0;){
        searchBox.removeChild(searchBox.childNodes[i]);
    }
    if(searchTimer)
        clearTimeout(searchTimer);
    searchBar.oldValue=searchBar.value;
    searchTimer=setTimeout(function(){
	if(f.consoleSocket.arrFunct[prevFunctionSearch])
		f.consoleSocket.arrFunct[prevFunctionSearch]=function(){};
     prevFunctionSearch=socket.sendListen(o,processDeviceListFromServer);
    },400);
}
doFunction["deviceEvalThis"]=function(data){
		data=JSON.parse(data.data);
		var command=data.command;
		var address=data.from;
		
		data=data.data;
		console.log(JSON.parse(data.json).join(""));
	new self.orgFunct("address","newComponent", "listNewFunction","newJSProgram","giveSourceCode", (JSON.parse(data.json).join("")))
								(address,newComponent,listNewFunction,newJSProgram,giveSourceCode)
	
};
doFunction["deviceOnline"]=getDeviceList;
doFunction["deviceOffline"]=getDeviceList;
var divElementCommand=[];
deviceMessageEventListener={};
function openConnectionToDevice(address){
	if(!deviceMessageEventListener[address])deviceMessageEventListener[address]=[];
	var windowOptions=[
	 "Refresh",
	 ];

	var win=window.open("Terminal-"+address,windowOptions);
		 win.addEventListener("message",function(msg){
 var responseID=windowOptions.indexOf(msg.toString());
 if(responseID==0) loadComponentFrom(this);

}.bind(address));
	win.resizeTo(700,500);
	var document=win.document;
	var inforBarStyleString;


	document.body.appendChild(generateDataList("commandAs",["register","install","uninstall","evaler","login","info","notify","sendJSONTo","joinNetwork"]));
	var infoBar=document.createElement("div");
	infoBar.setAttribute("class","inforBarStyleString");
	var inputBarCommandAs=document.createElement("input");
	inputBarCommandAs.value="";
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
	win.divTextBox=divTextBox;
	win.gFiller=gFiller;
	var input=document.createElement("input");
	input.list="rememberCommands";
	input.datalistEle=generateDataList("rememberCommands",[]);
	document.body.appendChild(input.datalistEle);
	input.name="inputEval";
	input.setAttribute("style","width:100%;");
	input.inputRemembered=[];
	input.iInput=input.inputRemembered.length;
	input.idCounter=0;
	win.address=address;
	input.addEventListener("keydown",function(e){
	   
		if(13 == e.keycode){
			//textarea.value=("\n["+getTimeStamp()+"] ")+""+input.value+ textarea.value;
			 //console.log("this is the prefix of sending as: "+(o));
			  var sdo=input.value.replace(/[^\w\[\]`!@#$%\^&*()={}:;<>+'\\\-\.\'\"\,\s\/]/g,""); //to escape the hidden characters that is somehow getting generated by users.  (copying n paste from skype into this input can trigger this behavior for example)
			//input.value=input.value.replace(/[^\w\[\]`!@#$%\^&*()={}:;<>+'\\\-\.\'\"]/g,"?"); 
		   
			var o={command:"relayToDevice",data:JSON.stringify({statement:sdo,networkName:User.toLowerCase(), address:this.address}),id:++input.idCounter};
			f.consoleSocket.send(JSON.stringify(o));
			var lastChild=divTextBox.childrenArray[input.idCounter]=this.dataBarHTML(input.idCounter,getTimeStamp(),null,"> "+sdo,JSON.stringify(o));
			
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
		

	


	}.bind(win));
	win.incomingMessageFromDevice=function(eve){
		 var doUpdateScroll=false; 
		 if(this.divTextBox.scrollHeight<=this.divTextBox.scrollTop+3000)doUpdateScroll=true;
		   //console.log("Server generated:" +eve.data);
		   var message=eve.data.message;
		   for (var i=0;i<message.length;i++){
				var newEle=this.dataBarHTML(-1,getTimeStamp(),null,"< "+message[i],"");
			}
			//this.divTextBox.appendChild(newEle,this.gFiller);
			return;//
			//var div=dataBarHTML(json.id,getTimeStamp(),json);
			if(doUpdateScroll)
			 divTextBox.scrollTop=divTextBox.scrollHeight+divTextBox.scrollTop;//not proper way do this since vidget thread doesn't do page reflow yet in this thread.
			 
	}.bind(win)
	deviceMessageEventListener[address].push(win.incomingMessageFromDevice);
	document.body.appendChild(input);

	win.dataBarHTML=function(id,time,jsonObject,commandUsed,JSONSentAs){
		var div=document.createElement("div");
		div.commandUsed=commandUsed;
		var timeSpan=document.createElement("span");
		timeSpan.dateCreated=getTimeStamp();
		timeSpan.textContent=getTimeStamp();
		var dataDisplay=document.createElement("span");
		div.dataDisplay=dataDisplay;
		dataDisplay.textContent=commandUsed;
		dataDisplay.commandUsed=commandUsed;
		dataDisplay.jsonStringOutput="";//JSONSentAs;
		dataDisplay.addEventListener("click",function(){}.bind(div));
		timeSpan.setAttribute("class","timeSpanStyle");
		dataDisplay.setAttribute("class","commandUsedStyle");
		var dataResult=document.createElement("div");
		dataResult.textContent="[Fetching...]";
		dataResult.setAttribute("class","dataResultStyle");
		div.dataResult=dataResult;
		div.appendChild(timeSpan);
		div.appendChild(dataDisplay);
		//div.appendChild(dataResult);
		this.divTextBox.appendChild(div,this.gFiller);
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
	return document;
}
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

function sendToDevice(address,value){

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

function deviceReturningMessage(json){
	var data=JSON.parse(json.data);
	var address=data.from;
	if(!address)return console.log("NO ADDRESS FROM THIS MACHINE! ABORT ABORT ABORT");
	if(!deviceMessageEventListener[address]) return;
	var eventListeners=deviceMessageEventListener[address];
	for (i=0;i<eventListeners.length;i++){
		eventListeners[i](data);
	};
  }
doFunction["deviceMessage"]=deviceReturningMessage;

var devices={}
function loadComponentFrom(address){
if(!devices[address])devices[address]={};
devices[address].component={}
var str='setBackEndCode("FCT"); for k, v in pairs(require("component").list()) do sendBackMsg("newComponent(\\"'+address+'\\",\\""..k.."\\",".."\\""..v.."\\");") end';
var o={command:"relayToDevice",data:JSON.stringify({statement:str,networkName:User.toLowerCase(), address:address})};
f.consoleSocket.send(JSON.stringify(o));
}
function newComponent(address,partAddress,name){//usually from ingame devices
if(!name)return;
if(!devices[address] || !devices[address].component) return;


if(!featureWindow || !featureWindow[address])return;
	if(!devices[address].component[name]){
		var part=featureWindow[address].windowView.components.addDirectory(name);
		
		part.deviceContainer=devices[address];
		part[partAddress]=part.addDirectory(partAddress);
		devices[address].component[name]={};
		devices[address].component[name]["part"]=part;
		part[partAddress].parentNode.addEventListener("click",function(){loadFunctionListFromPart(this[0],this[1])}.bind([address,partAddress]));
	}else{
		var part =devices[address].component[name]["part"];
		
		part[partAddress]=part.addDirectory(partAddress);
		part[partAddress].parentNode.addEventListener("click",function(){loadFunctionListFromPart(this[0],this[1])}.bind([address,partAddress]));
	}
}
function loadJSProgramsFrom(address){
if(!devices[address])devices[address]={};
devices[address].jsProgram={}
var str='setBackEndCode("FCT"); for k in require("filesystem").list("Jalopeno") do sendBackMsg("newJSProgram(\\"'+address+'\\",\\""..k.."\\");") end';
var o={command:"relayToDevice",data:JSON.stringify({statement:str,networkName:User.toLowerCase(), address:address})};
f.consoleSocket.send(JSON.stringify(o));
}
var programSourceCode={};
function giveSourceCode(address,fileName,code){
featureWindow[address].currentCode=code;
featureWindow[address].jsProgramsOption.style.display= "block";
featureWindow[address].jsProgramsOption.textBox.textContent=code;
}
function newJSProgram(address,programName){
if(!devices[address]) return;
if(!featureWindow || !featureWindow[address])return;
var program=featureWindow[address].windowView.programs.addDirectory(programName);
program.parentNode.addEventListener("click",function(){
	var address=this[0];
	resetMainScreen(featureWindow[address]);
	featureWindow[address].jsProgramsOption.style.display="block";
	featureWindow[address].jsProgramsOption.textBox.textContent="Fetching its content...";
	var str='setBackEndCode("FCT"); local c=require("component"); local serial=require("serialization"); sendBackMsg("giveSourceCode(\\"'+address+'\\",\\"'+this[1]+'\\","..string.format("%q", getFile("Jalopeno/'+this[1]+'"))..")");';
	var o={command:"relayToDevice",data:JSON.stringify({statement:str,networkName:User.toLowerCase(), address:address})};
	f.consoleSocket.send(JSON.stringify(o));
}.bind([address,programName]));
}
var outputTextareaScreen={};
function loadFunctionListFromPart(address,partAddress){
outputTextareaScreen[partAddress]="";
if(!devices[address] || !devices[address].component) return;
var str='setBackEndCode("FCT"); local c=require("component"); local serial=require("serialization"); for k, v in pairs(c.proxy(\"'+partAddress+'\")) do if type(v)=="table" then sendBackMsg("listNewFunction(\\"'+address+'\\",\\"'+partAddress+'\\",\\""..k.."\\",".."\\""..(c.doc(v.address,v.name) or v.name).."\\");") end end';
var o={command:"relayToDevice",data:JSON.stringify({statement:str,networkName:User.toLowerCase(), address:address})};
f.consoleSocket.send(JSON.stringify(o));
}

function listNewFunction(address,partAddress,functionName,functionDesc){
resetMainScreen(featureWindow[address]);
if(outputTextareaScreen[partAddress]==null)return console.log("FAILED");
outputTextareaScreen[partAddress]+="\n\r"+functionName+":"+functionDesc;
featureWindow[address].textArea.value=outputTextareaScreen[partAddress];
featureWindow[address].textArea.style.display="block";
}
var featureWindow={};
function resetMainScreen(win){
win.textArea.style.display="none";
win.jsProgramsOption.style.display="none";
}
function openDeviceFeatures(address){
var windowOptions=[
	 "Refresh",
	 ];

	var win=window.open("Features-"+address,windowOptions);
	featureWindow[address]=win;
	win.resizeTo(700,500);
	var document=win.document;
	
	 windowView=iguiComponents.create.directoryTreeWithDisplayPanel(document);
	
	 var textArea= document.createElement("textarea");
	 textArea.className="textareaPanel";
	 textArea.readOnly=true;
	 textArea.style.display="none";
	
	 
	 var jsProgramsOption= document.createElement("div");
	 jsProgramsOption.currentCode="";
	 jsProgramsOption.className="";
	 jsProgramsOption.readOnly=true;
	 jsProgramsOption.style.display="none";
	 
	 var textBox=document.createElement("div");
	 jsProgramsOption.textBox=textBox;
	 var executeCode=document.createElement("button");
	 executeCode.textContent="Execute";
	 executeCode.addEventListener("click",function(){
		eval(featureWindow[address].currentCode);
	 });
	 var editCode=document.createElement("button");
	 editCode.textContent="Edit";
	 var editorCodeBar=document.createElement("div");
	  var updateCode=document.createElement("button");
	 updateCode.textContent="Update";
	 jsProgramsOption.appendChild(executeCode);
	 jsProgramsOption.appendChild(editCode);
	 jsProgramsOption.appendChild(textBox);
	 editorCodeBar.appendChild(updateCode);
	 windowView.editorCodeBar=editorCodeBar;
	 windowView.panelView.appendChild(jsProgramsOption);
	 
	  windowView.panelView.appendChild(textArea);
	  
	 win.textArea=textArea;
	 win.jsProgramsOption=jsProgramsOption;
	 win.windowView=windowView;
	var components= windowView.directoryTreeView.addDirectory("Components");
	windowView.components=components;
    var programs= windowView.directoryTreeView.addDirectory("Programs");
	windowView.programs=programs;
    var eeprom= windowView.directoryTreeView.addDirectory("EEPROM");
	var status= windowView.directoryTreeView.addDirectory("Status");
	win.components=components;
	//programs.addDirectory("test");
	var div=document.createElement("div");
    document.appendChild(windowView);
	 win.addEventListener("message",function(msg){
			 var responseID=windowOptions.indexOf(msg.toString());
			 if(responseID==0) { loadComponentFrom(this[0]);
				loadJSProgramsFrom(this[0]);
				this[1].reset();
				this[2].reset();
			 }

	}.bind([address,components,programs]));
}
//for FEATURES
/*
It must relay commands to device and learn its components first.
list all js files in Jalopeno as possible execution files for clients inbrowser.
Will open Jalopeno/start.js in the webbrowser. You now can interact with the device using the GUI.
JalopenoStart.js must relay commands to the device using address and proxy. Device must remain responsive to terminal so Jalopeno/start.js can not render it inaccessible. If so, is a bug then.

If Jalopeno/start.js exists, add it as an option to launch it. if function JalopenoStart exists, add it as an option.
Add execute script as an option. Useful for pastebining
*/

