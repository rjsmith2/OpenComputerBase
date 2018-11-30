var postMessageOrg=postMessage;
_windowArray=[];
function d(event,vidgetObject){
    var data=event.data;
    if(data[0]==1){//when sends this and this comes true, report it back saying this has been loaded and can receive messages.
        postMessage([24,1]);
    }else if(data[0]==200){//from window being resized by a user or object
	postMessage([-1,0,"got it"]); 
	
        vidgetObject._windowArray[data[1]-1].innerWidth=data[2];
        vidgetObject. _windowArray[data[1]-1].innerHeight=data[3];
        if( vidgetObject._windowArray[data[1]-1].onresize)
             vidgetObject._windowArray[data[1]-1].onresize();
    }
    else if(data[0]==599){//oncoming DOM event trigger
        if(this.document){// if there is at least one document in vidget thread
			if(data[2]>-1)
                this.document._createdElement[data[2]].onEvents[data[4]].forEach(function(d){d(this);},data[5]);
            else{
                this.document.onEvents[data[4]].forEach(function(d){d(this)},data[5]);
			}
			return;
        }
    }
    else if(data[0]==1599){//oncoming DOM event trigger
                if(this.onEvents["message"])
                     this.onEvents["message"].forEach(function(d){d(this)},data[3]);
		return;
    }
    else if(data[0]==1598){//oncoming DOM event trigger
                if(this.onEvents["close"])
                     this.onEvents["close"].forEach(function(d){d(this)},data[3]);
		return;
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
    else if(data[0]==600){//oncoming callBack (from flash externalInterface)
        console.log("callBack"+data);
           this.onEvents["message"].forEach(function(d){d(this)},data[3]);
    }
    else if(data[0]==666){//terminate operation request from OS. If this app does not terminate correctly, then the timer on OS will go off and terminate manually this application.
        self.onterminate();
    }
    else if(data[0]==2){//terminate operation request from OS. If this app does not terminate correctly, then the timer on OS will go off and terminate manually this application.
        if(data[1]!=null)
            self.onParamReceive(data[1]);
    }
	return this;
}
self.onterminate=function(){
    self.close();
}

function console(){};
console.log=function(value){
    postMessage([-1,value]);
}
postMessage([1,1]);

self.onParamReceive=function(){};

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

_window=function(PID,vidgetObject){
    
};
document=function(window){
    this.childNodes=[];
    this.window=window;
    this._createdElement=[];
    this.onEvents={};
    return this;
}
document.prototype.createElement=function(nodeName){
            
            var ele=new Object();
            
			ele.window=this.window;
            this._className="";
            ele._style={};
            for(var i=getAllStylePropertySupportedByThisBrowser.length;--i>-1;) {
                var p=getAllStylePropertySupportedByThisBrowser[i];
                ele._style[p]="";
                (function(p,ele){Object.defineProperty(ele._style, p, {
                    get: function () {
                       
                        return this["_"+p];
                    },
                    set: function (nv) {
                        ele.window.postMessage([801,[nv,ele.idNum,ele.window.id,p]])
                        this["_"+p] = nv;
                    },
                    configurable:true
                });})(p,ele);
             }
             Object.defineProperty(ele,'style',{set:function(nv){},get:function(){return this._style;},configurable:true});
            
            Object.defineProperty(ele,'className',{set:function(nv){this._className=nv;this.window.postMessage([424,[nv,this.idNum,this.window.id]]);},get:function(){return this._className;},configurable:true});
            Object.defineProperty(ele,'scrollTop',{set:function(nv){this._scrollTop=nv;this.window.postMessage([426,[nv,this.idNum,this.window.id]]);},get:function(){return this._scrollTop;},configurable:true});
            Object.defineProperty(ele,'list',{set:function(nv){this._list=nv;this.window.postMessage([428,[nv,this.idNum,this.window.id]]);},get:function(){return this._list;},configurable:true});
            Object.defineProperty(ele,'id',{set:function(nv){this._id=nv;this.window.postMessage([427,[nv,this.idNum,this.window.id]]);},get:function(){return this._id;},configurable:true});


            this.offsetWidth =0;
            this.offsetHeight =0;
            ele.nodeName=nodeName;    
            if(nodeName=="input"||nodeName=="textarea"||nodeName=="progress"){
                ele._value='';
                ele._disabled=false;
                
                ele._type='text';
                ele._checked=false;
                ele._readonly=false;
                ele._placeholder="";
                Object.defineProperty(ele,'value',{set:function(nv){this._value=nv.toString();this.window.postMessage([406,[nv,this.idNum,this.window.id]]);},get:function(){return this._value;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;this.window.postMessage([407,[nv,this.idNum,this.window.id]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'type',{set:function(nv){this._type=nv;this.window.postMessage([408,[nv,this.idNum,this.window.id]]);},get:function(){return this._type;},configurable:true});
                Object.defineProperty(ele,'checked',{set:function(nv){this._checked=nv;this.window.postMessage([409,[nv,this.idNum,this.window.id]]);},get:function(){return this._checked;},configurable:true});
                Object.defineProperty(ele,'readonly',{set:function(nv){this._readonly=nv;this.window.postMessage([410,[nv,this.idNum,this.window.id]]);},get:function(){return this._readonly;},configurable:true});
                Object.defineProperty(ele,'placeholder',{set:function(nv){this._placeholder=nv;this.window.postMessage([429,[nv,this.idNum,this.window.id]]);},get:function(){return this._placeholder;},configurable:true});

           }else if(nodeName=="select"){
                ele._selectedIndex='';
                ele._multiple=false;
                ele._disabled='';
                ele._size='';
                ele.multiple=false;
                Object.defineProperty(ele,'selectedIndex',{set:function(nv){this._selectedIndex=nv;this.window.postMessage([413,[nv,this.idNum,this.window.id]]);},get:function(){return this._selectedIndex;},configurable:true});
                Object.defineProperty(ele,'multiple',{set:function(nv){this._multiple=nv;this.window.postMessage([414,[nv,this.idNum,this.window.id]]);},get:function(){return this._multiple;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;this.window.postMessage([407,[nv,this.idNum,this.window.id]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'size',{set:function(nv){this._size=nv;this.window.postMessage([415,[nv,this.idNum,this.window.id]]);},get:function(){return this._size;},configurable:true});
            }
            else if(nodeName=="option"){
                ele._label='';
                ele._disabled=false;
                ele._selected=false;
                ele._value='';
                Object.defineProperty(ele,'label',{set:function(nv){this._label=nv;this.window.postMessage([416,[nv,this.idNum,this.window.id]]);},get:function(){return this._label;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;this.window.postMessage([407,[nv,this.idNum,this.window.id]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'selected',{set:function(nv){this._selected=nv;this.window.postMessage([417,[nv,this.idNum,this.window.id]]);},get:function(){return this._selected;},configurable:true});
                Object.defineProperty(ele,'value',{set:function(nv){this._value=nv;this.window.postMessage([406,[nv,this.idNum,this.window.id]]);},get:function(){return this._value;},configurable:true});
                
            }
            else if(nodeName=="img"){
                ele._src='';
                ele._alt='';
                Object.defineProperty(ele,'src',{set:function(nv){this._src=nv;this.window.postMessage([418,[nv,this.idNum,this.window.id]]);},get:function(){return this._src;},configurable:true});
                Object.defineProperty(ele,'alt',{set:function(nv){this._alt=nv;this.window.postMessage([419,[nv,this.idNum,this.window.id]]);},get:function(){return this._alt;},configurable:true});
            }
            else if(nodeName=="td"){
                Object.defineProperty(ele,'colSpan',{set:function(nv){this._colSpan=nv;this.window.postMessage([420,[nv,this.idNum,this.window.id]]);},get:function(){return this._colSpan;},configurable:true});
                Object.defineProperty(ele,'rowSpan',{set:function(nv){this._rowSpan=nv;this.window.postMessage([421,[nv,this.idNum,this.window.id]]);},get:function(){return this._rowSpan;},configurable:true});
            }
            else if(nodeName=="canvas"){
                ele.getContext=function(str){
                    var obj=new Object();
					obj.window=this.window;
                    obj.idNum=this.idNum;
                    if(str=="2d"){
                        Object.defineProperty(obj,'fillStyle',{set:function(nv){this._fillStyle=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'fillStyle']]);},get:function(){return this._fillStyle;},configurable:true});
                        Object.defineProperty(obj,'strokeStyle',{set:function(nv){this._strokeStyle=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'strokeStyle']]);},get:function(){return this._strokeStyle;},configurable:true});
                        Object.defineProperty(obj,'shadowColor',{set:function(nv){this._shadowColor=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'shadowColor']]);},get:function(){return this._shadowColor;},configurable:true});
                        Object.defineProperty(obj,'shadowBlur',{set:function(nv){this._shadowBlur=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'shadowBlur']]);},get:function(){return this._shadowBlur;},configurable:true});
                        Object.defineProperty(obj,'shadowOffsetX',{set:function(nv){this._shadowOffsetX=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'shadowOffsetX']]);},get:function(){return this._shadowOffsetX;},configurable:true});
                        Object.defineProperty(obj,'shadowOffsetY',{set:function(nv){this._shadowOffsetY=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'shadowOffsetY']]);},get:function(){return this._shadowOffsetY;},configurable:true});
                        //Object.defineProperty(ele,'alt',{set:function(nv){this._src=nv;postMessage([419,[nv,this.idNum,this.window.id]]);},get:function(){return this._src;},configurable:true});
                        
                        //INCOMPLETE NEEDS SUB functions for obj.createLinearGradient=function(x,y,w,h){postMessage([602,[0,this.idNum,this.window.id,'createLinearGradient',[x,y,w,h]]]);};
                        //INCOMPLETE obj.createPattern=function(){};
                        //INCOMPLETE NEEDS SUB functions obj.createRadialGradient=function(){};
                        //INCOMPLETE obj.addColorStop=function(){};
                        
                        Object.defineProperty(obj,'lineCap',{set:function(nv){this._lineCap=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'lineCap']]);},get:function(){return this._lineCap;},configurable:true});
                        Object.defineProperty(obj,'lineJoin',{set:function(nv){this._lineJoin=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'lineJoin']]);},get:function(){return this._lineJoin;},configurable:true});
                        Object.defineProperty(obj,'lineWidth',{set:function(nv){this._lineWidth=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'lineWidth']]);},get:function(){return this._lineWidth;},configurable:true});
                        Object.defineProperty(obj,'miterLimit',{set:function(nv){this._miterLimit=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'miterLimit']]);},get:function(){return this._miterLimit;},configurable:true});
                        
                        obj.rect=function(x,y,w,h){this.window.postMessage([602,[0,this.idNum,this.window.id,'rect',[x,y,w,h]]]);};
                        obj.fillRect=function(x,y,w,h){this.window.postMessage([602,[0,this.idNum,this.window.id,'fillRect',[x,y,w,h]]]);};
                        obj.strokeRect=function(x,y,w,h){this.window.postMessage([602,[0,this.idNum,this.window.id,'strokeRect',[x,y,w,h]]]);};
                        obj.clearRect=function(x,y,w,h){this.window.postMessage([602,[0,this.idNum,this.window.id,'clearRect',[x,y,w,h]]]);};
                        
                        
                        
                        
                        obj.fill=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'fill',[]]]);};
                        obj.stroke=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'stroke',[]]]);};
                        obj.beginPath=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'beginPath',[]]]);};
                        obj.moveTo=function(x,y){this.window.postMessage([602,[0,this.idNum,this.window.id,'moveTo',[x,y]]]);};
                        obj.closePath=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'closePath',[]]]);};
                        obj.lineTo=function(x,y){this.window.postMessage([602,[0,this.idNum,this.window.id,'lineTo',[x,y]]]);};
                        obj.clip=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'clip',[]]]);};
                        obj.quadraticCurveTo=function(cpx, cpy,x,y){this.window.postMessage([602,[0,this.idNum,this.window.id,'quadraticCurveTo',[cpx, cpy,x,y]]]);};
                        obj.bezierCurveTo=function(cp1x,cp1y,cp2x,cp2y,x,y){this.window.postMessage([602,[0,this.idNum,this.window.id,'bezierCurveTo',[cp1x,cp1y,cp2x,cp2y,x,y]]]);};
                        obj.arc=function(x,y,r,sAngle,eAngle,counterclockwise){this.window.postMessage([602,[0,this.idNum,this.window.id,'arc',[x,y,r,sAngle,eAngle,counterclockwise]]]);};
                        obj.arcTo=function(x1,y1,x2,y2,r){this.window.postMessage([602,[0,this.idNum,this.window.id,'arcTo',[x1,y1,x2,y2,r]]]);};
                        obj._isPointInPathCounter=0;
                        obj.isPointInPath=function(x,y){
                            //this won't work.  sleep-block blocks incoming messages from main thread while sleeping.
                            //Time to go plan B- isPointInPath emulation without main thread.
                            return;
                            var stringCallBack='isPointInPath'+this._isPointInPathCounter;
                            this._isPointInPathCounter++;
                            var idCalling=__addCallBackListener(this,stringCallBack);
                            this.postMessage([602,[0,this.idNum,this.window.id,'isPointInPath',[x,y],idCalling]]);
                            console.log("testing");
                            setInterval(function(){console.log("no 3 luck "+__getCallBackReturn(idCalling));},500);
                            while(__getCallBackReturn(idCalling)==null){
                                __sleep(500);
                                console.log("no luck "+__getCallBackReturn(idCalling));
                                
                            }
                            
                            console.log("outofwhile "+__getCallBackReturn(idCalling));
                            var i=__getCallBackReturn(idCalling);
                            this._isPointInPath=null;
                            return i;
                        };//this may need a consideration. This is incomplete function
                        
                        obj.scale=function(scalewidth,scaleheight){this.window.postMessage([602,[0,this.idNum,this.window.id,'scale',[scalewidth,scaleheight]]]);};
                        obj.rotate=function(angle){this.window.postMessage([602,[0,this.idNum,this.window.id,'rotate',[angle]]]);};
                        obj.translate=function(x,y){this.window.postMessage([602,[0,this.idNum,this.window.id,'translate',[x,y]]]);};
                        obj.transform=function(a,b,c,d,e,f){this.window.postMessage([602,[0,this.idNum,this.window.id,'transform',[a,b,c,d,e,f]]]);};
                        obj.setTransform=function(a,b,c,d,e,f){this.window.postMessage([602,[0,this.idNum,this.window.id,'setTransform',[a,b,c,d,e,f]]]);};
                        
                        Object.defineProperty(obj,'font',{set:function(nv){this._font=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'font']]);},get:function(){return this._font;},configurable:true});
                        Object.defineProperty(obj,'textAlign',{set:function(nv){this._textAlign=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'textAlign']]);},get:function(){return this._textAlign;},configurable:true});
                        Object.defineProperty(obj,'textBaseline',{set:function(nv){this._textBaseline=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'textBaseline']]);},get:function(){return this._textBaseline;},configurable:true});
                        
                        obj.fillText=function(text,x,y,maxWidth){this.window.postMessage([602,[0,this.idNum,this.window.id,'fillText',[text,x,y,maxWidth]]]);};
                        obj.strokeText=function(text,x,y,maxWidth){this.window.postMessage([602,[0,this.idNum,this.window.id,'strokeText',[text,x,y,maxWidth]]]);};
                        obj.measureText=function(text){this.window.postMessage([602,[0,this.idNum,this.window.id,'measureText',[text]]]);};//this may need a consideration. This is incomplete function
                        
                        obj.drawImage=function(img,sx,sy,swidth,sheight,x,y,width,height){this.window.postMessage([602,[0,this.idNum,this.window.id,'drawImage',[img,sx,sy,swidth,sheight,x,y,width,height]]]);};//this may need a consideration. This is incomplete function
                        
                        //these below are for ImageData ;
                        obj.width=0;
                        obj.height=0;
                        obj.data=[];
                        
                        obj.createImageData=function(){};//this may need a consideration. This is incomplete function
                        obj.getImageData=function(){};//this may need a consideration. This is incomplete function
                        obj.putImageData=function(){};//this may need a consideration. This is incomplete function
                        
                        obj.save=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'save',[]]]);}
                        obj.restore=function(){this.window.postMessage([602,[0,this.idNum,this.window.id,'restore',[]]]);}
                
                        Object.defineProperty(obj,'globalAlpha',{set:function(nv){this._globalAlpha=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'globalAlpha']]);},get:function(){return this._globalAlpha;},configurable:true});
                        Object.defineProperty(obj,'globalCompositeOperation',{set:function(nv){this._globalCompositeOperation=nv;this.window.postMessage([601,[nv,this.idNum,this.window.id,'globalCompositeOperation']]);},get:function(){return this._globalCompositeOperation;},configurable:true});

                      this.window.postMessage([600,["2d",this.idNum,this.window.id]]);
                        
                    }
                    return obj
                };
                
                Object.defineProperty(ele,'src',{set:function(nv){this._src=nv;this.window.postMessage([418,[nv,this.idNum,this.window.id]]);},get:function(){return this._src;},configurable:true});
                Object.defineProperty(ele,'alt',{set:function(nv){this._alt=nv;this.window.postMessage([419,[nv,this.idNum,this.window.id]]);},get:function(){return this._src;},configurable:true});
            }
            var eleID=this._createdElement.length;
            ele._windowID=this._windowID;
            ele.idNum=eleID;
            ele._name='';
            Object.defineProperty(ele,'name',{set:function(nv){this._name=nv;this.window.postMessage([411,[nv,this.idNum,this.window.id]]);},get:function(){return this._name;},configurable:true});
            ele._text='';
            ele._textContent='';
            ele._innerHTML='';
            
            Object.defineProperty(ele,'textContent',{set:function(nv){//incomplete, needs to merge together and base itself on innerHTML but use replace to filter out tags
            this._textContent=nv;this.window.postMessage([405,[nv,this.idNum,this.window.id]]);},get:function(){return this._textContent;},configurable:true});
            
            Object.defineProperty(ele,'innerHTML',{set:function(nv){//incomplete
            this._innerHTML=nv;this.window.postMessage([423,[nv,this.idNum,this.window.id]]);},get:function(){return this._innerHTML;},configurable:true});

            Object.defineProperty(ele,'text',{set:function(nv){
                this._text=nv;this.window.postMessage([416,[nv,this.idNum,this.window.id]]);//label
                
                //Object.defineProperty(this,'textContent',{set:function(nv){this._textContent=nv;postMessage([405,[nv,this.idNum,this.window.id]]);},get:function(){return this._textContent;},configurable:true});
                this.postMessage([412,[nv,this.idNum,this.window.id]]);
            },get:function(){return this._text;},configurable:true});
            ele.setAttribute=this.setAttribute;
            ele.getAttribute=this.getAttribute;
            ele.onclick=this.onclick;
            ele._appendChild=this.appendChild;
            ele._insertBefore=this.insertBefore;
            ele.childNodes=[];

            ele.appendChild=function(eleObj){this._appendChild.call(this,eleObj);}
            ele.insertBefore=function(eleObj,insertBefore){this._insertBefore.call(this,eleObj,insertBefore);}

            ele._removeChild=this.removeChild;
            ele.__removeChildNoCall=this._removeChildNoCall;
            ele.__childNodesUpdateIDAfter=this._childNodesUpdateIDAfter;
            ele.removeChild=function(eleObj){this._removeChild.call(this,eleObj);}
            ele._removeChildNoCall=function(eleObj){this.__removeChildNoCall.call(this,eleObj);}
            ele._childNodesUpdateIDAfter=function(idAfter){this.__childNodesUpdateIDAfter.call(this,idAfter);}
            ele.onEvents={};
            ele._eventCount=0;
			
            ele.addEventListener=function(eventName,eventFunct,useCapture){//we may have to consider about useCapture concept little bit more...
                //useCapture is not created yet
                if(this.onEvents[eventName])//dont create a new event in main event, waste of overhead performance
					this.onEvents[eventName][this.onEvents[eventName].length]=eventFunct;
				else{
					this.onEvents[eventName]=[eventFunct];
					this.window.postMessage([500,[{nodeName:this.nodeName,idNum:this.idNum,winID:this.window.id},eventName,this._eventCount]]);
				}
            }
			
            this._createdElement.push(ele);
            this.window.postMessage([402,[nodeName,this.window.id,eleID]]);
            if(nodeName=="input"||nodeName=='textarea'){
            
                ele.addEventListener("keydown",function(ele){
                    var el=ele;
                    return    function(event){
                        el._value=event._value;
                        el._checked=event._checked;
                        
                    }
                    return this;
                }(ele),true);
                ele.addEventListener("keypress",function(ele){
                    var el=ele;
                    return    function(event){
                        el._value=event._value;
                        el._checked=event._checked;
                        
                    }
                    return this;
                }(ele),true);
                ele.addEventListener("keyup",function(ele){
                    var el=ele;
                    return    function(event){                        
                        el._value=event._value;
                        el._checked=event._checked;
                        
                    }
                    return this;
                }(ele),true);
                ele.addEventListener("change",function(ele){
                    var el=ele;
                    return    function(event){
                        el._value=event._value;
                        el._checked=event._checked;
                        
                        
                    }
                    return this;
                }(ele),true);
            }else if(nodeName=="select"){
                ele.options=[];
                ele._optionsID=[];
                ele.addEventListener("change",function(ele){
                    var el=ele;
                    return    function(event){
                        el._selectedIndex=event._selectedIndex;
                        event._optionsSelectedIDs.forEach(function(val,d,arr){
                            var opt=this[d];
                            opt._selected=val;
                        },el.options);
                        
                    }
                    return this;
                }(ele),true);
            }
            ele.scrollTop=0;
             ele.addEventListener("_onLoad",function(ele){
                    var el=ele;
                    
                    return    function(event){
                        el.scrollHeight=event._scrollHeight;
                    }
                    return this;
                }(ele));
            ele.addEventListener("scroll",function(ele){
                    var el=ele;
                    
                    return    function(event){
                        el._scrollTop=event._scrollTop;
                        el.scrollHeight=event._scrollHeight;
                    }
                    return this;
                }(ele));
            return ele;
           
        }
         document.prototype.insertBefore=function(eleObject,beforeElementObject){
            if( (eleObject.nodeName && eleObject.idNum!=null ) && ( beforeElementObject.nodeName && beforeElementObject.idNum!=null) ){
                var appendTo=-1;
                if(this.idNum!=null)
                    appendTo=this.idNum;
                this.window.postMessage([425,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},appendTo,this.window.id,beforeElementObject.idNum ]]);
               
               
                if(eleObject._childNodeID==null)
                    eleObject._childNodeID=this.childNodes.length;
                else{
                    eleObject.parentNode._removeChildNoCall(eleObject);
                    eleObject._childNodeID=this.childNodes.length;
                }
                 eleObject.parentNode=this;
                 eleObject._childNodeID=beforeElementObject._childNodeID;
                this.childNodes.splice(beforeElementObject._childNodeID,0,eleObject);
                this._childNodesUpdateIDAfter(beforeElementObject._childNodeID+1);
                 return ;//this below is not completed and need further testing;; It needs to update childNodes too
                if(this.nodeName=="select" && eleObject.nodeName=="option"){
                    this.options[this.options.length]=eleObject;
                }
            }else{
                throw new Error("Invalid argument given");
            }
            return eleObject;
        };
        document.prototype.removeChild=function(eleObject){//does not destroy this node. Null the reference but not the node
            if(eleObject.nodeName && eleObject.idNum!=null){
                var removeChildFrom=-1;
                if(this.idNum!=null)
                    removeChildFrom=this.idNum;
                this.window.postMessage([422,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},removeChildFrom,this.window.id]]);
                eleObject.parentNode=null;// don't 'delete' this. This needs to be referenced null             
                this.childNodes.splice(eleObject._childNodeID,1);
               
                for(var i=eleObject._childNodeID;++i<this.childNodes.length;)
                    --this.childNodes[i]._childNodeID;
                 eleObject._childNodeID=-1;
                //need more work below
                return eleObject;
                if(this.nodeName=="select" && eleObject.nodeName=="option"){//
                    this.options[this.options.length]=eleObject;
                }
            }else{
                throw new Error("Invalid argument given");
            }
        };
        document.prototype._removeChildNoCall=function(eleObject){//does not destroy this node. Null the reference but not the node
            //don't let main thread know about this child removal (performance reason when it comes to uncessary notificaiton)
            if(eleObject.nodeName && eleObject.idNum!=null){
                var removeChildFrom=-1;
                if(this.idNum!=null)
                    removeChildFrom=this.idNum;
                eleObject.parentNode=null;// don't 'delete' this. This needs to be referenced null             
                this.childNodes.splice(eleObject._childNodeID,1);
                //need more work below
                return eleObject;
                if(this.nodeName=="select" && eleObject.nodeName=="option"){//
                    this.options[this.options.length]=eleObject;
                }
            }else{
                throw new Error("Invalid argument given");
            }
        };
        document.prototype._childNodesUpdateIDAfter=function(afterID){//does not destroy this node. Null the reference but not the node
            //don't let main thread know about this child removal (performance reason when it comes to uncessary notificaiton)
            var children=this.childNodes;
            for(x=afterID;x>children.length;){
                children[x].idNum=++x;
            }
        };
document.prototype.onclick=function(obj){
    for(var i=this.onEvents["click"].length;--i>-1;){
        this.onEvents["click"][i](obj);
    }
}
 document.prototype.setAttribute=function(attributename,attributevalue){
    if(!this._setAttributeValues)
        this._setAttributeValues={};
    this._setAttributeValues[attributename]=attributevalue;
    this.window.postMessage([404,[attributename,this.idNum,this.window.id,attributevalue]]);
    return attributevalue;
 }
 document.prototype.getAttribute=function(attributename){
    return this._setAttributeValues[attributename];
 }
 document.prototype.addEventListener=function(eventName,eventFunct,useCapture){//we may have to consider about useCapture concept little bit more...
    //useCapture is not created yet
    
    if(this.onEvents[eventName])//dont create a new event in main event, waste of overhead performance
		this.onEvents[eventName][this.onEvents[eventName].length]=eventFunct;
	else{
		this.onEvents[eventName]=[eventFunct];
		this.window.postMessage([500,[{nodeName:"document",idNum:-1,winID:this.window.id},eventName,this._eventCount]]);
	}
}
document.prototype.appendChild=function(eleObject){
        if(eleObject.nodeName && eleObject.idNum!=null){
                var appendTo=-1;
                if(this.idNum!=null)
                    appendTo=this.idNum;
                this.window.postMessage([403,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},this.window.id,appendTo]]);
                
                if(eleObject._childNodeID==null)
                    eleObject._childNodeID=this.childNodes.length;
                else{
                    eleObject.parentNode._removeChildNoCall(eleObject);
                    eleObject._childNodeID=this.childNodes.length;
                }
                eleObject.parentNode=this;
                this.childNodes[eleObject._childNodeID]=eleObject;
                if(this.nodeName=="select" && eleObject.nodeName=="option"){
                    this.options[this.options.length]=eleObject;
                }
				else if(eleObject.nodeName=="input"&&eleObject.type=="file"){
					eleObject._changeFunctionCall=function(ele){
						var el=ele;
						return    function(event){
							el._files=[];
							for(var x=0;event._filesLength>x;x++){
								el._files[x]={eleID:ele.idNum,fileID:x};
								el._files[x].value=event._filesData[x].value;
								el._files[x].type=event._filesData[x].type;
								el._files[x].lastModifiedDate=event._filesData[x].lastModifiedDate;
								el._files[x].size=event._filesData[x].size;
							}
							
						}
					};
					eleObject.addEventListener("change",eleObject._changeFunctionCall(eleObject),true);
					Object.defineProperty(eleObject,'files',{set:function(nv){},get:function(){return this._files;},configurable:true});
					
                    eleObject._files=[];
                }
            }else{
                throw new Error("Invalid argument given");
            }
            return eleObject;
        
        
    };
var __windowCounter={};
window=function(PID,User){
    if(!__windowCounter[PID])__windowCounter[PID]={windows:[],User:User};
    this.id=__windowCounter[PID]["windows"].length;//windowID
    __windowCounter[PID]["windows"].push(this);
    this.PID=PID;
    this.innerWidth=0;
    this.innerHeight=0;
    this._title="";
    Object.defineProperty(this,'title',{set:function(nv){this._title=nv;this.postMessage([203,[this.id,nv]]);},get:function(){return this._title;},configurable:true});
    this.document=new document(this);
    this.d=d;
    this.d.window=this;
    this.onEvents={};
    
   
    
};
 window.prototype.addEventListener=function(eventName,eventFunct,useCapture){//we may have to consider about useCapture concept little bit more...
    //dont send this to main thread. 
    if(this.onEvents[eventName])//dont create a new event in main event, waste of overhead performance
		this.onEvents[eventName][this.onEvents[eventName].length]=eventFunct;
	else{
		this.onEvents[eventName]=[eventFunct];
	}
}
window.prototype.postMessage=function(arg){
    arg.unshift(this.PID);
	postMessageOrg(arg);

}
document.prototype.postMessage=function(arg){this.window.postMessage(arg)};
window.prototype.open=function(title,windowOptions){
    var w=new window(this.PID,this.User);
    this.postMessage([202,[w.id,title,windowOptions]]);
     w.document.body=w.document.createElement("section");
    w.document.appendChild(w.document.body);
    return w;}
window.prototype.resizeTo=function(x,y){this.postMessage([201,[x,y,this.id]]);return this;}

_window.total=-2;//-1 = main window.


function style(){


}