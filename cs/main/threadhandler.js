//thread handle on OS side, bridges to wwThread.js (web worker,security layer between os and applications) which then bridges to applications
function threads(){}
    threads.threadHandlers=[new Worker("main/wwthreads.js")];//initially loads one thread handler (more can be spawned, if desired later). It can use multiple versions of thread handlers (each applicaiton may have different needs... thus different kind of scripting output,etc);

threadsrunApp=function(appId,parameter){
    
}

threads.threadHandlers.forEach(function(d) {
    d.onmessage = function(z) {
        var data = z.data;
        
        var code        = data[0];
        var id          = data[1];
        var appID       = data[2];
        var dataFromApp = data[3];
        
        var app         = undefined;
        var appDomArray = undefined;
        
        //code that are greater than 400s
        if (code >= 400 && id>0) {
            app = applicationds.app[id];
            
            //only for 400s
            if (app && (code >= 404 && code < 500)) {
                appDomArray = app.documentElementCreatedArray[dataFromApp[1][1]];
            }
        }
      
        switch (code) {
         case -232: //from wwThread.js colorizing an imagedata
            globalEventForThreads[data[1]](data[2]);
            return;

            break;
        case -1: //from application (went through wwThread.js) console logging
            dataFromApp = data[3][1];
            console.log(dataFromApp);
            break;
        
        case 2: //from application (went through wwThread.js)
            applicationds.app[id].running = true;
            break;
        
        case 201: //resize
			
            var window = applicationds.app[id].windows[dataFromApp[1][2] + 1];
            if (window) {
                window.style.height = dataFromApp[1][1] + "px"
                window.style.width = dataFromApp[1][0] + "px";
                window.resizeItself();
            }
            break;
        
        case 202: //new window
            if (dataFromApp[1][0] == -1) {//see if window is -1, if so generate it as app's main window
                applicationds.app[id].windows[applicationds.app[id].windows.length] = windows.create(dataFromApp[1][1]);
                var windowID=applicationds.app[id].windows.length-1;
                var window = applicationds.app[id].windows[windowID];
                window.show();
                window.postMessageCallBack=applicationds.app[id].mainThread.postMessage;
                window.moveToDesktop();
                window.appWindowID=windowID;
                window.appIDCallBack=id;
                window.onresize=function(){applicationds.app[this.appIDCallBack].mainThread.postMessage([200,this.appIDCallBack,this.appWindowID,window.windowContentContainer.clientWidth,window.windowContentContainer.clientHeight])};
                //599, appCallbackUID, eleID, windowID, eventName,
                //console.log(window.windowContentContainer.clientHeight );
                window._offsetHeight=window.offsetHeight;
                //app.mainThread.postMessage
            }
            break;
        
        case 203: //window title update
            var window = applicationds.app[id].windows[dataFromApp[1][0] + 1];
            if (window) {
                window.windowTitleContainer.windowTitleText.textContent = dataFromApp[1][1];
                window.windowTitleContainer.onTitleUpdate();
            }
            break;
            
            
        
        case 402: //createElement (also appending it ot documentfragment)
            if (app) {
                //var ele = document.createElement(dataFromApp[1][0]);
                var ele = createDom(dataFromApp[1][0]);
                app.documentElementCreatedArray[dataFromApp[1][2]] = ele;
				ele.onkeydown=function(event){
					if(event.keyCode==8 && KeyboardEvent){
						event.preventDefault();//prevents backspace navigation issue in some text programs
						var e;
						if(!isIE10 && !isFirefox){//chrome (maybe needed for opera and webkit); firefox is not needed since it is processing the event within expectations.
							e=new CustomEvent("keypress",{bubbles : true, cancelable : true, keyCode :8, char : 0, shiftKey : event.shiftKey});
							delete e.keyCode;
							Object.defineProperty(e,"keyCode",{value:8});
							this.dispatchEvent(e);
						}else if(isIE10){//ie10 only
							e=document.createEvent("KeyboardEvent");
							e.initKeyboardEvent("keypress", true, true, null, 8, false,false,false,0,0);
							this.dispatchEvent(e);
						}
						
					}
				}
                if (dataFromApp[1][0] == "img") {
                    ele.draggable = false;
                    ele.ondragstart = function(){return false};
                }
            }
            break;
        
        case 403: //appendChild
            if (app) {
                if (dataFromApp[1][2] == -1) {
                    app.windows[dataFromApp[1][2] + 1].childNodes[1].appendChild(app.documentElementCreatedArray[dataFromApp[1][0].idNum]);
                }
                else if (app.documentElementCreatedArray[dataFromApp[1][2]]) {
                    app.documentElementCreatedArray[dataFromApp[1][2]].appendChild(app.documentElementCreatedArray[dataFromApp[1][0].idNum]);
                }
            }
            break;
        
        case 404: //setAttribute
            if (app) {
                if (appDomArray) {
                    appDomArray.setAttribute(dataFromApp[1][0], dataFromApp[1][2]);
                }
            }
            break;
        
        case 405: //textContent
            if (app) {
                if (appDomArray) {
                    appDomArray.textContent = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 406: //value
            if (app) {
                if (appDomArray) {
                    appDomArray.value = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 407: //disabled
            if (app) {
                if (appDomArray) {
                    appDomArray.disabled = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 408: //type
            if (app) {
                if (appDomArray) {
                    appDomArray.type = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 409: //checked
            if (app) {
                if (appDomArray) {
                    appDomArray.checked = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 410: //readonly
            if (app) {
                if (appDomArray) {
                    appDomArray.readonly = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 411: //name,  must be attached with appID otherwise multiple programs may be sharing same name and cause unepected behavior.
            if (app) {
                if (appDomArray) {
                    appDomArray.name = id + "_" + (dataFromApp[1][0]);
                }
            }
            break;
        
        case 412: //text
            if (app) {
                if (appDomArray) {
                    appDomArray.text = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 413: //selectedIndex
            if (app) {
                if (appDomArray) {
                    appDomArray.selectedIndex = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 414: //multiple
            if (app) {
                if (appDomArray) {
                    appDomArray.multiple = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 415: //size
            if (app) {
                if (appDomArray) {
                    appDomArray.size = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 416: //label
            if (app) {
                if (appDomArray) {
                    appDomArray.label = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 417: //selected
            if (app) {
                if (appDomArray) {
                    appDomArray.selected = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 418: //src
            if (app) {
                if (appDomArray) {
                    appDomArray.src = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 419: //alt
            if (app) {
                if (appDomArray) {
                    appDomArray.alt = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 420: //colSpan
            if (app) {
                if (appDomArray) {
                    appDomArray.colSpan = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 421: //rowSpan
            if (app) {
                if (appDomArray) {
                    appDomArray.rowSpan = (dataFromApp[1][0]);
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
                if (dataFromApp[1][2] == -1) {//as window appending elenent
                    app.windows[dataFromApp[1][2] + 1].childNodes[1].removeChild(app.documentElementCreatedArray[dataFromApp[1][0].idNum]);
                }
                else if (app.documentElementCreatedArray[dataFromApp[1][2]]) {//as element appending elemeent
                    app.documentElementCreatedArray[dataFromApp[1][2]].removeChild(app.documentElementCreatedArray[dataFromApp[1][0].idNum]);
                }
            }
        case 423: //innerHTML, incomplete
            if (app) {
                if (appDomArray) {
                    appDomArray.innerHTML = (dataFromApp[1][0]);
                }
            }
            break;
        case 424: //className
            if (app) {
                if (appDomArray) {
                    appDomArray.className = (dataFromApp[1][0]);
                }
            }
            break;
        case 425: //insertBefore
            if (app) {
                if (dataFromApp[1][2] == -1) {
                    app.windows[dataFromApp[1][2] + 1].childNodes[1].insertBefore(app.documentElementCreatedArray[dataFromApp[1][0].idNum],app.documentElementCreatedArray[dataFromApp[1][3]]);
                }
                else if (app.documentElementCreatedArray[dataFromApp[1][2]] && app.documentElementCreatedArray[dataFromApp[1][3]]) {
                    app.documentElementCreatedArray[dataFromApp[1][2]].insertBefore(app.documentElementCreatedArray[dataFromApp[1][0].idNum],app.documentElementCreatedArray[dataFromApp[1][3]]);
                }
            }
            break;
		case 426: //width (for canvas)
             if (app) {
                if (appDomArray) {
                    appDomArray.width = (dataFromApp[1][0]);
                }
            }
			break;
		case 427: //height (for canvas)
            if (app) {
                if (appDomArray) {
                    appDomArray.height = (dataFromApp[1][0]);
                }
            }
            break;
		case 428: //tabindex
            if (app) {
                if (appDomArray) {
                    appDomArray.tabIndex = (dataFromApp[1][0]);
                }
            }
            break;
        case 500: //addEventListener
            if (app) {
			
                if (app.documentElementCreatedArray[dataFromApp[1][0].idNum]) { //element event related    
                    var eleID = dataFromApp[1][0].idNum;
                    //var appID=z[2];
                    //var appCallbackUID=z[1];
                    var appCallbackUID = id;
                    //var windowID=z[3][1][0].winID;
                    var windowID = dataFromApp[1][0].winID;
                    var eventName = dataFromApp[1][1];
                    //var eventID=z[3][1][2];
                    var eventID = dataFromApp[1][2];
					var eventFunctions = dataFromApp[1][3];
                    
                    app.documentElementCreatedArray[eleID].addEventListener((dataFromApp[1][1]), function(event) {
						if(eventFunctions){						
							eventFunctions.forEach(function(d){this[d]();},event);//preventDefaulr or stopPropergation
							}
                        var app = applicationds.app[appCallbackUID];//.documentElementCreatedArray[eleID];
                        var optionsSelectedArray;
                        if (app.documentElementCreatedArray[eleID].options) {
                            optionsSelectedArray = [];
                            var arr = app.documentElementCreatedArray[eleID].options;
                            var length = app.documentElementCreatedArray[eleID].options.length - 1;
                            for (var i = length; --i > 0; ) {
                                var d = optionsSelectedArray.length;
                                optionsSelectedArray[d] = arr[d].selected;
                            }
                        }
						var fileLength=0;
						var filesData=[];
						if(app.documentElementCreatedArray[eleID].files){
							//alert(Object.keys(app.documentElementCreatedArray[eleID].files[0]));
							fileLength=app.documentElementCreatedArray[eleID].files.length;
							var files=app.documentElementCreatedArray[eleID].files;
							for(var i=0;i<fileLength;i++){	
								filesData[i]={size:files[i].size,value:files[i].name,type:files[i].type,lastModifiedDate:files[i].lastModifiedDate}
							}
							
							//alert(event.dataTransfer.files);
						}
						
						app.mainThread.postMessage([599, appCallbackUID, eleID, windowID, eventName,
                            {
                                altKey: event.altKey,
                                button: event.button,
                                clientX: event.clientX,
                                clientY: event.clientY,
                                keyIdentifier: event.keyIdentifier,
                                keyLocation: event.keyLocation,
								keyCode: event.keyCode||event.key,
								char: event.char||event.charCode,//event.charCode is deprecated and will need to be removed later
                                metaKey: event.metaKey,
                                relatedTarget: null,//need to expand this too; incomplete
                                screenX: event.screenX,
                                screenY: event.screenY,
                                lengthComputable: event.lengthComputable,
                                loaded : event.loaded ,
                                total : event.total,
                                shiftKey: event.shiftKey,
                                _checked: app.documentElementCreatedArray[eleID].checked,                            
                                _value: app.documentElementCreatedArray[eleID].value,
                                _selectedIndex: app.documentElementCreatedArray[eleID].selectedIndex,
                                _selected: app.documentElementCreatedArray[eleID].selected,
								_filesLength:fileLength,
								_filesData:filesData,
                                _optionsSelectedIDs: optionsSelectedArray
                            }
                        , eventID]);
						
						return false;
                    }, false);
                }
                else if (dataFromApp[1][0].idNum <= -1) { //document event related
                    //var eleID=dataFromApp[1][0].idNum;
                    //var appID=z[2];
                    //var appCallbackUID=z[1];
                    var appCallbackUID = id;
                    //var windowID=z[3][1][0].winID;
                    var windowID = dataFromApp[1][0].winID;
                    var eventName = dataFromApp[1][1];
                    var window = app.windows[windowID + 1];
                    //var eventID=z[3][1][2];
                    var eventID = dataFromApp[1][2];
                    
                    if (dataFromApp[1][1] != "drag") { //can application api attach mouse events on entire window instead of content container?
                        window = window.windowContentContainer;
                    }
                    window.addEventListener(dataFromApp[1][1], function(event) {
                        var app = applicationds.app[appCallbackUID];
                        app.mainThread.postMessage([599, appCallbackUID, eleID, windowID, eventName,
                            {
                                altKey: event.altKey,
                                button: event.button,
                                clientX: event.clientX - app.windows[windowID + 1].offsetLeft,
                                clientY: event.clientY - app.windows[windowID+ 1 ].offsetTop,
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
            
                var canvas = app.documentElementCreatedArray[dataFromApp[1][1]];
                canvas.ctx=canvas.getContext(dataFromApp[1][0]);
            }
            break;
        case 601: //ctx property assignment
            
            if (app) {
            
                var canvas = app.documentElementCreatedArray[dataFromApp[1][1]];
                
                if (canvas.ctx) {
                     
                    canvas.ctx[dataFromApp[1][2]] = (dataFromApp[1][0]);
                }
            }
            break;
        
        case 602: //ctx function caller assignment INCOMPLETE
           
            if (app) {
                var canvas = app.documentElementCreatedArray[dataFromApp[1][1]];
				
                if (canvas.ctx) {
                 
                    var ctx = canvas.ctx;
                  
                    if (dataFromApp[1][4] >= 0) {
                        //var appCallbackUID=z[1];
                        var appCallbackUID = id;
						alert(1);
                        //alert([code, appCallbackUID, dataFromApp[1][4], ctx[dataFromApp[1][2]].apply(ctx,dataFromApp[1][3])]);
                        return app.mainThread.postMessage([code, appCallbackUID, dataFromApp[1][4], ctx[dataFromApp[1][2]].apply(ctx, dataFromApp[1][3])]);
                    }
                    else {
                        ctx[dataFromApp[1][2]].apply(ctx, dataFromApp[1][3]);
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
            console.log("UNKNOWN CODE: " + code);
        }//endof switch
    }
    
    d.onerror=function(message,filename,lineno){
        
    }
    d.postMessage("");//starts this thread handler

});

function applicationds(){}
applicationds.app=[{}];
applicationds.run=function(appID,threadHandlerID/*optional*/,stringScript/*optional*/){
    var app=new Object();
    app.document=document.createDocumentFragment();
    app.documentElementCreatedArray=[];
    app.xmlHttpRequestArray=[];
	app.filesAttached=[];
    app.windows=[];
    app.appID=appID;
    app.running=false;
    app.mainThread=null;
    this.app[this.app.length]=app;
    //app.id;
    if(window.chrome){
        app.mainThread=applicationst.newInstance(appID,stringScript);
        
    }else{  
        app.mainThread=threads.threadHandlers[threadHandlerID?parseInt(threadHandlerID):0%threads.threadHandlers.length];
        app.mainThread.postMessage([1,appID,stringScript]);
    }
    return app;
}


