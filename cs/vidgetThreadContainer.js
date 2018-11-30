(function(){
	if(!self.run)self.run=1;
	else return;
	importScripts("vidgetThreadAPI.js");
	importScripts("vidgetUserAccountity.js");
	getAllStylePropertySupportedByThisBrowser=[];//probably should set this as uneditable/final/freeze/unconfigurable
	self.onmessage=function(eve){
		
		var d=eve.data;
		var idEventType=d[0];
		var data=d[1];
		switch(idEventType){
		case "ini":
			getAllStylePropertySupportedByThisBrowser=d[1];
		break;
		case 0://load and run vidget code
			createVidgetIsolatedClass(data[0],data[1],data[2]);
		break;
		case 599:
			__windowCounter[d[1]].windows[d[3]].d(eve,__windowCounter[d[1]].windows[d[3]].scope);//d(eve);
		break;
		case 600:
			var id=d[1].split(",");
			__windowCounter[id[0]].windows[id[1]].d(eve,__windowCounter[id[0]].windows[id[1]].scope);//d(eve);
		break;
		case 1599:
			__windowCounter[d[1]].windows[d[2]].d(eve,__windowCounter[d[1]].windows[d[2]].scope);//d(eve);
		break;
		
		case 1598:
			__windowCounter[d[1]].windows[d[2]].d(eve,__windowCounter[d[1]].windows[d[2]].scope);
			//__windowCounter[d[1]].windows[d[2]].d.window.terminateAll();
		break;
		case 2000:
			__windowCounter[d[1]].User.callBackTrigger(eve.data);
			//__windowCounter[d[1]].windows[d[2]].d.window.terminateAll();
		break;
		
		}
	}
	self.orgFunct=Function;
	Function=function(vidgetWindow,d,document,setTimeout,setInterval,clearTimeout,clearInterval,User,script){//immunized
		return self.orgFunct(vidgetWindow,d,document,setTimeout,setInterval,clearTimeout,clearInterval,User,script);
	}
	self.appProcessNum=0;
	function createVidgetIsolatedClass(vidgetScript,PID,user){
	//to do: don't let them access self global variable.  They must use vidget API.
	//to do: don't let them bypass the isolated variable scoping
	//EDITED:They can create them for now that each thread can have multiple vidgets. To do: dont let them create webworker; Only mainthread can create them.  
	//to do: dont let them modify postMessage arguments;
	//don't let them use postMessage.
	//don't let them use _setIntervalOLD/ _setTimeoutOld
	//don't let them use _clearInterval/timeotu
	//eval must be modified.
		try {//throw error before running first if it exists.
				new Function("window","d","document","setTimeout","setInterval","clearTimeout","clearInterval","User","(function(d,ds,da,de,dq,du){"+vidgetScript+"\n})")(); 
		} catch (e) {
			if (e instanceof SyntaxError) {
				 throw Error("+vidget:  "+e + " in line "+(e.lineNumber-23)+"\n\n");//make sure it matches with self.orgFunct line;
			}
			
		}
		//self[''+PID]=new Function("return (function(){ this.eventHandler=d;   var self=null; var vidgetObject={}; Object.defineProperty(vidgetObject,'vidgetAppId',{value:'"+PID+"'}); Object.defineProperty(vidgetObject,'_vidgetAppProcessNum',{value:"+self.appProcessNum+"});  var vidgetWindow=_window(vidgetObject.vidgetAppId,vidgetObject); Object.defineProperty(vidgetObject,'_windowObject',{value:vidgetWindow}); if(! this.scope)this.scope={};this.scope['"+PID+"']=vidgetObject;   "+vidgetScript+"; return this;})()")();
			var vidgetObject={}; 
			Object.defineProperty(vidgetObject,'vidgetAppId',{value:''+PID});
			Object.defineProperty(vidgetObject,'_vidgetAppProcessNum',{value:''+this.appProcessNum}); 
			var lWindow=new window;
			lWindow.PID=PID;
			lWindow.isActive=true;
			var lUser=new userSystem(PID);
			lUser.PID=PID;
			lWindow.User=lUser;
			lWindow.terminateAll=function(){
				this.setTimeout=function(){};
				this.setInterval=function(){};//we could redeclare this back to origial
				this._setInterCounter.forEach(function(d){clearInterval(d);});
				this._setInterCounter=[];
				lWindow.isActive=false;
				console.log("FORCE TO KILL");
			};
			lWindow.scope=vidgetObject;
			lWindow._setTimeoutCounter=[];
			lWindow._setInterCounter=[];
			lWindow.setTimeout=function(functiond,timer,binder){
				this._setTimeoutCounter.push(_setTimeoutOLD(functiond,timer,binder));
				return this._setTimeoutCounter.length-1;};
			lWindow.setInterval=function(functiond,timer,binder){
				this._setInterCounter.push(_setIntervalOLD(functiond,timer,binder));
				return this._setInterCounter.length-1;};
			lWindow.clearTimeout=function(i){_clearTimeoutOld(this._setTimeoutCounter[i]);};
			lWindow.clearInterval=function(i){_clearInterval(this._setInterCounter[i]);};
			
			//lWindow.id=self.appProcessNum++;
			Function("window","d","document","setTimeout","setInterval","clearInterval","clearTimeout","User",vidgetScript)(lWindow,null,null,lWindow.setTimeout.bind(lWindow),lWindow.setInterval.bind(lWindow),lWindow.clearInterval.bind(lWindow),lWindow.clearTimeout.bind(lWindow),user);
			/*vidgetObject._windowObject=_window(vidgetObject.vidgetAppId,vidgetObject); 
		self[''+PID]={
			eventHandler:d,	
			PID:PID,	
			scope:vidgetObject,
			script:Function("vidgetWindow",vidgetScript)(vidgetObject._windowObject),
			_windowArray:vidgetObject._windowObject._windowArray
		};
		*/
		/*var vidgetObject={}; 
		Object.defineProperty(vidgetObject,'vidgetAppId',{value:PID});
		Object.defineProperty(vidgetObject,'_vidgetAppProcessNum',{value:self.appProcessNum}); 
		var vidgetWindow=_window(vidgetObject.vidgetAppId,vidgetObject);
		Object.defineProperty(vidgetObject,'_windowObject',{value:vidgetWindow}); 
		self[''+PID].script=function(vidgetWindow){new Function("vidgetWindow","return (function(vidgetWindow){var self=null;   "+vidgetScript+"; return this;})(vidgetWindow)")(vidgetWindow)}(vidgetWindow);
		self[''+PID].eventHandler=d;		
		self[''+PID].scope=vidgetObject; //console.log("hello wordl"+self[PID].eventHandler);
		*/
		//self.appProcessNum++;
		
	}
})(self.run);
_setTimeoutOLD=setTimeout;//tho functions below are not tested yet
setTimeout=function(){};
_setIntervalOLD=setInterval;
setInterval=function(){};
_clearTimeoutOld=clearTimeout
clearTimeout=function(){};
_clearInterval=clearInterval
clearInterval=function(){};
function simulatedSetTimeout(functiond,timer,binder){
	if(!this.isActive)return;
	this.setTimeout(functiond.bind([this,binder]),timer);
// this is used to prevent scripts that are deleted/closed/terminated from running in loop
// also, don't let vidgets clear/abort others that aren't created by them
	
}
function simulatedSetInterval(functiond,timer,binder){
	if(!this.isActive)return this._setInterCounter.forEach(function(d){clearInterval(d);});
	console.log("trying");
	this.setInterval(functiond.bind([this,binder]),timer);
// this is used to prevent scripts that are deleted/closed/terminated from running
// also, don't let vidgets clear/abort others that aren't created by them
	
}
function simulatedClearTimeout(i){
	this.clearTimeout(i);
// this is used to prevent scripts that are deleted/closed/terminated from running in loop
// also, don't let vidgets clear/abort others that aren't created by them
	
}
function simulatedClearInterval(functiond,timer,binder){
	this.clearInterval(i);
// this is used to prevent scripts that are deleted/closed/terminated from running
// also, don't let vidgets clear/abort others that aren't created by them
	
}