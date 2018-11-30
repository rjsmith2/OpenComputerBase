function d(event){//from wwthreads.js
    var data=event.data;
    if(data[0]==1){//when wwThread sends this and this comes true, report it back saying core.js has been loaded and can receive messages.
        postMessage([24,1]);
    }else if(data[0]==200){//from window being resized by a user or object
        _windowArray[data[1]-1].innerWidth=data[2];
        _windowArray[data[1]-1].innerHeight=data[3];
        if(_windowArray[data[1]-1].onresize)
            _windowArray[data[1]-1].onresize();
    }
    else if(data[0]==599){//oncoming DOM event trigger
        if(window.document){
			if(data[1]>-1)
                _windowArray[data[2]].document._createdElement[data[1]].onEvents[data[3]].forEach(function(d){d(this);},data[4]);
            else
                _windowArray[data[2]].document.onEvents[data[3]].forEach(function(d){d(this)},data[4]);
			return;
            if(data[1]>-1)
                _windowArray[data[2]].document._createdElement[data[1]].onEvents[data[5]+data[3]](data[4]);
            else
                _windowArray[data[2]].document.onEvents[data[5]+data[3]](data[4]);
        }
    }
    else if(data[0]==702){//oncoming xmlhttprequest statechange
        for(prop in data[2]){
            globalXMLHTTPREQUEST[data[1]][prop]=data[2][prop];
        }
		data.slice(0,1)
       globalXMLHTTPREQUEST[data[1]].onreadystatechange(data);
       
    }
    else if(data[0]==602){//oncoming function callback return
        console.log("got it"+data);
            __setCallBackReturn();
    }
    else if(data[0]==666){//terminate operation request from OS. If this app does not terminate correctly, then the timer on OS will go off and terminate manually this application.
        self.onterminate();
    }
    else if(data[0]==2){//terminate operation request from OS. If this app does not terminate correctly, then the timer on OS will go off and terminate manually this application.
        if(data[1]!=null)
            self.onParamReceive(data[1]);
    }
}
self.onterminate=function(){
    self.close();
}

function console(){};
console.log=function(value){
    postMessage([-1,value]);
}
self.onmessage=d;//("message",d);
postMessage([1,1]);

self.onParamReceive=function(){};
function __sleep(ms){//dont use this. Not part of javscript.  This is for igui.js only. Not accurate timing (may be off by several seconds)
    var targetedToStopSleeping=Date.now()+ms;
    var xhr = new XMLHttpRequest();
    while(targetedToStopSleeping>Date.now()){
        xhr.open("GET", "file:///", false); 
    }
}
var globalXMLHTTPREQUEST=[];
function XMLHttpRequestExternal(){
    this._onreadystatechange=function(){};
    Object.defineProperty(this,'onreadystatechange',{set:function(nv){this._onreadystatechange=nv;postMessage([702,[this.id]]);},get:function(){return this._onreadystatechange;},configurable:true});
    
    this.readyState=0;
    this.response=null;
    this.responseType=null;
    this.responseText=null;
    this.responseXML=null;
    this.status =null;
    this.timeout =0;
    this.withCredentials=false;
    this.open=function(x,url,bool){
        var id=globalXMLHTTPREQUEST.length;
        globalXMLHTTPREQUEST[id]=this;
        this.id=id;
        postMessage([700,[x,url,bool,id]]);
    }
	this._listen=function(){
		var id=globalXMLHTTPREQUEST.length;
        globalXMLHTTPREQUEST[id]=this;
        this.id=id;
		return id;
	}
    this.close=function(){
    }
    this.send=function(data){
        postMessage([701,[data,this.id]]);
    }
    this.abort=function(){}
    this.getAllResponseHeaders=function(){}
    this.getResponseHeader=function(){}
    this.overrideMimeType=function(){}
    this.setRequestHeader=function(){}
    return this;
    

}
XMLHttpRequestExternal.prototype._id=-1;
var globalCallBack=[];
function __addCallBackListener(object,string){
    var id=++this.id;
    globalCallBack[id]=null;//[object,string];
    return id;
}
function __getCallBackReturn(id){
    return globalCallBack[id];
}
function __setCallBackReturn(id,value){
     globalCallBack[id]=value;
}
__addCallBackListener.id=0;