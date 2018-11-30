/*
Like index.js, but intialize multi-workers threads and loads them there.  


*/
//todo: get permission, add security layer. Detect abnormal performance behavior.
window=this;
var responseTimeArrayAppID=[];
var conto=0;
var opeActPerMS=1125;
var desktopSettingCallCount=0;
if (window.document==null) {
    var oldpostMessage=postMessage;
        
        postMessage=function(msg){
            var d=Date.now();
            if(d>responseTimeArrayAppID[msg[2]]){
                responseTimeArrayAppID[msg[2]]=d;
                oldpostMessage(msg);
                conto=0;
            }else if(d==responseTimeArrayAppID[msg[2]] && conto<opeActPerMS){
                oldpostMessage(msg);
                conto++;
                
            }
            return;
            
        }
    
    self.onmessage=function(event){//this don't need security check, since messages here are coming from OS.
        var data=event.data;
        var idEvent=data[0];
        if(idEvent==1){//run new app
            applications.newInstance(data[1],data[2]);
        }else if(idEvent==599){//send ongoing event to application
            applications.threads[data[1]].postMessage([599,data[2],data[3],data[4],data[5],data[6],data[7]]);
        }
        else if(idEvent==602){//send ongoing event to application
            applications.threads[data[1]].postMessage([602,data[2],data[3],data[4],data[5],data[6],data[7]]);
        }else if(idEvent==-232){//color an imgData  
            oldpostMessage([-232,data[1],colorize(data[2],data[3],data[4])]);           
        }
        else if(idEvent==-231){//color an imgData  
            loadDesktopSetting(data[1]);           
        }
        else if(idEvent==702){//send ongoing readystate event to xmlhttprequest   
           applications.threads[data[1]].postMessage([702,data[2],data[3],data[4],data[5],data[6],data[7]]);         
        }
        else if(idEvent==200){//update window changes (height, width, etc)
           applications.threads[data[1]].postMessage([200,data[2],data[3],data[4],data[5],data[6],data[7]]);         
        }
        else if(idEvent==2002){//process a external script json from main thread. 
          loadDesktopSetting(data[2][0]);    
        }
        
    }
    function applications(){}

    applications.threads=[];
    applications.threadsCount=0;
    applications.newInstance=function(appID,param){

        var applicaiton=new Worker('module/app'+appID+'/index.js');

        applicaiton.appID=appID;//app ID. points to original id
        applicaiton.id=++applications.threadsCount;//unique id for each running applicaiton
        applicaiton.loaded=false;
        applicaiton.param2Pass=param;
        applicaiton.coreEnabled=false;
        applications.threads[applications.threadsCount]=applicaiton;
        responseTimeArrayAppID[applicaiton.appID]=Date.now();
        
        applicaiton.onmessage=function(event){//this will need security check, since this is coming from application
            applicationPostMessageHandler(this, event.data, false);        
        };
    }

}
else if(window.document){//tempfix 
    function applicationst(){}
   postMessage=null;
    applicationst.threads=[];
    applicationst.threadsCount=0;
    applicationst.newInstance=function(appID,param){
        var applicaiton=new Worker('main/module/app'+appID+'/index.js');
        applicaiton.appID=appID;//app ID. points to original id
        applicaiton.id=++applicationst.threadsCount;//unique id for each running applicaiton
        applicaiton.loaded=false;
        applicaiton.coreEnabled=false;
        applicaiton.param2Pass=param;
        applicationst.threads[applicationst.threadsCount]=applicaiton;
        applicaiton.actualPostMessage=applicaiton.postMessage;
        applicaiton.postMessage=function(data){
		
            if(data[1]==null)return;
            var data=data;
            var idEvent=data[0];
            if(idEvent==1){//run new app
                
                //applicationst.newInstance(data[1],data[2]);
            }else if(idEvent==599){//send ongoing event to application
                this.actualPostMessage([599,data[2],data[3],data[4],data[5],data[6],data[7]]);
            }
            else if(idEvent==602){//send ongoing event to application
                this.actualPostMessage([602,data[2],data[3],data[4],data[5],data[6],data[7]]);
            }else if(idEvent==-232){//color an imgData  
                alert(1);
				oldpostMessage([-232,data[1],colorize(data[2],data[3],data[4])]);           
			}
			else if(idEvent==702){//send ongoing readystate event to xmlhttprequest   
				 this.actualPostMessage([702,data[2],data[3],data[4],data[5],data[6],data[7]]);         
			}
			else if(idEvent==200){//update window changes (height, width, etc)
				this.actualPostMessage([200,data[2],data[3],data[4],data[5],data[6],data[7]]);         
			}
        }
        applicaiton.onmessage = function(event) { //this will need security check, since this is coming from application
            applicationPostMessageHandler(this, event.data, true);
        };
        return applicaiton;
    }
    
        postMessage= function (arg){
            threads.threadHandlers[0].onmessage({data:arg})
            return;      
        }
}




function applicationPostMessageHandler(app, data, temp) {
    var code = data[0];
     
    switch (data[0]) {
    case -1: //console logging from application
        //send this to OS that this application wants its window resized
        break;
    
    case 1: //from core.js message at startup
        //send this to that this app is loaded
        code = 201;
        
        //send param back to core
        if (temp) {
            app.actualPostMessage([2, app.param2Pass]);
        }
        else {
            app.postMessage([2, app.param2Pass]);
        }
        break;
    
    case 24: //from core.js message
        //send this to OS that this application is connected to OS and running; (create a new window, load fragment, etc from there)
        code = 2;
        app.coreEnabled = data[1];
        break;
    
    case 201: //from igui.js message, resize window
        //send this to OS that this application wants its window resized
        break;
    
    case 202: //from igui.js message, new window
        //send this to OS that this application wants a new window generated
        break;
    
    case 203: //from igui.js message, window title update
        //send this to OS that this application wants a new window generated
        break;
    

    case 402: //from igui.js message, createElement
        //send this to OS that this application wants a new element created
        break;
    
    case 403: //from igui.js message, appendChild
        //send this to OS that this application wants to append Element to something
        break;
    
    case 404: //from igui.js message, setAttribute
        //send this to OS that this application wants to set attribute to something
        break;
    
    case 405: //from igui.js message, textContent
        //send this to OS that this application wants to set textContent;
        break;
    
    case 406: //from igui.js message, element value
        //send this to OS that this application wants to set value;
        break;
    
    case 407: //from igui.js message, element disabled
        //send this to OS that this application wants to set disabled;
        break;
    
    case 408: //from igui.js message, element type
        //send this to OS that this application wants to set type;
        break;
    
    case 409: //from igui.js message, element checked
        //send this to OS that this application wants to set checked;
        break;
    
    case 410: //from igui.js message, element readonly
        //send this to OS that this application wants to set readonly;
        break;
    
    case 411: //from igui.js message, element readonly
        //send this to OS that this application wants to set readonly;
        break;
    
    case 412: //from igui.js message, element readonly
        //send this to OS that this application wants to set readonly;
        break;
    
    case 413: //from igui.js message, element readonly
        //send this to OS that this application wants to set readonly;
        break;
    
    case 414: //from igui.js message, element multiple
        //send this to OS that this application wants to set multiple;
        break;
    
    case 415: //from igui.js message, element size
        //send this to OS that this application wants to set size;
        break;
    
    case 416: //from igui.js message, element label
        //send this to OS that this application wants to set label;
        break;
    
    case 417://from igui.js message, element selected
        //send this to OS that this application wants to set selected;
        break;
    
    case 418: //from igui.js message, element src. Incompleted permission, incompleted replace regexp; temporary security in place;
        //note: make sure src stays within in its app folder, not ouside of the app folder.
        //unless a user may want to add permission to allow that to happen
        //external reference or domain should be banned default, unless user allows it.
        if(false)
            data[1][0] = "module/app" + app.appID + "/" + data[1][0].toString().replace("..", "").replace(/(http|https):/, "").replace(/(www\.)/, "");
        //send this to OS that this application wants to set src;
        break;
    
    case 419: //from igui.js message, element alt
        //send this to OS that this application wants to set alt;
        break;
    
    case 420: //from igui.js message, element colSpan
        //send this to OS that this application wants to set alt;
        break;
    
    case 421: //from igui.js message, element rowSpan
        //send this to OS that this application wants to set alt;
        break;
    case 422: //from igui.js message, removeChild. 
        //send this to OS that this application wants this element removed
        break;
    case 423: //from igui.js message, innerHTML. 
        //send this to OS that this application wants to apply innerHTML attribute
        break;
    case 424: //from igui.js message, innerHTML. 
        //send this to OS that this application wants to apply innerHTML attribute
        break;
    case 425: //from igui.js message, insertbefore. 
        //send this to OS that this application wants to call insertbefore
        break;    
	case 426: //from igui.js message, width. 
        //send this to OS that this application wants to set width
        break;    
	case 427: //from igui.js message, height. 
        //send this to OS that this application wants to set height
        break;    
	case 428: //from igui.js message, tabIndex. 
        //send this to OS that this application wants to set tabIndex
        break;    
    case 500: //from igui.js message, addEventListener
        //send this to OS that this application wants to set textContent;
        break;
    
    case 600: //from igui.js message, getContext
        //send this to OS that this application wants to set fillStyle;
        break;
    
    case 601: //from igui.js message, getContext properties assigner (note: inspect performance afterward)
        //send this to OS that this application wants to set getContext property (may be anything non-function);
        break;
    
    case 602: //from igui.js message, getContext function caller (note: inspect performance afterward)
        //send this to OS that this application wants to call ctx function
        break;
    
    case 700: //from igui.js message,
        //send this to OS that this application wants to call ctx function
        break;
        
    case 701: //from igui.js message,
        //send this to OS that this application wants to call ctx function
        break;
        
    case 702: //from igui.js message,
        //send this to OS that this application wants to call ctx function
        break;   
	case 703: //from igui.js message,
        //send this to OS that this application wants to upload a file
        break;   
	case 704: //from igui.js message,
        //send this to OS that this application wants to get directory listing
        break;   		
    case 705: //from igui.js message,
        //send this to OS that this application wants to create a new directory
        break;    
    
    case 1000: //from igui.js message,
        //send this to OS that this application wants to run a new application based on a string.
        break;
    case 2000: //from igui.js message,
        //send this to OS that this application wants to run a new application based on a string.
        break;
    case 2001: //from igui.js message,
        //send this to OS that this application wants to run a new application based on a string.
        break;
    
    default:
        code = -1;
    }//endof switch
    
    //send message repsonse
    postMessage([code, app.id, app.appID, data]);
    
}


function colorize(imgObjectData,fromrgba,torgba){
    for (i = 0, n = imgObjectData.length; i < n; i += 4) {
        if( (imgObjectData[i]>=fromrgba[0]&&imgObjectData[i+1]>=fromrgba[1]&&imgObjectData[i+2]>=fromrgba[2])&& 
        ( (imgObjectData[i]<=fromrgba[4]&&imgObjectData[i+1]<=fromrgba[5]&&imgObjectData[i+2]<=fromrgba[6])) )
        {
            imgObjectData[i] =  (imgObjectData[i]+torgba[0])%255;   // red
            imgObjectData[i+1] = (imgObjectData[i+1]+torgba[1])%255;   // green
            imgObjectData[i+2] = (imgObjectData[i+2]+torgba[2])%255;// blue
        }
    }
    return imgObjectData;
}

function loadDesktopSetting(dataSetting){
    if(!dataSetting)return;
    if(typeof dataSetting=="string")dataSetting=JSON.parse(JSON.parse(dataSetting));
    if(dataSetting.wallpaper){
        oldpostMessage([2000, 0, 0, dataSetting.wallpaper]);
        delete dataSetting.wallpaper;
    }
    if(dataSetting.externalScript){
        oldpostMessage([2002,0,0,dataSetting.externalScript,0]);//this should be done by the first security thread
        delete dataSetting.externalScript;
    }
     
    for(prop in dataSetting){
      
        if(prop.substring(0,5)=="style"){            
            oldpostMessage([2001, 0, 0, [prop.substring(6,prop.length),dataSetting[prop]]]);
             
        }
    }
}

