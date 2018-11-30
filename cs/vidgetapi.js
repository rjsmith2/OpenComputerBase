var offScreenDocumentFragment = document.createDocumentFragment();
vidget.api={};
var getAllStylePropertySupportedByThisBrowser=function(){
    var a=[];
    var d=document.documentElement;
    for (var s in d.style)a[a.length]=s;
    getAllStylePropertySupportedByThisBrowser=a;
    return a;
}()
//By default, each vidget application will be loaded via BLOB, not as file object. Every vidgetThreadContainer.js will come with vidgetThreadAPI.js (vidget version) preloaded. 
//When another thread can not be made, then first oldest thread will have to be shared to next newest vidget application. Both of those application will have to share performance. 
//Performance in the these applicaiton can be degraded noticably when they have to share performance while processing

//Also by default settings, all vidget will be spawned to first existing non-main thread.
function threads(){}
threads.threadHandlers=[];//preloaded vidgets if exists. 
threads.createNewThread=function() {
	var d=new Worker("vidgetThreadContainer.js");
	
    d.onmessage = function(z) {
        var data = z.data;
		
        var code        = data[1];
        var id          = data[0];
        var appID       = data[2];
        var dataFromApp = data[3];
        
        var app         = undefined;
        var appDomArray = undefined;
        
        //code that are greater than 400s
        
        if (code >= 400) {
            
            app = vidget.vidgetRunning[id];
            //only for 400s
            if (app && (code >= 404 && code < 500)) {
                //console.log(data);
                appDomArray = app.documentElementCreatedArray[data[2][2]+1][data[2][1]];
            }
        }
      
        switch (code) {
        case -1://  console logging
            dataFromApp = data[3];
            console.log("console vidget: "+data[2]);
            break;
		case 1://  inititalized boot
            this.postMessage([2, "" /*app.param2Pass*/]);
            break;
        
        case 2: //from application
            applicationds.app[id].running = true;
            break;
        
        case 201: //resize
            var window = vidget.vidgetRunning[id].windows[data[2][2] + 1];
            if (window && !vidget.vidgetRunning[id].flagSettings.backgroundMode) {
                window.style.height =data[2][1] + "px"
                window.style.width = data[2][0] + "px";
                window.resizeItself();
            }
            break;
        
        case 202: //new window
				//console.log("new window "+(data[2][0]+1));
				if(vidget.vidgetRunning[id].flagSettings.backgroundMode){//mainly as the animated wallpaper;
					//incomplete
					return;
					//resize event not sent (see windowd.onresize)
					vidget.vidgetRunning[id].windows[data[2][0]+1] = windows.create(data[2][1]);
					
					var windowID=data[2][0]+1;
					var windowd = vidget.vidgetRunning[id].windows[windowID];
					windowd.className="backgroundView";
					windowd.windowTitleContainer.style.display="none";
					windowd.removeAttribute("style");
					windowd.onmousemove=function(){};
					windowd.onfocusAction=function(){};
					//windowd.resizeItself=function(){};
					document.body.appendChild(windowd);
					windowd.style.height="2px";
					windowd.style.width="";
				
					windowd.postMessageCallBack=this.postMessage;
					windowd.appWindowID=windowID;
					windowd.appIDCallBack=id;
					windowd.onresize=function(){vidget.vidgetRunning[this.appIDCallBack].thread.postMessage([200,this.appIDCallBack,this.appWindowID,windowd.windowContentContainer.clientWidth,windowd.windowContentContainer.clientHeight])};
					//599, appCallbackUID, eleID, windowID, eventName,
					//console.log(window.windowContentContainer.clientHeight );
					windowd._offsetHeight=document.defaultView.innerHeight;
					windowd.onresize();
				} else if (vidget.vidgetRunning[id].flagSettings.type=="notificationBoard"){
				     var windowID=data[2][0];
				    var funcCallBack=function(msg){app.thread.postMessage([1599, this[0],this[1],msg])}.bind([id,windowID]);
					vidget.vidgetRunning[id].windows[data[2][0]+1] = windows.create("",data[2][2],funcCallBack,[id,data[2][0]+1]);
					vidget.vidgetRunning[id].windows[data[2][0]+1].windowTitleContainer.style.display="none";
					var app=vidget.vidgetRunning[id];
					app.documentElementCreatedArray[data[2][0]+1]=[];//new array element per window
					windowID=data[2][0]+1;
					var window = vidget.vidgetRunning[id].windows[windowID];
						window.postMessageCallBack=this.postMessage;
					window.className="";
					window.onfocusAction=function(){};
					infoPanelThingy.appendChild(window);
					window.appWindowID=windowID;
					window.appIDCallBack=id;
					window.onresize=function(){};
					window._offsetHeight=window.offsetHeight;
				
				}else{
				    var windowID=data[2][0];
				    var funcCallBack=function(msg){app.thread.postMessage([1599, this[0],this[1],msg])}.bind([id,windowID]);
					vidget.vidgetRunning[id].windows[data[2][0]+1] = windows.create(data[2][1],data[2][2],funcCallBack,[id,data[2][0]+1]);
					var app=vidget.vidgetRunning[id];
					app.documentElementCreatedArray[data[2][0]+1]=[];//new array element per window
					var windowID=data[2][0]+1;

					var window = vidget.vidgetRunning[id].windows[windowID];
					
					document.body.appendChild(window);
					window.postMessageCallBack=this.postMessage;
					window.appWindowID=windowID;
					window.appIDCallBack=id;
					window.onresize=function(){vidget.vidgetRunning[this.appIDCallBack].thread.postMessage([200,this.appIDCallBack,this.appWindowID,window.windowContentContainer.clientWidth,window.windowContentContainer.clientHeight])};
					//599, appCallbackUID, eleID, windowID, eventName,
					//console.log(window.windowContentContainer.clientHeight );
					window._offsetHeight=window.offsetHeight;
					
					//app.mainThread.postMessage
				}
            
            break;
        
        case 203: //window title update
            var window = vidget.vidgetRunning[id].windows[data[2][0] + 1];
            if (window) {
                window.windowTitleContainer.windowTitleText.windowTitleTextContainer.textContent = data[2][1];
				
                window.windowTitleContainer.onTitleUpdate();
            }
            break;
            
            
        
        case 402: //createElement (also appending it ot documentfragment)
            if (app) {
                //var ele = document.createElement(dataFromApp[1][0]);
                var localWindow=data[2][1]+1;
                var ele = document.createElement(data[2][0]);
                app.documentElementCreatedArray[localWindow][data[2][2]] = ele;
                if (data[2][0] == "img") {
                    ele.draggable = false;
                    ele.ondragstart = function(){return false};
                }
            }
            break;
        
        case 403: //appendChild
            if (app) {
                if (data[2][2] == -1) {	
                    app.windows[data[2][1] + 1].childNodes[1].appendChild(app.documentElementCreatedArray[data[2][1]+1][data[2][0].idNum]);
                }
                else if (app.documentElementCreatedArray[data[2][1]+1][data[2][2]]) {
                    app.documentElementCreatedArray[data[2][1]+1][data[2][2]].appendChild(app.documentElementCreatedArray[data[2][1]+1][data[2][0].idNum]);
                    var event = new CustomEvent("_onLoad", {"_scrollHeight":app.documentElementCreatedArray[data[2][1]+1][data[2][0].idNum].scrollHeight});
                    app.documentElementCreatedArray[data[2][1]+1][data[2][0].idNum].dispatchEvent(event);
                }
            }
            break;
        
        case 404: //setAttribute
            if (app) {
                    
                if (appDomArray) {
                    appDomArray.setAttribute(data[2][0], data[2][3]);
                    //some attribute need to update element's values like offsetHeight/width etc
                    var event = new CustomEvent("_onLoad", {"_scrollHeight":appDomArray.scrollHeight});
                    appDomArray.dispatchEvent(event);
                }
            }
            break;
        
        case 405: //textContent
            
            if (app) {
                if (appDomArray) {
                    appDomArray.textContent = (data[2][0]);
                }
            }
            break;
        
        case 406: //value
            if (app) {
                if (appDomArray) {
                    appDomArray.value = (data[2][0]);
                }
            }
            break;
        
        case 407: //disabled
            if (app) {
                if (appDomArray) {
                    appDomArray.disabled = (data[2][0]);
                }
            }
            break;
        
        case 408: //type
            if (app) {
                if (appDomArray) {
                    appDomArray.type = (data[2][0]);
                }
            }
            break;
        
        case 409: //checked
            if (app) {
                if (appDomArray) {
                    appDomArray.checked = (data[2][0]);
                }
            }
            break;
        
        case 410: //readonly
            if (app) {
                if (appDomArray) {
                    appDomArray.readonly = (data[2][0]);
                }
            }
            break;
        
        case 411: //name,  must be attached with appID otherwise multiple programs may be sharing same name and cause unepected behavior.
            if (app) {
                if (appDomArray) {
                    appDomArray.name = id + "_" + (data[2][0]);
                }
            }
            break;
        
        case 412: //text
            if (app) {
                if (appDomArray) {
                    appDomArray.text = (data[2][0]);
                }
            }
            break;
        
        case 413: //selectedIndex
            if (app) {
                if (appDomArray) {
                    appDomArray.selectedIndex = (data[2][0]);
                }5
            }
            break;
        
        case 414: //multiple
            if (app) {
                if (appDomArray) {
                    appDomArray.multiple = (data[2][0]);
                }
            }
            break;
        
        case 415: //size
            if (app) {
                if (appDomArray) {
                    appDomArray.size = (data[2][0]);
                }
            }
            break;
        
        case 416: //label
            if (app) {
                if (appDomArray) {
                    appDomArray.label = (data[2][0]);
                }
            }
            break;
        
        case 417: //selected
            if (app) {
                if (appDomArray) {
                    appDomArray.selected = (data[2][0]);
                }
            }
            break;
        
        case 418: //src
            if (app) {
                if (appDomArray) {
                    appDomArray.src = (data[2][0]);
                }
            }
            break;
        
        case 419: //alt
            if (app) {
                if (appDomArray) {
                    appDomArray.alt = (data[2][0]);
                }
            }
            break;
        
        case 420: //colSpan
            if (app) {
                if (appDomArray) {
                    appDomArray.colSpan = (data[2][0]);
                }
            }
            break;
        
        case 421: //rowSpan
            if (app) {
                if (appDomArray) {
                    appDomArray.rowSpan = (data[2][0]);
                }
            }
            break;
        case 422: //removeChild INCOMPLETE
           
           // Note we have to try to be careful this since doing it poorly adds big memory leak. 
           //For Javascript's garbage collector, this seems fine btu when it comes to DOM's, might be tricky not to leak.
           //By just doing element.innerHTML="" to remove, it introduce memory leak and unreliable DOM garabge collector action.
           //also doing element.parentNode.removeChild(element); where element is the same div element, this can also introduce memory leak
           //consider using delete element to remove it.
           //removeChild simply null the reference, not destroying the element linked to the reference.
           //always remember to delete object/events ffirst before removing its element to improve DOM's garbage collection
           //we  need more careful consideration about this
           //application may not be trying to destroy this child yet, so keep it in memory until the termination of application, which OS must destroy those elements to free up memory
           //to destroy it, the core.js must send destroy signal, so OS will destroy it right away without waiting uintil app's termination
           //Failing to do this correctly will lead Main thread (the OS) to have memory leaks. Thus eventually causing itself to crash at some point.
            if(app){ 
                if (data[2][1] == -1) {//as window appending elenent
                    app.windows[data[2][1]+1].childNodes[1].removeChild(app.documentElementCreatedArray[data[2][2]+1][data[2][0].idNum]);
                }
                else if (app.documentElementCreatedArray[data[2][2]+1][data[2][1]]) {//as element appending elemeent
                    app.documentElementCreatedArray[data[2][2]+1][data[2][1]].removeChild(app.documentElementCreatedArray[data[2][2]+1][data[2][0].idNum]);
                }
            
            }
            return;
        case 423: //innerHTML, incomplete
            if (app) {
                if (appDomArray) {
                    appDomArray.innerHTML = (data[2][0]);
                }
            }
            break;
        case 424: //className
            if (app) {
                if (appDomArray) {
                    appDomArray.className = (data[2][0]);
                }
            }
            break;
        case 425: //insertBefore
            if (app) {
                if (data[2][1] == -1) {
                   
                    app.windows[data[2][1] + 1].childNodes[1].insertBefore(app.documentElementCreatedArray[data[2][1]+1][data[2][0].idNum],app.documentElementCreatedArray[data[2][1]+1][dataFromApp[1][3]]);
                }
                else if (app.documentElementCreatedArray[data[2][2]+1][data[2][1]] && app.documentElementCreatedArray[data[2][2]+1][data[2][3]]) {
                    app.documentElementCreatedArray[data[2][2]+1][data[2][1]].
                    insertBefore(app.documentElementCreatedArray[data[2][2]+1][data[2][0].idNum],
                    app.documentElementCreatedArray[data[2][2]+1][data[2][3]]);
                }
            }
            break;
         case 426: //scrollTop
           if (app) {
                if (appDomArray) {
                    appDomArray.scrollTop =(data[2][0]) ;//(data[2][0])*1;
                }
            }
            break;
            
        case 427: //id, must be unique to each vidget application id
           if (app) {
                if (appDomArray) {
                     appDomArray.id = id + "_" + (data[2][0]);
                }
            }
            break;
        case 428: //list for datalist, must be unique to each vidget application
           if (app) {
                if (appDomArray) {
                     appDomArray.setAttribute("list", id + "_" + (data[2][0]));
                }
            }
            break;
            
         case 429: //placeholder
            if (app) {
                if (appDomArray) {
                    appDomArray.placeholder = (data[2][0]);
                }
            }
            break;  
        case 500: //addEventListener
            if (app) {
                if (app.documentElementCreatedArray[data[2][0].winID+1][data[2][0].idNum]) { //element event related    
                    var eleID = data[2][0].idNum;
                    var window= data[2][0].winID+1
                    //var appID=z[2];
                    //var appCallbackUID=z[1];
                    var appCallbackUID = id;
                    //var windowID=z[3][1][0].winID;
                    var windowID = data[2][0].winID;
                    var eventName = data[2][1];
                    //var eventID=z[3][1][2];
                    var eventID = data[2][2];
                    app.documentElementCreatedArray[window][eleID].addEventListener((data[2][1]), function(event) {
                        var app = vidget.vidgetRunning[appCallbackUID];//.documentElementCreatedArray[eleID];
                        var optionsSelectedArray;
                        if (app.documentElementCreatedArray[window][eleID].options) {
                            optionsSelectedArray = [];
                            var arr = app.documentElementCreatedArray[window][eleID].options;
                            var length = app.documentElementCreatedArray[window][eleID].options.length - 1;
                            for (var i = length; --i > 0; ) {
                                var d = optionsSelectedArray.length;
                                optionsSelectedArray[d] = arr[d].selected;
                            }
                        }
						var fileLength=0;
						var filesData=[];
						if(app.documentElementCreatedArray[window][eleID].files){
							//alert(Object.keys(app.documentElementCreatedArray[eleID].files[0]));
							fileLength=app.documentElementCreatedArray[window][eleID].files.length;
							var files=app.documentElementCreatedArray[window][eleID].files;
							for(var i=0;i<fileLength;i++){	
								filesData[i]={size:files[i].size,value:files[i].name,type:files[i].type,lastModifiedDate:files[i].lastModifiedDate}
							}
							
							//alert(event.dataTransfer.files);
						}
						var ele=app.documentElementCreatedArray[window][eleID];
                        app.thread.postMessage([599, appCallbackUID, eleID, windowID, eventName,
                            {
							
                                altKey: event.altKey,
                                button: event.button,
                                clientX: event.clientX,
                                clientY: event.clientY,
                                layerX:event.layerX,
                                layerY:event.layerY,
                                offsetX:event.offsetX,
                                offsetY:event.offsetY,
                                keycode:event.which||event.keyCode,
                                pageX:event.pageX,
                                pageY:event.pageY,
                                keyIdentifier: event.keyIdentifier,
                                keyLocation: event.location||event.keyLocation,
                                metaKey: event.metaKey,
                                relatedTarget: null,//need to expand this too; incomplete
                                screenX: event.screenX,
                                screenY: event.screenY,
                                lengthComputable: event.lengthComputable,
                                loaded : event.loaded ,
                                total : event.total,
                                shiftKey: event.shiftKey,
                                _checked: ele.checked, 
                                _scrollHeight: ele.scrollHeight, 
                                _scrollTop: ele.scrollTop, 
                                _value: ele.value,
                                _selectedIndex: ele.selectedIndex,
                                _selected: ele.selected,
								_filesLength:fileLength,
								_filesData:filesData,
                                _optionsSelectedIDs: optionsSelectedArray
                            }
                        , eventID]);
						//event.stopPropagation();
						//event.preventDefault();
                    }, false);
                }
                else if (data[2][0].idNum <= -1) { //document event related
                    alert(1);u
                    //var eleID=dataFromApp[1][0].idNum;
                    //var appID=z[2];
                    //var appCallbackUID=z[1];
                    var appCallbackUID = id;
                    //var windowID=z[3][1][0].winID;
                    var windowID = data[2][0].winID;
					
                    var eventName = data[2][1];
                    var window = app.windows[windowID + 1];
                    //var eventID=z[3][1][2];
                    var eventID = data[2][2];
                    
                    if (data[2][1] != "drag") { //can application api attach mouse events on entire window instead of content container?
                        window = window.windowContentContainer;
                    }
                    window.addEventListener(data[2][1], function(event) {
                        var app =  vidget.vidgetRunning[appCallbackUID];
						var window=app.windows[windowID+ 1 ];
                        app.thread.postMessage([599, appCallbackUID, eleID, windowID, eventName,
                            {
                                altKey: event.altKey,
                                button: event.button,
                                clientX: event.clientX - window.offsetLeft,
                                clientY: event.clientY - window.offsetTop- window.windowTitleContainer.offsetHeight,
                                pageX:event.pageX - window.offsetLeft,
                                pageY:event.pageY - window.offsetTop- window.windowTitleContainer.offsetHeight,
                                keyIdentifier: event.keyIdentifier,
                                keyLocation: event.keyLocation,
                                metaKey: event.metaKey,
                                relatedTarget: null, //need to expand this too; incomplete
                                screenX: event.screenX,
                                screenY: event.screenY,
                                shiftKey: event.shiftKey
                            }
                        , eventID]);
                    }, false);
                }
            }
            break;
        case 600: //ctx property assignment
            if (app) {
                var canvas = app.documentElementCreatedArray[data[2][2]+1][data[2][1]];
                canvas.ctx=canvas.getContext(data[2][0]);
            }
            break;
        case 601: //ctx property assignment
            
            if (app) {
            
                var canvas = app.documentElementCreatedArray[data[2][2]+1][data[2][1]];
                
                if (canvas.ctx) {
                    canvas.ctx[data[2][3]] = (data[2][0]);
                }
            }
            break;
        
        case 602: //ctx function caller assignment INCOMPLETE
            if (app) {
                var canvas = app.documentElementCreatedArray[data[2][2]+1][data[2][1]];
                if (canvas.ctx) {
                    var ctx = canvas.ctx;
                    
                    if (data[2][5] >= 0) {
                        //var appCallbackUID=z[1];
                        var appCallbackUID = id;
                        //alert([code, appCallbackUID, dataFromApp[1][4], ctx[dataFromApp[1][2]].apply(ctx,dataFromApp[1][3])]);
                        return app.mainThread.postMessage([code, appCallbackUID, data[2][5], ctx[data[2][3]].apply(ctx, data[2][4])]);
                    }
                    else {
                        ctx[data[2][3]].apply(ctx, data[2][4]);
                    }
                }
            }
            break;
        
        case 700: //initialize ajax xmlhttprequest  external
            if (app) {
                
                var hxr=app.xmlHttpRequestArray[dataFromApp[1][3]] = new XMLHttpRequest();
                hxr.open(dataFromApp[1][0],dataFromApp[1][1],dataFromApp[1][2]);
                
            }
            break;
        case 701: //xmlhttprequeest send
            if (app) {
                app.xmlHttpRequestArray[dataFromApp[1][1]].send(dataFromApp[1][0])
                
            }
            break;
        case 702: //setup or re-setup onstatechange event
            if (app) {
                if(dataFromApp[1]=='')return;
                var hxr=app.xmlHttpRequestArray[dataFromApp[1][0]];    
				if(!hxr)return;
                hxr.app=app;
                hxr.appID=id;
                hxr.id=dataFromApp[1][0];
                hxr.onreadystatechange=function(){
                    
                    app.mainThread.postMessage([702, this.appID, this.id, 
                            {readyState:this.readyState ,
                    response:this.response ,
                    responseType:this.responseType ,
                    responseText:this.responseText ,
                    responseXML:this.responseXML ,
                    status:this.status
                            }
                        ]);
                };
                
            }
		case 703: //uploadFile
            if (app) {
				//make sure to add security into path just in case application may be malicalious against user
                //var hxr=app.xmlHttpRequestUploadArray[dataFromApp[1][3]] = new XMLHttpRequest();
                //hxr.open(dataFromApp[1][0],dataFromApp[1][1],dataFromApp[1][2]);
				
				var eleID=dataFromApp[1].eleID;
				var fileID=dataFromApp[1].fileID;
				var path=dataFromApp[2];
				var file=app.documentElementCreatedArray[eleID].files[fileID];			
				var hxrID=dataFromApp[3];
				uploadFileToUserDirectory(file,path,function(progress,params){params[0].postMessage([702,params[1],params[2],progress]);},[app.mainThread,id,hxrID]);
                
            }
            break;
        case 704:// getDirectory
			var path=dataFromApp[1];			
			var hxrID=dataFromApp[2];
			//send back as 702, not 704 since this is a extension of case 702
			var hxr=getUserDirectory(path,function(d,response,hxr,params){params[0].postMessage([702,params[1],params[2],[d,response]]);},[app.mainThread,id,hxrID]);
		break;
	   case 705:// new directory
			var path=dataFromApp[1];
			var folderName=dataFromApp[2];			
			var hxrID=dataFromApp[3];
			//send back as 702, not 704 since this is a extension of case 702
			var hxr=newDirectory(path,folderName,function(d,response,hxr,params){params[0].postMessage([702,params[1],params[2],[d,response]]);},[app.mainThread,id,hxrID]);
		break;
		case 801://style DOM object element assigner
            app.documentElementCreatedArray[data[2][2]+1][data[2][1]].style[data[2][3]]=data[2][0];	
        break;
	    case 2000: //personal account usage from vidget
            if (app) {
                //alert(data[0]+" is trying to use your account");
                socket.sendListen({command:"account_"+data[2][0],data:JSON.stringify(data[2][2])},function(data){
                     this[0].thread.postMessage([2000, this[1],data,this[2]]);
                }.bind([app,id,(data[2][1])]));
                
            }
            break;
        
        case 1000: //run custom application from application, incomplete and may need to be removed when completed. //this is mainly for debugging
            //var bb = new Blob([],{type : "text\/plain" });            
            //var bcou=URL.createObjectURL(bb);
            
            applicationds.run(3, null, dataFromApp[1][0]);
            break;
        case 2000: //from application that wish to edit desktop system functionality/setting; should be forbidden by default
            //change wallpaper
            
            if(id>0){
             var window = applicationds.app[id].windows[applicationds.app[id].windows.length - 1];
              window.desktopParent.style.backgroundImage="url("+dataFromApp[1]+")";
              updateSystemSetting("wallpaper",window.desktopParent.style.backgroundImage);
            }else{
                
                mainDesktop.style.backgroundImage=dataFromApp;

            }
            break;
        case 2001: //from application, append CSS script to the global CSS.  should be forbidden by default
        //if they want to append css to the global CSS, they MUST provide ID to identify the css script. No exception should be made.
        //each style needs to be added to external script. Don't just add it to 
            if(id>0){
                var window = applicationds.app[id].windows[applicationds.app[id].windows.length - 1];
                createNewStyle(dataFromApp[2],'app'+id+"_"+dataFromApp[1]);
                appendToStartupExternalScript('systemStartupScript',"style_"+'app'+id+"_"+dataFromApp[1],dataFromApp[2]);
            }else{
                createNewStyle(dataFromApp[1],dataFromApp[0]);
            }
            //getDesktopSetting("style_"+'app'+id+"_"+dataFromApp[1],function(da,z){alert(z)});
            
            
            
        break;
        case 2002: //from application, load desktop setting file and send it back.  should be forbidden by default. incomplete
        //
            //var window = applicationds.app[id].windows[applicationds.app[id].windows.length - 1];     
            getDesktopSetting( dataFromApp,function(da,z,callback){if(da)threads.threadHandlers[0].postMessage([2002,null,[da,z]]);}, null);
        break;
        
        //case :
        //    
        //    break;
        
        default:
            console.log("UNKNOWN CODE: " + data);
        }//endof switch
    }
    
    d.onerror=function(message,filename,lineno){
        console.log([message,filename,lineno]);
    }
    d.postMessage(["ini",getAllStylePropertySupportedByThisBrowser]);//starts this thread handler
	this.threadHandlers.push(d);
	return d;
}
threads.createNewThread();
//threads.threadHandlers.forEach();

vidget.vidgetRunning={};
vidget.run=function(appID,threadHandlerID/*optional*/,stringScript/*optional*/,vidgetInfo,flagSettings){
    var app={};
	app.flagSettings=(flagSettings||{});
    app.document=document.createDocumentFragment();
    app.documentElementCreatedArray=[];
    app.xmlHttpRequestArray=[];
	app.filesAttached=[];
    app.windows=[];
    app.appID=appID;
    app.running=false;
    app.styleDocument=null;
	app.thread=threads.threadHandlers[0];
	app.thread.windows=app.windows;
	app.pID=appID+"|"+(Math.random()*Date.now());
    this.vidgetRunning[app.pID]=app;
	var xhr = new XMLHttpRequest();
	xhr.app=app;
	xhr.onreadystatechange = function () {
		if (this[0].readyState == 4) {
		    if(!this[1].styleDocument)
			    socket.sendListen({command:"readFile",data:JSON.stringify({"filePath": "main/vidget/"+this[1].appID+"/default.css"})},
			        function(json){
						
			            if(!json.data&&!json.data.message)return;
			           var sheet = document.createElement('style'); 
                        sheet.type="text/css"; 
			            this.styleDocument=sheet;
			            sheet.innerHTML=vidgetifyCSS("s"+this.pID.toString().replace(/[^a-zA-Z0-9_]/gi,""),String.fromCharCode.apply(String, json.data.message).replace(/\0/g,''));
                        document.body.appendChild(sheet);
			        }.bind(this[1]));
			 this[1].thread.postMessage([0,[this[0].responseText.toString(),this[1].pID,imgLogin.user.value]]);
			
		}
	}.bind([xhr,app]);

	xhr.open("GET", "main/vidget/"+appID+"/index.js", true);
	xhr.timeout = 4000;
	xhr.ontimeout = function () { alert("Vidget app server is timing out. Try again later."); }
	xhr.send(null);
	
    //app.mainThread=threads.threadHandlers[threadHandlerID?parseInt(threadHandlerID):0%threads.threadHandlers.length];
   // app.mainThread.postMessage([1,appID,stringScript]);
   
    return app;
}


function windows(){}
windows.ele=[];
windows.currentFocusInt=1500;

windowComnmandMenu=document.createElement("div");
windowComnmandMenu.functionRegressNaturally=function(){
    if(!windowComnmandMenu.parentNode)return;
    
    windowComnmandMenu.parentNode.removeChild(windowComnmandMenu);
    window.removeEventListener("click",windowComnmandMenu.functionRegressNaturally);
}
windowComnmandMenu.menuDeo=document.createElement("div");
windowComnmandMenu.menuDeo.className="windowMenuContext";
windowComnmandMenu.min=windowComnmandMenu.menuDeo.cloneNode(true);
windowComnmandMenu.min.textContent="*Poofy*";
windowComnmandMenu.min.onmousedown=function(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    return;
}
windowComnmandMenu.appendChild(windowComnmandMenu.min);
windowComnmandMenu.titleBarModeOnly=windowComnmandMenu.menuDeo.cloneNode(true);
windowComnmandMenu.titleBarModeOnly.textContent="*Collaspse*";
windowComnmandMenu.titleBarModeOnly.onmousedown=function(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    parent.toggleTitleBarMode(1);
}
windowComnmandMenu.appendChild(windowComnmandMenu.titleBarModeOnly);
windowComnmandMenu.max=windowComnmandMenu.menuDeo.cloneNode(true);
windowComnmandMenu.max.textContent="*Boings*";
windowComnmandMenu.max.onmousedown=function(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    parent.windowTitleContainer.windowActionContainer.windowActionMax.onclick();//maximumize;
}
windowComnmandMenu.appendChild(windowComnmandMenu.max);
windowComnmandMenu.close=windowComnmandMenu.menuDeo.cloneNode(true);
windowComnmandMenu.close.textContent="*Dismantles*";
windowComnmandMenu.close.onmousedown=function(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    parent.oncloseAction(1);//maximumize;
}
windowComnmandMenu.appendChild(windowComnmandMenu.close);
windowComnmandMenu.fullscreen=windowComnmandMenu.menuDeo.cloneNode(true);
windowComnmandMenu.fullscreen.textContent="*BOOM*";
windowComnmandMenu.fullscreen.onmousedown=function(){
    var parent=this.parentNode.parentNode.parentNode.parentNode;
    parent.doFullScren(1);//borderless full screen;
}

windowComnmandMenu.appendChild(windowComnmandMenu.fullscreen);
windowComnmandMenu.additionalOptionInterface=null;
windowComnmandMenu.updateOptions=function(ele){
    if(windowComnmandMenu.additionalOptionInterface)windowComnmandMenu.additionalOptionInterface.parentNode.removeChild(windowComnmandMenu.additionalOptionInterface);
    windowComnmandMenu.additionalOptionInterface=ele;
    windowComnmandMenu.appendChild(ele);
}
windowComnmandMenu.appendChild(windowComnmandMenu.fullscreen);
var focusedWindow;
windows.create=function(windowName,windowsOption,sendBack2Vidget,windowIdentity){//creates a new window
    var divOption=document.createElement("div");
    windowsOption=windowsOption||[];
    sendBack2Vidget=sendBack2Vidget||function(){};
    for(var i=windowsOption.length;--i>=0;){
        
        var optionWindow=windowComnmandMenu.menuDeo.cloneNode(true);
        optionWindow.textContent=optionWindow.textValue=windowsOption[i];
        optionWindow.onmousedown=function(){
            
            var parent=this.parentNode.parentNode.parentNode.parentNode.parentNode;
            parent.sendBack2Vidget(this.textValue);//borderless full screen;
            return windowComnmandMenu.functionRegressNaturally();
        }
        divOption.appendChild(optionWindow);
    
        windowComnmandMenu.appendChild(windowComnmandMenu.fullscreen);
    }
    var windowContainer=document.createElement("div");
    

    windowContainer.id="window"+windows.ele.length;
    windowContainer.className="windowContainer";
     windowContainer.titleOptions=divOption;
    windowContainer.identity =windowIdentity;
    windowContainer.sendBack2Vidget=sendBack2Vidget;
    if(!focusedWindow)focusedWindow=windowContainer;
    
    

    var windowTitleContainer=document.createElement("div");
    
    windowTitleContainer.id="title"+windows.ele.length;
    windowTitleContainer.className="windowTitleContainer";
    windowTitleContainer.onTitleUpdate=function(){}
    windows.ele[windows.ele.length]=windowContainer;
    windowContainer.windowTitleContainer=windowTitleContainer;
    var windowContentContainer=document.createElement("div");
    windowContentContainer.className="windowContentContainer s"+windowIdentity[0].toString().replace(/[^a-zA-Z0-9_]/gi,"");
   
    windowTitleContainer.onmousedown=function(eve){//lets window to be moved if allowed by options (placeholder)
        this.isMovable=true;
		this.offsettedX=eve.clientX-this.parentNode.offsetLeft;
		this.offsettedY=eve.clientY-this.parentNode.offsetTop;
		this.eventFunction=(function(eve){			
			if(!this.isMovable )return false;
			var windowContainer=this.parentNode
			var style=windowContainer.style;
			this.xPos=eve.clientX-this.offsettedX;
			this.yPos=eve.clientY-this.offsettedY;
			style.top=this.yPos+"px";
			style.left=this.xPos+"px";
			eve.stopPropagation();
			eve.preventDefault();
			eve.cancelBubble=true;
			eve.returnValue=false;
			return false;
			
		
			
		}.bind(this));
		window.addEventListener("mouseup",function(){
			window.removeEventListener("mouseup",this);
			document.removeEventListener("mousemove",this);
		}.bind(this.eventFunction));
		document.addEventListener("mousemove",(this.eventFunction),false);
		eve.preventDefault();
    }
    windowTitleContainer.onmouseup=function(){//window should no longer be draggable anywhere within once mouse is let off.
        this.isMovable=false;
		this.offsettedX=0;
		this.offsettedY=0;
		
		
    }
	windowTitleContainer.onmousemov2e=function(eve){
		
		
	}
    
    windowContainer.onfocusAction=function(){
        
        this.style.zIndex = ++windows.currentFocusInt;
        this.className+=(" windowContainerFocused ");

    }
    windowContainer.onBlurAction=function(){
        
        this.style.zIndex = --windows.currentFocusInt;
        this.className=this.className.replace(/windowContainerFocused/g,"");

    }
    windowContainer.onmousemove=function(event){//minor performance issue section (don't need to call every move. may need to use more timed periodically event);
        //determine window resize position
        var resizeTolerancePosition=3;
        var posX=event.clientX;
        var posY=event.clientY;
        
        var posLeft=posX-this.offsetLeft;
        var posTop=posY-this.offsetTop;
        var scursor="";
        
        
        this.isResizing=false;
        if(posTop<=resizeTolerancePosition && posTop>=0){
            scursor="n";
            this.resizeYtype=0;
        }
        else if((this.offsetHeight-posTop)<=resizeTolerancePosition && posTop<=this.offsetHeight){
            scursor="s";
            this.resizeYtype=1;
        }
        
        if(posLeft<=resizeTolerancePosition && posLeft>=0){
            scursor+="w-resize";
            this.resizeXtype=0;
        }
        else if((this.offsetWidth-posLeft)<=resizeTolerancePosition && posLeft<=this.offsetWidth){
            scursor+="e-resize";
            this.resizeXtype=1;
        }
        else if(scursor){//add -resize for previous condition (n and s)
            scursor+="-resize";
        }
        
        if(scursor){//add resizeEnable flagging to append resize event to the current events
            this.isResizing=true;
            if(this.draggable==true)
                 this.draggable=false;
            this.canChange=false;
        }else{
            this.isResizing=false;
            this.canChange=true;
            this.resizeXtype=-1;
            this.resizeYtype=-1;
        }
        if(scursor!=this.style.cursor)
        this.style.cursor=scursor;
    }
    windowContainer.isResizing=false;
    windowContainer.resizeXtype=-1;
    windowContainer.resizeYtype=-1;
    windowContainer.resizeEvent=function(event,element){
        var element=arguments.callee.ele;//not strict friendly
        if(!element.isResizing){
            return window.removeEventListener("onmousemove",element.resizeEvent);
        }
                
        var posX,posY,posWidth,posHeight=0;
        if(element.resizeYtype===0){
            var bottomPos=(element.offsetTop+element.offsetHeight);
            if(event.clientY<bottomPos){//prevents inversed resizing scenario
                posY=event.clientY;
                posHeight=bottomPos-event.clientY;
            }
        }
        else if(element.resizeYtype===1){
            if(event.clientY>element.offsetTop){//prevents inversed resizing scenario
                posY=element.offsetTop;
                posHeight=(event.clientY-element.offsetTop);
            }
        }else{
            posY=element.offsetTop;
            posHeight=element.offsetHeight;
        }
        
        if(element.resizeXtype===0){
            var rightPos=(element.offsetLeft+element.offsetWidth);
            if(event.clientX<rightPos){//prevents inversed resizing scenario
                posX=event.clientX;
                posWidth=rightPos-event.clientX;
            }
        }
        else if(element.resizeXtype===1){
            if(event.clientX>element.offsetLeft){//prevents inversed resizing scenario
                posX=element.offsetLeft;
                posWidth=(event.clientX-element.offsetLeft);
            }
        }
        else{
            posX=element.offsetLeft;
            posWidth=element.offsetWidth;
        }
        
        window.canvasOverlayScreenHelperResizer.overlayAt(posX,posY,posWidth,posHeight,element);
		event.preventDefault();
    }
    windowContainer.onmouseupResize=function(event){
            var element=arguments.callee.ele;
            window.canvasOverlayScreenHelperResizer.onmousemove=function(){}
            window.removeEventListener("onmousemove",element.resizeEvent);
            window.removeEventListener("mouseup",element.onmouseupResize);
            window.canvasOverlayScreenHelperResizer.hide();        
            
            if(!element)return;
            
            var posX,posY,posWidth,posHeight=0;
            if(element.resizeYtype===0){
                var bottomPos=(element.offsetTop+element.offsetHeight);
                if(event.clientY<bottomPos){//prevents inversed resizing scenario
                    posY=event.clientY;
                    posHeight=bottomPos-event.clientY;
                }
            }
            else if(element.resizeYtype===1){
                if(event.clientY>element.offsetTop){//prevents inversed resizing scenario
                    posY=element.offsetTop;
                    posHeight=(event.clientY-element.offsetTop);
                }
            }else{
                posY=element.offsetTop;
                posHeight=element.offsetHeight;
            }
            
            if(element.resizeXtype===0){
                var rightPos=(element.offsetLeft+element.offsetWidth);
                if(event.clientX<rightPos){//prevents inversed resizing scenario
                    posX=event.clientX
                    posWidth=(rightPos-event.clientX)
                }
            }
            else if(element.resizeXtype===1){
                if(event.clientX>element.offsetLeft){//prevents inversed resizing scenario
                    posX=element.offsetLeft;
                    posWidth=(event.clientX-element.offsetLeft);
                }
            }
            else{
                posX=element.offsetLeft;
                posWidth=element.offsetWidth;
            }
            
            element.style.left=posX+"px";
            element.style.top=posY+"px";
            var style=window.getComputedStyle(element,null);
            element.style.width=posWidth-( (parseInt(style.getPropertyValue("border-right-width")))+parseInt(style.getPropertyValue("border-left-width")) )+"px";
            element.style.height=posHeight-( (parseInt(style.getPropertyValue("border-top-width"))+parseInt(style.getPropertyValue("border-bottom-width"))) )+"px";
            element.isResizing=false;
            element.canChange=true;
            element.isMouseDown=false;
            //adjust window contents dynamically
            
            var freeSpaceLeftHeight=windowContainer.offsetHeight-( (parseInt(style.getPropertyValue("border-top-width"))+parseInt(style.getPropertyValue("border-bottom-width"))) )-windowContainer.windowTitleContainer.offsetHeight;
            var freeSpaceLeftWidth=windowContainer.offsetWidth-( (parseInt(style.getPropertyValue("border-right-width")))+parseInt(style.getPropertyValue("border-left-width")) );
            windowContainer.windowContentContainer.style.height=freeSpaceLeftHeight+'px';
            windowContainer.windowContentContainer.style.width=freeSpaceLeftWidth+'px';
            element.resizeItself()
    }
    windowContainer.onmousedown=function(event){
        if(focusedWindow)
            focusedWindow.onBlurAction();
        if(this.isResizing && !this.isMouseDown){
            var element=this;
            this.resizeEvent.ele=this;
            this.isMouseDown=true;
            this.onmouseupResize.ele=this;
            this.draggable=false;
            this.canChange=false;
            
            window.addEventListener("mousemove",element.resizeEvent,true);
            window.addEventListener("mouseup",element.onmouseupResize,false);
            window.canvasOverlayScreenHelperResizer.onmousemove=element.resizeEvent;
            window.canvasOverlayScreenHelperResizer.show(element);
             window.canvasOverlayScreenHelperResizer.zIndex=++windows.currentFocusInt;
            return;
        }
        focusedWindow=this;
        this.onfocusAction();
    }
    windowContainer.maximumize=function(){
        this.windowSizeOrgin=[this.offsetWidth,this.offsetHeight];
        this.windowPositionOrgin=[this.style.top,this.style.left];
        this.style.width=document.body.offsetWidth - 5 +"px";
        this.style.height=document.body.offsetHeight - 33 +"px";
        this.style.top=document.body.offsetTop+"px";
        this.style.left=document.body.offsetLeft+"px";
        this.canChange=false;
        this.resizeItself();
        
    }
    windowContainer.restore=function(){
        this.style.width=this.windowSizeOrgin[0]+"px";
        this.style.height=this.windowSizeOrgin[1]+"px";
        this.style.top=this.windowPositionOrgin[0];
        this.style.left=this.windowPositionOrgin[1];
        this.canChange=true;
        this.resizeItself();
        
    }
    windowContainer.windowSizeOrgin=[];
    windowContainer.windowPositionOrgin=[0,0];
    windowContainer.canChange=true;//can change window's properties.
    windowTitleContainer.isMouseDown=false;//not used yet
    windowContainer.oncloseAction=function(userDefinedEvent){
       var elementsToRemoveProperly=vidget.vidgetRunning[this.identity[0]].documentElementCreatedArray[this.identity[1]];
        offScreenDocumentFragment.appendChild(this);
       for(var i=elementsToRemoveProperly.length;--i>=0;){
          var ele= elementsToRemoveProperly[i];
          if(ele.parentNode)
            ele.parentNode.removeChild(ele);
          else{
            offScreenDocumentFragment.appendChild(ele);
            offScreenDocumentFragment.removeChild(ele);
          }
          delete ele;
           
       }
		offScreenDocumentFragment.removeChild(this);
		console.log([ this.identity[0],this.identity[1]])
		vidget.vidgetRunning[this.identity[0]].thread.postMessage([1598, this.identity[0],this.identity[1]-1]);
		delete vidget.vidgetRunning[this.identity[0]].documentElementCreatedArray[this.identity[1]];
		delete this;//this worked? I tho it's supposed to return false.
	}
	windowContainer.doFullScren=function(){
	    var elem = this;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
          elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        }
	}
	windowContainer.toggleTitleBarMode=function(userDefinedEvent){
        if(!this.toggleTitleBar){//restore
            this.windowContentContainer.style.display="none";
            this.toggleTitleBar=1;
        }else{//maximumize
             this.windowContentContainer.style.display="";
            this.toggleTitleBar=0;
        }
	}
    
    var windowTitleText=document.createElement("span");
    windowTitleText.className="windowTitleText";
    
   var windowTitleTextContainer=document.createTextNode("");
   windowTitleText.windowTitleTextContainer=windowTitleTextContainer;
    windowTitleText.appendChild(windowTitleTextContainer);
    windowName?(windowTitleTextContainer.textContent=windowName):(windowTitleTextContainer.textContent="vBlabinated Title");
    windowTitleText.onclick=function(event){//prevents parent function from running
        windowComnmandMenu.updateOptions(this.parentNode.parentNode.titleOptions)
        this.appendChild(windowComnmandMenu);
        event.stopPropagation();
       window.addEventListener("click",windowComnmandMenu.functionRegressNaturally,true)
    }
    
    var windowActionContainer=document.createElement("div");
    windowActionContainer.className="windowActionContainer"

    var windowActionClose=document.createElement("img");
    windowActionClose.className="windowActionCloseButton";
    windowActionClose.onclick=function(){
        var parent=this.parentNode.parentNode.parentNode;
		parent.oncloseAction(1);
    }
    windowActionClose.onmousedown=function(event){//prevents parent function from running
        event.stopPropagation();
        event.preventDefault();
    }
    
     var windowActionFullScreener=document.createElement("img");
    windowActionFullScreener.className="";
    windowActionFullScreener.onmousedown=function(event){//prevents parent function from running
        event.stopPropagation();
        event.preventDefault();
    }
  
    var windowActionMax=document.createElement("img");
    windowActionMax.className="windowActionMaxButton";
    windowActionMax.max=0;
    windowActionMax.onclick=function(){
        var parent=this.parentNode.parentNode.parentNode;
        if(windowActionMax.max){//restore
            parent.restore();
            this.max=0;
        }else{//maximumize
            parent.maximumize();
            this.max=1;
        }
    }
    windowActionMax.onmousedown=function(event){//prevents parent function from running
        event.stopPropagation();
        event.preventDefault();
    }
    windowActionMax.max = 0;
    
    windowContainer.appendChild(windowTitleContainer);
    windowTitleContainer.appendChild(windowTitleText);
    windowTitleContainer.windowActionContainer=windowActionContainer;
    windowTitleContainer.windowTitleText=windowTitleText;
    windowActionContainer.appendChild(windowActionMax);
    windowActionContainer.windowActionMax=windowActionMax;
    windowActionContainer.appendChild(windowActionClose);
    windowActionContainer.windowActionClose=windowActionClose;
    //windowContainer.appendChild(windowActionContainer);
    
    windowTitleContainer.appendChild(windowActionContainer);
    windowActionContainer.style.display="none";
    windowContainer.show=function(){
            this.style.display="block";
    }
    windowContainer.hide=function(){
        this.style.display="none";
    }
    windowContainer.resizeItself=function(){
        var style=window.getComputedStyle(this,null);
        var freeSpaceLeftHeight=this.offsetHeight-( (parseInt(style.getPropertyValue("border-top-width"))+parseInt(style.getPropertyValue("border-bottom-width"))) )-this.windowTitleContainer.offsetHeight;
        var freeSpaceLeftWidth=this.offsetWidth-( (parseInt(style.getPropertyValue("border-right-width")))+parseInt(style.getPropertyValue("border-left-width")) );
        this.windowContentContainer.style.height=freeSpaceLeftHeight+'px';
        this.windowContentContainer.style.width=freeSpaceLeftWidth+'px';
        if(this.onresize)
            this.onresize();
    }
    windowContainer.appendChild(windowContentContainer);
    windowContainer.windowContentContainer=windowContentContainer;
    windowContainer.toggleTitleBar=0;

    return windowContainer;
}

function callBack(vidgetID,a1,a2,a3,a4,a5,a6,a7,a8){
    vidget.vidgetRunning[vidgetID].thread.postMessage([600,vidgetID,a1,a2,a3,a4,a5,a6,a7,a8])
}