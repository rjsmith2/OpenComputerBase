_windowArray=[];

window=null;
window=function(){
    this.id=++window.total;
    this.innerWidth=0;
    this.innerHeight=0;
    this.open=function(settings){//new child window to this window as a parent
        postMessage([202,[this.id,settings]]);
        this.title=settings;
        return window;
    }
    this.resizeTo=function(x,y){
        postMessage([201,[x,y,this.id]]);
    }
    this._title='';
    Object.defineProperty(this,'title',{set:function(nv){this._title=nv;postMessage([203,[this.id,nv]]);},get:function(){return this._title;},configurable:true});
    this.document=function(){

        this.childNodes=[];
         this.appendChild=function(eleObject){
            if(eleObject.nodeName && eleObject.idNum!=null){
                var appendTo=-1;
                if(this.idNum!=null)
                    appendTo=this.idNum;
                postMessage([403,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},this.id,appendTo]]);
                
                if(eleObject._childNodeID==null)
                    eleObject._childNodeID=this.childNodes.length;
                else{
                    eleObject.parentNode._removeChildNoCall(eleObject);
                    eleObject._childNodeID=this.childNodes.length;
                }
                eleObject.parentNode=this;
                this.childNodes[eleObject._childNodeID]=eleObject;
                if(this.nodeName=="select" && eleObject.nodeName=="option"){
                    this.options[this.options.length]=eleObject;//_windowArray[this._windowID]._createdElement[eleObject.idNum];
                    
                    //_windowArray[this._windowID]._createdElement[eleObject.idNum];
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
        
        this.insertBefore=function(eleObject,beforeElementObject){
            if( (eleObject.nodeName && eleObject.idNum!=null ) && ( beforeElementObject.nodeName && beforeElementObject.idNum!=null) ){
                var appendTo=-1;
                if(this.idNum!=null)
                    appendTo=this.idNum;
                postMessage([425,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},this.id,appendTo,beforeElementObject.idNum ]]);
               
               
                if(eleObject._childNodeID==null)
                    eleObject._childNodeID=this.childNodes.length;
                else{
                    eleObject.parentNode._removeChildNoCall(eleObject);
                    eleObject._childNodeID=this.childNodes.length;
                }
                 eleObject.parentNode=this;
                this.childNodes.splice(beforeElementObject._childNodeID,eleObject);
                this._childNodesUpdateIDAfter(beforeElementObject._childNodeID);
                 return ;//this below is not completed and need further testing;; It needs to update childNodes too
                if(this.nodeName=="select" && eleObject.nodeName=="option"){
                    this.options[this.options.length]=eleObject;//_windowArray[this._windowID]._createdElement[eleObject.idNum];
                    
                    //_windowArray[this._windowID]._createdElement[eleObject.idNum];
                }
            }else{
                throw new Error("Invalid argument given");
            }
            return eleObject;
        };
        this.removeChild=function(eleObject){//does not destroy this node. Null the reference but not the node
            if(eleObject.nodeName && eleObject.idNum!=null){
                var removeChildFrom=-1;
                if(this.idNum!=null)
                    removeChildFrom=this.idNum;
                postMessage([422,[{nodeName:eleObject.nodeName,idNum:eleObject.idNum},this.id,removeChildFrom]]);
                eleObject.parentNode=null;// don't 'delete' this. This needs to be referenced null             
                this.childNodes.splice(eleObject._childNodeID,1);
                //need more work below
                return eleObject;
                if(this.nodeName=="select" && eleObject.nodeName=="option"){//
                    this.options[this.options.length]=eleObject;//_windowArray[this._windowID]._createdElement[eleObject.idNum];
                    
                    //_windowArray[this._windowID]._createdElement[eleObject.idNum];
                }
            }else{
                throw new Error("Invalid argument given");
            }
        };
        this._removeChildNoCall=function(eleObject){//does not destroy this node. Null the reference but not the node
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
                    this.options[this.options.length]=eleObject;//_windowArray[this._windowID]._createdElement[eleObject.idNum];
                    
                    //_windowArray[this._windowID]._createdElement[eleObject.idNum];
                }
            }else{
                throw new Error("Invalid argument given");
            }
        };
        this._childNodesUpdateIDAfter=function(afterID){//does not destroy this node. Null the reference but not the node
            //don't let main thread know about this child removal (performance reason when it comes to uncessary notificaiton)
            var children=this.childNodes;
            for(x=afterID;x>children.length;x++){
                
                children[x].idNum+=1;
            }
        };
        this.setAttribute=function(attributename,attributevalue){
            if(!this._setAttributeValues)
                this._setAttributeValues={};
            this._setAttributeValues[attributename]=attributevalue
            
            postMessage([404,[attributename,this.idNum,attributevalue]]);
        };
        this.getAttribute=function(attributename,attributevalue){
            return this._setAttributeValues[attributename];
        }
        this._windowID=this.id;
        this.createElement=function(nodeName){
            
            var ele=new Object();
            this._className="";
            Object.defineProperty(ele,'className',{set:function(nv){this._className=nv;postMessage([424,[nv,this.idNum]]);},get:function(){return this._className;},configurable:true});
			Object.defineProperty(ele,'tabIndex',{set:function(nv){this._tabIndex=nv;postMessage([428,[nv,this.idNum]]);},get:function(){return this._tabIndex;},configurable:true});

            this.offsetWidth =0;
            this.offsetHeight =0;
            ele.nodeName=nodeName;    
            if(nodeName=="input"||nodeName=="textarea"||nodeName=="progress"){
                ele._value='';
                ele._disabled=false;
                ele._type='text';
                ele._checked=false;
                ele._readonly=false;
                Object.defineProperty(ele,'value',{set:function(nv){this._value=nv.toString();postMessage([406,[nv,this.idNum]]);},get:function(){return this._value;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;postMessage([407,[nv,this.idNum]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'type',{set:function(nv){this._type=nv;postMessage([408,[nv,this.idNum]]);},get:function(){return this._type;},configurable:true});
                Object.defineProperty(ele,'checked',{set:function(nv){this._checked=nv;postMessage([409,[nv,this.idNum]]);},get:function(){return this._checked;},configurable:true});
                Object.defineProperty(ele,'readonly',{set:function(nv){this._readonly=nv;postMessage([410,[nv,this.idNum]]);},get:function(){return this._readonly;},configurable:true});
            }else if(nodeName=="select"){
                ele._selectedIndex='';
                ele._multiple=false;
                ele._disabled='';
                ele._size='';
                ele.multiple=false;
                Object.defineProperty(ele,'selectedIndex',{set:function(nv){this._selectedIndex=nv;postMessage([413,[nv,this.idNum]]);},get:function(){return this._selectedIndex;},configurable:true});
                Object.defineProperty(ele,'multiple',{set:function(nv){this._multiple=nv;postMessage([414,[nv,this.idNum]]);},get:function(){return this._multiple;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;postMessage([407,[nv,this.idNum]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'size',{set:function(nv){this._size=nv;postMessage([415,[nv,this.idNum]]);},get:function(){return this._size;},configurable:true});
            }
            else if(nodeName=="option"){
                ele._label='';
                ele._disabled=false;
                ele._selected=false;
                ele._value='';
                Object.defineProperty(ele,'label',{set:function(nv){this._label=nv;postMessage([416,[nv,this.idNum]]);},get:function(){return this._label;},configurable:true});
                Object.defineProperty(ele,'disabled',{set:function(nv){this._disabled=nv;postMessage([407,[nv,this.idNum]]);},get:function(){return this._disabled;},configurable:true});
                Object.defineProperty(ele,'selected',{set:function(nv){this._selected=nv;postMessage([417,[nv,this.idNum]]);},get:function(){return this._selected;},configurable:true});
                Object.defineProperty(ele,'value',{set:function(nv){this._value=nv;postMessage([406,[nv,this.idNum]]);},get:function(){return this._value;},configurable:true});
                
            }
            else if(nodeName=="img"){
                ele._src='';
                ele._alt='';
                Object.defineProperty(ele,'src',{set:function(nv){this._src=nv;postMessage([418,[nv,this.idNum]]);},get:function(){return this._src;},configurable:true});
                Object.defineProperty(ele,'alt',{set:function(nv){this._alt=nv;postMessage([419,[nv,this.idNum]]);},get:function(){return this._alt;},configurable:true});
            }
            else if(nodeName=="td"){
                Object.defineProperty(ele,'colSpan',{set:function(nv){this._colSpan=nv;postMessage([420,[nv,this.idNum]]);},get:function(){return this._colSpan;},configurable:true});
                Object.defineProperty(ele,'rowSpan',{set:function(nv){this._rowSpan=nv;postMessage([421,[nv,this.idNum]]);},get:function(){return this._rowSpan;},configurable:true});
            }
            else if(nodeName=="canvas"){
				Object.defineProperty(ele,'width',{set:function(nv){this._width=nv;postMessage([426,[nv,this.idNum]]);},get:function(){return this._width;},configurable:true});
				Object.defineProperty(ele,'height',{set:function(nv){this._height=nv;postMessage([427,[nv,this.idNum]]);},get:function(){return this._height;},configurable:true});

                ele.getContext=function(str){
                    var obj=new Object();
                    obj.idNum=this.idNum;
                    if(str=="2d"){
                        Object.defineProperty(obj,'fillStyle',{set:function(nv){this._fillStyle=nv;postMessage([601,[nv,this.idNum,'fillStyle']]);},get:function(){return this._fillStyle;},configurable:true});
                        Object.defineProperty(obj,'strokeStyle',{set:function(nv){this._strokeStyle=nv;postMessage([601,[nv,this.idNum,'strokeStyle']]);},get:function(){return this._strokeStyle;},configurable:true});
                        Object.defineProperty(obj,'shadowColor',{set:function(nv){this._shadowColor=nv;postMessage([601,[nv,this.idNum,'shadowColor']]);},get:function(){return this._shadowColor;},configurable:true});
                        Object.defineProperty(obj,'shadowBlur',{set:function(nv){this._shadowBlur=nv;postMessage([601,[nv,this.idNum,'shadowBlur']]);},get:function(){return this._shadowBlur;},configurable:true});
                        Object.defineProperty(obj,'shadowOffsetX',{set:function(nv){this._shadowOffsetX=nv;postMessage([601,[nv,this.idNum,'shadowOffsetX']]);},get:function(){return this._shadowOffsetX;},configurable:true});
                        Object.defineProperty(obj,'shadowOffsetY',{set:function(nv){this._shadowOffsetY=nv;postMessage([601,[nv,this.idNum,'shadowOffsetY']]);},get:function(){return this._shadowOffsetY;},configurable:true});
                        //Object.defineProperty(ele,'alt',{set:function(nv){this._src=nv;postMessage([419,[nv,this.idNum]]);},get:function(){return this._src;},configurable:true});
                        
                        //INCOMPLETE NEEDS SUB functions for obj.createLinearGradient=function(x,y,w,h){postMessage([602,[0,this.idNum,'createLinearGradient',[x,y,w,h]]]);};
                        //INCOMPLETE obj.createPattern=function(){};
                        //INCOMPLETE NEEDS SUB functions obj.createRadialGradient=function(){};
                        //INCOMPLETE obj.addColorStop=function(){};
                        
                        Object.defineProperty(obj,'lineCap',{set:function(nv){this._lineCap=nv;postMessage([601,[nv,this.idNum,'lineCap']]);},get:function(){return this._lineCap;},configurable:true});
                        Object.defineProperty(obj,'lineJoin',{set:function(nv){this._lineJoin=nv;postMessage([601,[nv,this.idNum,'lineJoin']]);},get:function(){return this._lineJoin;},configurable:true});
                        Object.defineProperty(obj,'lineWidth',{set:function(nv){this._lineWidth=nv;postMessage([601,[nv,this.idNum,'lineWidth']]);},get:function(){return this._lineWidth;},configurable:true});
                        Object.defineProperty(obj,'miterLimit',{set:function(nv){this._miterLimit=nv;postMessage([601,[nv,this.idNum,'miterLimit']]);},get:function(){return this._miterLimit;},configurable:true});
                        
                        obj.rect=function(x,y,w,h){postMessage([602,[0,this.idNum,'rect',[x,y,w,h]]]);};
                        obj.fillRect=function(x,y,w,h){postMessage([602,[0,this.idNum,'fillRect',[x,y,w,h]]]);};
                        obj.strokeRect=function(x,y,w,h){postMessage([602,[0,this.idNum,'strokeRect',[x,y,w,h]]]);};
                        obj.clearRect=function(x,y,w,h){postMessage([602,[0,this.idNum,'clearRect',[x,y,w,h]]]);};
                        
                        
                        
                        
                        obj.fill=function(){postMessage([602,[0,this.idNum,'fill',[]]]);};
                        obj.stroke=function(){postMessage([602,[0,this.idNum,'stroke',[]]]);};
                        obj.beginPath=function(){postMessage([602,[0,this.idNum,'beginPath',[]]]);};
                        obj.moveTo=function(x,y){postMessage([602,[0,this.idNum,'moveTo',[x,y]]]);};
                        obj.closePath=function(){postMessage([602,[0,this.idNum,'closePath',[]]]);};
                        obj.lineTo=function(x,y){postMessage([602,[0,this.idNum,'lineTo',[x,y]]]);};
                        obj.clip=function(){postMessage([602,[0,this.idNum,'clip',[]]]);};
                        obj.quadraticCurveTo=function(cpx, cpy,x,y){postMessage([602,[0,this.idNum,'quadraticCurveTo',[cpx, cpy,x,y]]]);};
                        obj.bezierCurveTo=function(cp1x,cp1y,cp2x,cp2y,x,y){postMessage([602,[0,this.idNum,'bezierCurveTo',[cp1x,cp1y,cp2x,cp2y,x,y]]]);};
                        obj.arc=function(x,y,r,sAngle,eAngle,counterclockwise){postMessage([602,[0,this.idNum,'arc',[x,y,r,sAngle,eAngle,counterclockwise]]]);};
                        obj.arcTo=function(x1,y1,x2,y2,r){postMessage([602,[0,this.idNum,'arcTo',[x1,y1,x2,y2,r]]]);};
                        obj._isPointInPathCounter=0;
                        obj.isPointInPath=function(x,y){
                            //this won't work.  sleep-block blocks incoming messages from main thread while sleeping.
                            //Time to go plan B- isPointInPath emulation without main thread.
                            return;
                            var stringCallBack='isPointInPath'+this._isPointInPathCounter;
                            this._isPointInPathCounter++;
                            var idCalling=__addCallBackListener(this,stringCallBack);
                            postMessage([602,[0,this.idNum,'isPointInPath',[x,y],idCalling]]);
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
                        
                        obj.scale=function(scalewidth,scaleheight){postMessage([602,[0,this.idNum,'scale',[scalewidth,scaleheight]]]);};
                        obj.rotate=function(angle){postMessage([602,[0,this.idNum,'rotate',[angle]]]);};
                        obj.translate=function(x,y){postMessage([602,[0,this.idNum,'translate',[x,y]]]);};
                        obj.transform=function(a,b,c,d,e,f){postMessage([602,[0,this.idNum,'transform',[a,b,c,d,e,f]]]);};
                        obj.setTransform=function(a,b,c,d,e,f){postMessage([602,[0,this.idNum,'setTransform',[a,b,c,d,e,f]]]);};
                        
                        Object.defineProperty(obj,'font',{set:function(nv){this._font=nv;postMessage([601,[nv,this.idNum,'font']]);},get:function(){return this._font;},configurable:true});
                        Object.defineProperty(obj,'textAlign',{set:function(nv){this._textAlign=nv;postMessage([601,[nv,this.idNum,'textAlign']]);},get:function(){return this._textAlign;},configurable:true});
                        Object.defineProperty(obj,'textBaseline',{set:function(nv){this._textBaseline=nv;postMessage([601,[nv,this.idNum,'textBaseline']]);},get:function(){return this._textBaseline;},configurable:true});
                        
                        obj.fillText=function(text,x,y,maxWidth){postMessage([602,[0,this.idNum,'fillText',[text,x,y,maxWidth]]]);};
                        obj.strokeText=function(text,x,y,maxWidth){postMessage([602,[0,this.idNum,'strokeText',[text,x,y,maxWidth]]]);};
                        obj.measureText=function(text){postMessage([602,[0,this.idNum,'measureText',[text]]]);};//this may need a consideration. This is incomplete function
                        
                        obj.drawImage=function(img,sx,sy,swidth,sheight,x,y,width,height){postMessage([602,[0,this.idNum,'drawImage',[img,sx,sy,swidth,sheight,x,y,width,height]]]);};//this may need a consideration. This is incomplete function
                        
                        //these below are for ImageData ;
                        obj.width=0;
                        obj.height=0;
                        obj.data=[];
                        
                        obj.createImageData=function(){};//this may need a consideration. This is incomplete function
                        obj.getImageData=function(){};//this may need a consideration. This is incomplete function
                        obj.putImageData=function(){};//this may need a consideration. This is incomplete function
                        
                
                        Object.defineProperty(obj,'globalAlpha',{set:function(nv){this._globalAlpha=nv;postMessage([601,[nv,this.idNum,'globalAlpha']]);},get:function(){return this._globalAlpha;},configurable:true});
                        Object.defineProperty(obj,'globalCompositeOperation',{set:function(nv){this._globalCompositeOperation=nv;postMessage([601,[nv,this.idNum,'globalCompositeOperation']]);},get:function(){return this._globalCompositeOperation;},configurable:true});

                       postMessage([600,["2d",this.idNum]]);
                        
                    }
                    return obj
                };
                ele.save=function(){}
                ele.restore=function(){}
                Object.defineProperty(ele,'src',{set:function(nv){this._src=nv;postMessage([418,[nv,this.idNum]]);},get:function(){return this._src;},configurable:true});
                Object.defineProperty(ele,'alt',{set:function(nv){this._alt=nv;postMessage([419,[nv,this.idNum]]);},get:function(){return this._src;},configurable:true});
            }
            var eleID=this._createdElement.length;
            ele._windowID=this._windowID;
            ele.idNum=eleID;
            ele._name='';
            Object.defineProperty(ele,'name',{set:function(nv){this._name=nv;postMessage([411,[nv,this.idNum]]);},get:function(){return this._name;},configurable:true});
            ele._text='';
            ele._textContent='';
            ele._innerHTML='';
            
            Object.defineProperty(ele,'textContent',{set:function(nv){//incomplete, needs to merge together and base itself on innerHTML but use replace to filter out tags
            this._textContent=nv;postMessage([405,[nv,this.idNum]]);},get:function(){return this._textContent;},configurable:true});
            
            Object.defineProperty(ele,'innerHTML',{set:function(nv){//incomplete
            this._innerHTML=nv;postMessage([423,[nv,this.idNum]]);},get:function(){return this._innerHTML;},configurable:true});

            Object.defineProperty(ele,'text',{set:function(nv){
                this._text=nv;postMessage([416,[nv,this.idNum]]);//label
                
                //Object.defineProperty(this,'textContent',{set:function(nv){this._textContent=nv;postMessage([405,[nv,this.idNum]]);},get:function(){return this._textContent;},configurable:true});
                postMessage([412,[nv,this.idNum]]);
            },get:function(){return this._text;},configurable:true});
            ele.setAttribute=this.setAttribute;
            ele.getAttribute=this.getAttribute;
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
            ele.addEventListener=function(eventName,eventFunct,useCapture,/* nonstandard */ eventParam){//we may have to consider about useCapture concept little bit more...
                //useCapture is not created yet
                if(this.onEvents[eventName])//dont create a new event in main event, waste of overhead performance
					this.onEvents[eventName][this.onEvents[eventName].length]=eventFunct;
				else{
					this.onEvents[eventName]=[eventFunct];
					postMessage([500,[{nodeName:this.nodeName,idNum:this.idNum,winID:this._windowID},eventName,this._eventCount,eventParam]]);
				}
            }
            this._createdElement.push(ele);
            postMessage([402,[nodeName,this.id,eleID]]);
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
            
            return ele;
        }
        this.onEvents={};
        this._eventCount=0;
        this.addEventListener=function(eventName,eventFunct,useCapture){//we may have to consider about useCapture concept little bit more...
                //useCapture is not created yet
                if(this.onEvents[eventName])//dont create a new event in main event, waste of overhead performance
					this.onEvents[eventName][this.onEvents[eventName].length]=eventFunct;
				else{
					this.onEvents[eventName]=[eventFunct];
					 postMessage([500,[{nodeName:"window",idNum:-1,winID:this._windowID},eventName,this._eventCount]]);
				}
               // postMessage([500,[{nodeName:"window",idNum:-1,winID:this._windowID},eventName,this._eventCount]]);
            }
        this._createdElement=[];
        _windowArray[_windowArray.length-1]=this;
        return this;
    }()
    return this;
};


window.total=-2;//-1 = main window.
window=window();
document=window.document;


function style(){


}