
if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1)//temp fixer
        window.chrome=true;//temp fixer; makes wwThread operate in same thread as OS; this is insecure operation as application could break this easily somehow.        
else//temp fixer
        window.chrome=false;//temp fixer; change this to false later when you want wwthread to be its on thread.
isIE10 = false;
    /*@cc_on
        if (/^10/.test(@_jscript_version)) {
            isIE10 = true;
        }
    @*/
isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox/') > -1;

if(window.chrome){
                var scriptTempFix=document.createElement("script");
                scriptTempFix.src='main/wwthreads.js';
                document.getElementsByTagName("head")[0].appendChild(scriptTempFix);
        }
window.canvasOverlayScreenHelper=null;
loginBoxUI=null;
function onload(){
   loginScreenUIContainer=document.createElement("div");
    loginScreenUIContainer.className="loginScreenUIContainer";
    loginBoxUI=document.createElement("div");
    loginBoxUI.className="loginBoxUI";
    loginScreenUIContainer.appendChild(loginBoxUI);
    document.body.appendChild(loginScreenUIContainer);
    var optionBoxUser=document.createElement("div");
    optionBoxUser.className="optionBoxUser";
    var optionCreateAccount=document.createElement("a");
    optionCreateAccount.textContent="[Sign Up]";
	optionCreateAccount.style.color="gray";
        optionCreateAccount.className="optionLoginLink";
    optionCreateAccount.href="#";
    optionCreateAccount.onclick=function(){
         loginBoxUI.style.display="none";
           generateRegisterationUI(loginScreenUIContainer);
          
    }
    optionBoxUser.appendChild(optionCreateAccount);
        
        var optionUseGuest=document.createElement("a");
    optionUseGuest.textContent="[Guest account]";
        optionUseGuest.className="optionLoginLink";
		optionUseGuest.style.color="gray";
    optionUseGuest.href="#";
        optionUseGuest.onclick=function(){
                mainDesktop.show();
                mainDesktop.appendToDom();
                loginScreenUIContainer.style.display="none";
                loginScreenUIContainer.parentNode.removeChild(loginScreenUIContainer);
                delete loginScreenUIContainer;
        };
    optionBoxUser.appendChild(optionUseGuest);
	
	    var optionLogin=document.createElement("a");
    optionLogin.textContent="Sign In";
        optionLogin.className="optionLoginLink";
    optionLogin.href="#";
        optionLogin.onclick=function(){

        };
    optionBoxUser.appendChild(optionLogin);
    
   
    var logoBox=document.createElement("img");   
    logoBox.src="light_004.gif";
	logoBox.onload=function(){
		
		this.onload=function(){};
		var ctx=canvasOverlayScreenHelperResizer.getContext("2d");
		ctx.drawImage(this,0,0);
		this.src=canvasOverlayScreenHelperResizer.toDataURL();
	}
	
    logoBox.className="logoBox";

    logoBox.onclick=function(){
        if(this.passWordInput && this.userNameInput){
                        this.onclick=function(){};
                        var gra=0;
                         var xhr = new XMLHttpRequest(); 
          
             xhr.open("GET","../ss/db.php?verifyAccount="+encodeURIComponent(this.userNameInput.value)+"&password="+encodeURIComponent(this.passWordInput.value),false);
               xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
			   logoBox.src="light_004.gif"
               xhr.loading=setInterval(function(){},4500);
               xhr.userSetting=[this.userNameInput.value,this.passWordInput.value]
              xhr.onreadystatechange= function(e){
              
                if(this.status == 200 && this.readyState == 4){
              
                    var json=JSON.parse(this.responseText);
                         
                                if(json[0]){
                                        errorDBox.textContent="-";
                                        errorDBox.style.color="";
                                        loginScreenUIContainer.style.display="none";
                                        network.cookiesPretend["u"]=this.userSetting[0];
                                        network.cookiesPretend["p"]=json[1];
                                        generateSystemBoxUI();

                                        
                                }else{
                                        errorDBox.textContent="Error:  Invalid User/Password given.";
                                        errorDBox.style.color="red";
                                        clearInterval(this.loading);
                                        
                                }
                }
            }
         xhr.send(null);
         xhr.u=null;               
 
        }
    }
	
    logoBox.draggable=false;
    logoBox.ondragstart=function(){return false};
    var errorDBox=document.createElement("div");
    errorDBox.className="inputContainerWithField";
    var errorDBoxField=document.createElement("span");
    errorDBoxField.textContent="-";
    errorDBox.appendChild(errorDBoxField);
        
    var userName=document.createElement("div");
    userName.className="inputContainerWithField";
    var userNameField=document.createElement("canvas");
    userNameField.textContent="Username ";
	var ctx=userNameField.getContext("2d");
	userNameField.width=230;
	userNameField.height=30;
	ctx.font="20pt Times New Roman ";
	ctx.strokeStyle="red";	
	ctx.strokeText("Username:",115,25);
	ctx.strokeStyle="yellow";	
	ctx.strokeText("Username:",115,24);
	ctx.strokeStyle="red";	
	ctx.strokeText("Username:",115,26);

	ctx.fillStyle="white";	
	ctx.fillText("Username:",115,25);
		ctx.strokeStyle="rgba(0,0,0,0.7)";	
	ctx.strokeText("Username:",115,25);
	var famousQuote=document.createElement("canvas");
	famousQuote.width=330;
	famousQuote.height=30;
	var ctx=famousQuote.getContext("2d");
	ctx.fillStyle="white";	
	ctx.fillText("A mighty flame followeth a tiny spark.",115,25);
	

    var userNameInput=document.createElement("input");
    userName.appendChild(userNameField);
    userName.appendChild(userNameInput);
    
    var passWord=document.createElement("div");
    passWord.className="inputContainerWithField";
    var passWordField=document.createElement("canvas");
    passWordField.textContent="Password ";
		passWordField.width=230;
	passWordField.height=30;
	var ctx=passWordField.getContext("2d");
	ctx.font="20pt Times New Roman ";
	ctx.strokeStyle="red";	
	ctx.strokeText("Password:",115,25);
	ctx.strokeStyle="yellow";	
	ctx.strokeText("Password:",115,24);
	ctx.strokeStyle="red";	
	ctx.strokeText("Password:",115,26);

	ctx.fillStyle="white";	
	ctx.fillText("Password:",115,25);
	ctx.strokeStyle="rgba(0,0,0,0.7)";	
	ctx.strokeText("Password:",115,25);
    var passWordInput=document.createElement("input");
    passWord.appendChild(passWordField);
    passWord.appendChild(passWordInput);
    logoBox.userNameInput=userNameInput;
    logoBox.passWordInput=passWordInput;
        loginBoxUI.appendChild(errorDBox);
    loginBoxUI.appendChild(userName);
    loginBoxUI.appendChild(passWord);
	  loginBoxUI.appendChild(optionBoxUser);
	 loginBoxUI.appendChild(famousQuote);
	 
        mainDesktop=desktops.create();
		mainDesktop.style.userSelect="none";
		mainDesktop.style.marginTop="0px"
		mainDesktop.style.marginLeft="0px"
        document.body.onmousedown=function(eve){
			if(eve.target==this||eve.target.id=="desktop0"){
				mainDesktop.downed=true;eve.preventDefault();
			}
			mainDesktop.previousX=eve.clientX;
			mainDesktop.previousY=eve.clientY;
		}
		document.body.onmouseup=function(){mainDesktop.downed=false;
		}
		document.body.onmousemove=function(eve){
			if(mainDesktop.downed==true){
				eve.preventDefault();eve.stopPropagation();
				mainDesktop.style.marginTop=parseInt(mainDesktop.style.marginTop)+(eve.clientY-mainDesktop.previousY)+"px";
				mainDesktop.style.marginLeft=parseInt(mainDesktop.style.marginLeft)+(eve.clientX-mainDesktop.previousX)+"px";
				document.body.style.backgroundPosition=mainDesktop.style.marginLeft+" "+mainDesktop.style.marginTop;
				//console.log(this.style.marginTop+":"+this.style.marginLeft);
				mainDesktop.previousX=(eve.clientX);
				mainDesktop.previousY=(eve.clientY);
				
			
			}
		}
		document.body.onmouseout=function(){mainDesktop.downed=false;}
      
        document.body.addEventListener("mousemove",function(event){window.mousex=event.clientX;window.mousey=event.clientY},true);

        
        var canvasOverlayScreenHelperResizer=document.createElement("canvas");//used to draw box border overlay gui on the interface. Like while user is resizing window, resize box ui would show up here to assist...
        canvasOverlayScreenHelperResizer.show=function(){
                this.style.display="block";
                this.style.zIndex=windows.currentFocusInt
                this.width=document.body.offsetWidth;
                this.height=document.body.offsetHeight;
        }
        canvasOverlayScreenHelperResizer.hide=function(){
                this.style.display="none";
        }
        canvasOverlayScreenHelperResizer.setAttribute("style","position:absolute;top:0;left:0;width:100%;height:100%:z-index:999;background-color:transparent;display:none;");
        canvasOverlayScreenHelperResizer.overlayAt=function(x,y,width,height){
                var ctx=this.getContext("2d");
                ctx.clearRect(0,0,this.width,this.height);
                ctx.strokeStyle="orange";
                ctx.strokeRect(x,y,width,height);
                return;
        }
        window.canvasOverlayScreenHelperResizer=canvasOverlayScreenHelperResizer;
        document.body.appendChild(canvasOverlayScreenHelperResizer);
        
        //colorize sprite
        var img=new Image();
        img.onload=function(){
           var ctx= getNewCanvasContextFromImg(this);
           var data=ctx.getImageData(0,0,this.width,this.height);
           
             var indexID=window.globalEventForThreads.length;
             this.onEventProcessed=function(d){
                for(var i = 0; i < this[1].data.length; i++){
                    this[1].data[i] = d[i];
                }

                this[0].putImageData(this[1], 0, 0);
                var url = this[0].canvas.toDataURL();
               // document.location=url;
                createNewStyle(".micon{background-image:url("+url+");}")
           }    
            
           window.globalEventForThreads[indexID]=this.onEventProcessed.bind([ctx,data]);
           threads.threadHandlers[0].postMessage([-232,indexID,data.data,[0,0,0,0,150,150,150,1],[255,-55,255,1]]);
        };
        img.src="img/icons/metrize_icons_300_20x20gray.png";
        var navigatorContainer=frame.addFrameToDesktop(desktops.ele[0]).addRow().addCell();
		var profileAccount=navigatorContainer.parentNode.addCell();
		profileAccount.style.height="";
		var bottomRow=navigatorContainer.parentNode.parentNode.addRow();
		bottomRow.setAttribute("style","background:;");
		var hideAccount=document.createElement("img");
		hideAccount.src="img/icons/9.png";
		hideAccount.setAttribute("style","width:48px;height:24px;border:1px solid rgb("+navigatorContainer.parentNode.parentNode.color+");background-color:rgba("+navigatorContainer.parentNode.parentNode.color+",0.5);margin:-3px auto;display:block;");
		//navigatorContainer.parentNode.parentNode.appendChild(hideAccount);
		var naavigator1=frame.addFrameToDesktop(navigatorContainer).addRow().addCell();		
		
		var naavigator2=frame.addFrameToDesktop(navigatorContainer).addRow().addCell();
		var naavigator3=frame.addFrameToDesktop(navigatorContainer).addRow().addCell();
		var newBlock=document.createElement("img");
		newBlock.src="img/icons/1.png";
		newBlock.setAttribute("style","width:24px;height:24px;margin:5px;background-color:rgba(255,255,255,0.5);border: 1px outset white;");
		newBlock.onclick=function(event){
			if(blockAdderUIScreen.style.display=="block")
				blockAdderUIScreen.style.display="none";
			else 
				blockAdderUIScreen.style.display="block";
			event.preventDefault();
		};
		
		var logOff=document.createElement("img");
		logOff.src="img/icons/5.png";
		logOff.setAttribute("style","width:24px;height:24px;margin:5px;background-color:rgba(255,255,255,0.5);border: 1px outset white;");
		var profileSetting=document.createElement("img");
		profileSetting.src="img/icons/profile.png";
		profileSetting.setAttribute("style","width:24px;height:24px;margin:5px;background-color:rgba(255,255,255,0.5);border: 1px outset white;");
		naavigator3.textContent="Welcome";
		naavigator1.textContent="No news";
		naavigator1.style.fontSize="80%"
		naavigator2.appendChild(newBlock);
		naavigator2.appendChild(logOff);
		naavigator2.appendChild(profileSetting);
		var profileAvatar=document.createElement("img");
		profileAvatar.src="img/avatar/terminator.png";
		profileAvatar.setAttribute("style","width:100%;height:inherit;display:block;");
		profileAccount.appendChild(profileAvatar);
		generateNewBlockContents();
		blockAdderUIScreen.style.display="none";
		appendFeaturesToBlockLibrary();
		
		blockAdderUIScreen.onclick=function(){
			blockAdderUIScreen.style.display="none";
		}
		
		document.body.ondragover=function(eve){
			eve.preventDefault();
		}
		mainDesktop.style.position="relative";
		blockAdderUIScreen.style.zIndex="2";
		mainDesktop.style.zIndex="1";
        
}
globalEventForThreads=[];
function createNewStyle(cache,id){
    var newSkin;
    if(document.getElementById(id)){
        newSkin=document.getElementById(id);     
    }
    else{
        newSkin=document.createElement("style");
        if(id!=null)
            newSkin.id=id;
        newSkin.setAttribute("type", "text/css");
        newSkin.setAttribute("title", "skin");
        document.body.insertBefore(newSkin,document.body.firstChild);	
        }
    

    newSkin.textContent=cache;
    
}
  function getNewCanvasContextFromImg(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
	return ctx;

}

function generateNewBlockContents(){
 blockAdderUIScreen=document.createElement("div");
 blockAdderUIScreen.className="systemScreenUIContainer";
 var blockBoxUI=document.createElement("div");
 blockBoxUI.className="systemBoxUI";
 blockAdderUIScreen.appendChild(blockBoxUI);
 var titleHeader=document.createElement("h2");
 titleHeader.textContent='Block library'
 titleHeader.className='titleSystemHeader'
 blockBoxUI.appendChild(titleHeader);
 var description=document.createElement("div");
 description.textContent="this is description area";
 description.setAttribute("style","width:200px;float:left;height:260px;border-right:1px solid gray;color:white;overflow:auto;padding:5px;");
 blockBoxUI.appendChild(description);
 document.body.appendChild(blockAdderUIScreen);

}

function generateRegisterationUI(d){
    generateRegisterationUI=function(){
            registerUIScreen.style.display='block';
        loginBoxUI.style.display="none";
    }
    var titleRegisterHeader=document.createElement("h2");
    titleRegisterHeader.textContent="Register";
    var titleRegisterBackButton=document.createElement("button");
    titleRegisterBackButton.className='titleRegisterBackButton';
    titleRegisterBackButton.textContent="back";
    titleRegisterBackButton.onclick=function(){
        registerUIScreen.style.display='none';
        loginBoxUI.style.display="block";
    }
    titleRegisterHeader.appendChild(titleRegisterBackButton);
    titleRegisterHeader.className='titleRegisterHeader'
    var registerUIScreen=document.createElement("div");
    registerUIScreen.className="registerScreenUIContainer";
    var registerBox=document.createElement("div");
    registerBox.className='registerBox';
    var inputFields={
        "nname":"text",
        "pass":"password",
        "fname":"text",
        "lname":"text",
        "email":"text",
        "dateofbirth":"text",
        "address":"text",
        "city":"text",
        "state":"text",
        "zip":"text",
        "phone":"text",
        "cell":"text",
        "fax":"text"
    };
    registerBox.appendChild(titleRegisterHeader);
    var title=["User Name*: ","Password*: ","First Name: ","Last Name: ","Email: ","Birth date: ","Address: ","City: ","State: ","Zip: ","Phone Number: ","Cell Number: ","Fax Number: "];
    var i=0;
    for (var prop in inputFields) {
        var rowField=document.createElement("div");
        rowField.className='registerRowField';
        var titleField=document.createElement("span");
        titleField.textContent=title[i];
        var inputField=document.createElement("input");
        rowField.appendChild(titleField);
        rowField.appendChild(inputField);
        inputField.name=prop;
        inputField.type=inputFields[prop];
        registerBox.appendChild(rowField);
        inputFields[prop]=inputField;
        i++;
    }
    registerBox.inputFields=inputFields;
    var optionBoxes=document.createElement("div");
    optionBoxes.className='registerOptionBox';
    var createAccountButton=document.createElement("button");
    createAccountButton.textContent="Create";
    createAccountButton.registerBox=registerBox;
    createAccountButton.onclick=function(){
        this.textContent="Processing...";
        this.disabled=true;
        var xhr = new XMLHttpRequest(); 
        var inputFields=this.registerBox.inputFields;
        var urlString="d=0";
         for (var prop in inputFields) {
               urlString+="&"+prop+"="+encodeURIComponent(inputFields[prop].value);
         }
            ;
             xhr.open("POST","../ss/db.php?createAccount=1",false);
               xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
               xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
              xhr.onreadystatechange= function(e){
                    if(this.status == 200 && this.readyState == 4){
                        var json=JSON.parse(this.responseText);
                                    if(json){
                                            alert(json);
                                            
                                    }else{
                                           
                                            
                                    }
                    }
              }
            xhr.send(urlString);
    }
    optionBoxes.appendChild(createAccountButton);
     registerUIScreen.appendChild(registerBox);
     registerBox.appendChild(optionBoxes);
     document.body.appendChild(registerUIScreen);
}

function signIntoUserSystem(systemID){

}
function getDesktopSetting(object,callbackXMLReturn,callbackObject){
    if(mainDesktop.desktopSetting[object]!=null)
        return callbackXMLReturn(mainDesktop.desktopSetting[object],true,callbackObject);
     if(!callbackXMLReturn)return;
     
    var xhr = new XMLHttpRequest(); 
      xhr.open("POST","../ss/db.php?getSetting="+(object.toString())+"&systemID="+mainDesktop.systemID,false);
      xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.callBack=callbackXMLReturn;
      xhr.callbackObject=callbackObject;
      xhr.onreadystatechange= function(e){
        if(this.status == 200 && this.readyState == 4){
            this.callBack(this.responseText,false,this.callbackObject);
         }
      }
    
      xhr.send("u="+encodeURIComponent(network.cookiesPretend["u"])+"&p="+encodeURIComponent(network.cookiesPretend["p"]));
}
function applyDesktopSetting(object,value){
    mainDesktop.desktopSetting[object]=value;
     var xhr = new XMLHttpRequest(); 
      xhr.open("POST","../ss/db.php?updateSetting="+(object.toString())+"&systemID="+mainDesktop.systemID,false);
      xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange= function(e){
        if(this.status == 200 && this.readyState == 4){
            
            var json=JSON.parse(this.responseText);
                        if(json){
                               
                                
                        }else{
                               
                                
                        }
        }
      }
    
      xhr.send("u="+encodeURIComponent(network.cookiesPretend["u"])+"&p="+encodeURIComponent(network.cookiesPretend["p"])+"&updateSetting="+encodeURIComponent(JSON.stringify(value)));
 
}
function updateSystemSetting(object,value){
    mainDesktop.dataSetting[object]=value;
    var json=JSON.stringify(mainDesktop.dataSetting);
     var xhr = new XMLHttpRequest(); 
      xhr.open("POST","../ss/db.php?updateSystem="+mainDesktop.systemID,false);
      xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange= function(e){
        if(this.status == 200 && this.readyState == 4){
            
            var json=JSON.parse(this.responseText);
                        if(json){
                               
                                
                        }else{
                               
                                
                        }
        }
      }
    
      xhr.send("u="+encodeURIComponent(network.cookiesPretend["u"])+"&p="+encodeURIComponent(network.cookiesPretend["p"])+"&updateValue="+encodeURIComponent(json));
 
}
function appendToStartupExternalScript(objectExternalScript,object,value){
    if(!mainDesktop.desktopSetting[objectExternalScript])mainDesktop.desktopSetting[objectExternalScript]={};
     mainDesktop.desktopSetting[objectExternalScript][object]=value;
    applyDesktopSetting(objectExternalScript,mainDesktop.desktopSetting[objectExternalScript]);
}

function getUserDirectory(path,callBack,param){//partial streaming or long-polling, chrome may need 2kb to change state.
//incompleted, need more testing especially for readystate 3
	 var xhr = new XMLHttpRequest(); 
      xhr.open("POST","../ss/db.php?getDirectoryList="+mainDesktop.systemID,false);
      xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.callBack=callBack;
		xhr.intervalLink=false
		xhr.param=param;
		xhr.onreadystatechange=function(evt){
			if(this.readyState==4 && this.status == 200){
				this.callBack(4,this.responseText,this,this.param);
				clearInterval(this.intervalLink);
			}
				
			else if(this.readyState==3 && this.status == 200 && !this.intervalLink){//for LONG directory listing with real time ui refreshment
				console.log("3 state");
				this.intervalLink=setInterval(function(callback,text,hxr,param){callBack(3,text,hxr);},250,[this.callBack,this.responseText,this,this.param]);
			}else if(this.status != 200){
				callBack(0,this.responseText,this,param);
			}
		}
      xhr.send("u="+encodeURIComponent(network.cookiesPretend["u"])+"&p="+encodeURIComponent(network.cookiesPretend["p"])+"&path="+encodeURIComponent(path));
	return xhr;
}
function newDirectory(path,folderName,callBack,param){
	 var xhr = new XMLHttpRequest(); 
      xhr.open("POST","../ss/db.php?systemID="+mainDesktop.systemID,false);
      xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	  xhr.param=param;
	  xhr.callBack=callBack;
	  xhr.onreadystatechange=function(){
		if(this.readyState==4 && this.status == 200){
			alert(this.responseText);
		}
	  }
	  xhr.send("u="+encodeURIComponent(network.cookiesPretend["u"])+"&newDirectory="+encodeURIComponent(folderName)+"&p="+encodeURIComponent(network.cookiesPretend["p"])+"&directory="+encodeURIComponent(path));

}
function uploadFileToUserDirectory(file,path,callBack,param){
	var xhr = new XMLHttpRequest();
	xhr.upload.callBack=callBack;
	xhr.upload.param=param;
	xhr.callBack=callBack;
	xhr.param=param;
	xhr.upload.addEventListener('progress',function(ev){
		this.callBack((ev.loaded/ev.total),this.param);
		//console.log("loading"+(ev.loaded/ev.total)+'%');
	}, false);
	
	xhr.onreadystatechange=function(evt){
		if(this.readyState==4 && this.status == 200)
			this.callBack(1,this.param);
	}
	
	xhr.open('POST', "../ss/db.php?uploadFileToSystem="+mainDesktop.systemID, true);
	xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
	var data = new FormData();//html5 
	data.append('fileUploading', file);
	data.append('path', path);
	data.append("u",network.cookiesPretend["u"]);
	data.append("p",network.cookiesPretend["p"]);
	xhr.send(data);
}
function uploadFileToMainDirectory(file,path,callBack,param){//temporary issue later
	var xhr = new XMLHttpRequest();
	xhr.upload.callBack=callBack;
	xhr.upload.param=param;
	xhr.callBack=callBack;
	xhr.param=param;
	xhr.upload.addEventListener('progress',function(ev){
		this.callBack((ev.loaded/ev.total),this.param);
		//console.log("loading"+(ev.loaded/ev.total)+'%');
	}, false);
	
	xhr.onreadystatechange=function(evt){
		if(this.readyState==4 && this.status == 200)
			this.callBack(1,this.param);
	}
	
	xhr.open('POST', "../ss/db.php?uploadToMain="+mainDesktop.systemID, true);
	xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
	var data = new FormData();//html5 
	data.append('fileUploading', file);
	data.append('path', path);
	data.append("u",network.cookiesPretend["u"]);
	data.append("p",network.cookiesPretend["p"]);
	xhr.send(data);
}
function uploadFileToExistingExternalVidgetDirectory(file,path,callBack,param){
	var xhr = new XMLHttpRequest();
	xhr.upload.callBack=callBack;
	xhr.upload.param=param;
	xhr.callBack=callBack;
	xhr.param=param;
	xhr.upload.addEventListener('progress',function(ev){
		this.callBack((ev.loaded/ev.total),this.param);
		//console.log("loading"+(ev.loaded/ev.total)+'%');
	}, false);
	
	xhr.onreadystatechange=function(evt){
		if(this.readyState==4 && this.status == 200)
			this.callBack(1,this.param);
	}
	
	xhr.open('POST', "../ss/db.php?uploadToVidgetContent="+mainDesktop.systemID, true);
	xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
	var data = new FormData();//html5 
	data.append('fileUploading', file);
	data.append('vID', path);
	xhr.send(data);
}

function getVidgetFromVblab2(vid,callBack,param){
	var xhr = new XMLHttpRequest();
	xhr.callBack=callBack;
	xhr.param=param;

	xhr.onreadystatechange=function(evt){
		if(this.readyState==4 && this.status == 200)
			this.callBack(this.responseText,1,this.param);
	}
	
	xhr.open('POST', "../ss/db.php?getVidgetContentFromVblab2="+mainDesktop.systemID, true);
	xhr.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
	var data = new FormData();//html5 
	data.append('vID', vid);
	xhr.send(data);
}


function appendFeaturesToBlockLibrary(){
	var youTube=document.createElement("img");
	youTube.src="img/icons/youtubeH.png";
	youTube.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(youTube);
	
	var musicPlayeer=document.createElement("img");
	musicPlayeer.src="img/icons/4.png";
	musicPlayeer.className="blockIcon";
	musicPlayeer.draggable=true;
	musicPlayeer.onmousedown=function(eve){
	eve.stopPropagation();
	}
	musicPlayeer.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			var img=document.createElement("img");
			img.src="img/icons/4.png";
			var audioPlayer=document.createElement("audio");
			container.audioPlayer=audioPlayer;
			container.ondrop=function(evt){
				 evt.stopPropagation();
				evt.preventDefault();

				var files = evt.dataTransfer.files; // FileList object.
				if(files.length>1)return;//expand this futre
				
			
				var output = [];
				for (var i = 0, f; f = files[i]; i++) {
					if (f.type.match(/audio.*?/)) {
						var reader = new FileReader();
						reader.onload = function(d) {
							var e = this;
							e.src = d.target.result;
							alert(d.target.result);
							e.setAttribute("type", f.type);
							e.setAttribute("controls", "controls");
							e.setAttribute("autoplay", "true");
						}.bind(this.audioPlayer);
						reader.readAsDataURL(f);
					}
				 /*output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
							  f.size, ' bytes, last modified: ',
							  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
							  '</li>');*/
				}
			
			}
			container.dragover=function(evt){
				evt.stopPropagation();
				evt.preventDefault();
			}
			/*
			var file = files[0];
                
				*/
			container.parentNode.parentNode.style.width="150px";
			container.parentNode.style.height="100px";
			container.parentNode.parentNode.style.display="inline";
			container.parentNode.parentNode.style.position="absolute";
			container.parentNode.parentNode.style.top=(eve.clientY-parseInt(mainDesktop.style.marginTop)-50)+"px";
			container.parentNode.parentNode.style.left=(eve.clientX-parseInt(mainDesktop.style.marginLeft)-75)+"px";
			audioPlayer.controls=true;
			audioPlayer.style.width="200px";

			//audioPlayer.setAttribute("src","");
			container.appendChild(img);
			container.appendChild(audioPlayer);
			var flashContainer=document.createElement("div");
			flashContainer.id="newAudio"+eve.clientX+eve.clientY;
			container.appendChild(flashContainer);
			var test=swfobject.embedSWF("vmu.swf?a="+Math.random()*5555555, "newAudio"+eve.clientX+eve.clientY, "0", "0", "11.7.0","", {}, {"allowscriptaccess":"always"}, {},function(status){
				if (status.success){
					window.flashPlayerAccess=status.ref
					//status.ref.vPSound("music.mp3",int position,int loop);
					//status.ref.vPSound(); if you want to stop
					setTimeout(function(){this.Load("music2.mp3");}.bind(status.ref),1500);
					window.loadedPlayerEvent=function(){setTimeout(function(){this.Play(5);}.bind(status.ref),1500)};
				}
			}.bind("newAudio"+eve.clientX+eve.clientY));
			
			//container.appendchild(audioPlayer);
		}
		
	}
	

	blockAdderUIScreen.childNodes[0].appendChild(musicPlayeer);
	
	var calendar=document.createElement("img");
	calendar.src="img/icons/calendar.png";
	calendar.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(calendar);
	calendar.draggable=true;
	calendar.onmousedown=function(eve){
		eve.stopPropagation();
	}
	calendar.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var htmlContent="";
			 var FebNumberOfDays =28;
			 var counter = 1;			 
			 var dateNow = new Date();
			 var month = dateNow.getMonth();//based on http://www.codemiles.com/javascript-examples/simple-javascript-calendar-t7767.html since I fully dont understand how calendar exactly works. (Specifically don't know why Feb's like that)

			 var nextMonth = month+1; //+1; //Used to match up the current month with the correct start date.
			 var prevMonth = month -1;
			 var day = dateNow.getDate();
			 var year = dateNow.getFullYear();
			 
			 
			 //Determing if February (28,or 29)  
			 if (month == 1){
				if ( (year%100!=0) && (year%4==0) || (year%400==0)){
				  FebNumberOfDays = 29;
				}
			 }
			 var monthNames = ["January","February","March","April","May","June","July","August","September","October","November", "December"];
			 var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thrusday","Friday", "Saturday"];
			 var dayPerMonth = ["31", ""+FebNumberOfDays+"","31","30","31","30","31","31","30","31","30","31"];
			  var nextDate = new Date(nextMonth +' 1 ,'+year);
			 var weekdays= nextDate.getDay();
			 var weekdays2 = weekdays;
			 var numOfDays = dayPerMonth[month];
			 while (weekdays>0){
				htmlContent += "<td class='monthPre'></td>";
			 
			 // used in next loop.
				 weekdays--;
			 }
			 
			 // loop to build the calander body.
			 while (counter <= numOfDays){
			 
				 // When to start new line.
				if (weekdays2 > 6){
					weekdays2 = 0;
					htmlContent += "</tr><tr>";
				}
			 
			 
			 
				// if counter is current day.
				// highlight current day using the CSS defined in header.
				if (counter == day){
					htmlContent +="<td class='dayNow' "+
					">"+counter+"</td>";
				}else{
					htmlContent +="<td class='monthNow'"+
					" >"+counter+"</td>";    
			 
				}
				
				weekdays2++;
				counter++;
			 }
			 
			 
			 
			 // building the calendar html body.
			 var calendarBody = "<table class='calendar'> <tr class='monthNow'><th colspan='7'>"
			 +monthNames[month]+" "+ year +"</th></tr>";
			 calendarBody +="<tr class='dayNames'>  <td>Sun</td>  <td>Mon</td> <td>Tues</td>"+
			 "<td>Wed</td> <td>Thurs</td> <td>Fri</td> <td>Sat</td> </tr>";
			 calendarBody += "<tr>";
			 calendarBody += htmlContent;
			 calendarBody += "</tr></table>";
			 // set the content of div .
			 
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			container.parentNode.parentNode.style.width="150px";
			container.parentNode.style.height="100px";
			container.parentNode.parentNode.style.display="inline";
			container.parentNode.parentNode.style.position="absolute";
			container.parentNode.parentNode.style.top=(eve.clientY-parseInt(mainDesktop.style.marginTop)-50)+"px";
			container.parentNode.parentNode.style.left=(eve.clientX-parseInt(mainDesktop.style.marginLeft)-75)+"px";
			container.innerHTML=calendarBody;
			//container.appendchild(audioPlayer);
		}
		
	}
	
	var favorites=document.createElement("img");
	favorites.src="img/icons/favorites.png";
	favorites.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(favorites);
	
	var phone=document.createElement("img");
	phone.src="img/icons/phone.png";
	phone.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(phone);
	
	var fileuplaoad=document.createElement("img");
	fileuplaoad.src="img/icons/fileuplaoad.jpg";
	fileuplaoad.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(fileuplaoad);
	fileuplaoad.draggable=true;
	fileuplaoad.onmousedown=function(eve){
	eve.stopPropagation();
	}
	fileuplaoad.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			var img=document.createElement("input");
			img.type="file";
			
			var progress=document.createElement("progress");
			img.onchange=function(){
				this[1].value=0;
				uploadFileToMainDirectory(this[0].files[0],"",function(progress){this.value=(progress);if(progress==1){this.style.border="5px solid green";}else{this.style.border=""}}.bind(this[1]),{});
			}.bind([img,progress]);
			
			container.parentNode.parentNode.style.width="150px";
			container.parentNode.style.height="100px";
			container.parentNode.parentNode.style.display="inline";
			container.parentNode.parentNode.style.position="absolute";
			container.parentNode.parentNode.style.top=(eve.clientY-parseInt(mainDesktop.style.marginTop)-50)+"px";
			container.parentNode.parentNode.style.left=(eve.clientX-parseInt(mainDesktop.style.marginLeft)-75)+"px";
			progress.style.width="200px";

			//audioPlayer.setAttribute("src","");
			var header=document.createElement("div");
			header.textContent="File Upload (Admin only)";
			header.style.backgroundColor="white";
			container.appendChild(header);
			container.appendChild(img);
			container.appendChild(progress);
			
			//container.appendchild(audioPlayer);
		}
		
		
	}
	
	var newFriend=document.createElement("img");
	newFriend.src="img/icons/fileuplaoad.jpg";
	newFriend.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(newFriend);
	newFriend.draggable=true;
	newFriend.onmousedown=function(eve){
	eve.stopPropagation();
	}
	newFriend.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			
			
			//container.appendchild(audioPlayer);
		}
		
		
	}
	
	
	var vidgetUpload=document.createElement("img");
	vidgetUpload.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(vidgetUpload);
	vidgetUpload.draggable=true;
	vidgetUpload.onmousedown=function(eve){
		eve.stopPropagation();
	}
	var ctx=canvasOverlayScreenHelperResizer.getContext("2d");
	canvasOverlayScreenHelperResizer.width=50;
	canvasOverlayScreenHelperResizer.height=45;
	ctx.fillStyle="white";
	ctx.fillText("Vidget",3,10);
	ctx.fillText("Updator",3,30);
	vidgetUpload.src=canvasOverlayScreenHelperResizer.toDataURL();
	vidgetUpload.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			var img=document.createElement("input");
			img.type="file";
			var vid=document.createElement("input");
			vid.type="number";
			vid.value=28;
			var progress=document.createElement("progress");
			img.vid=vid;
			img.onchange=function(){
				this[1].value=0;
				uploadFileToExistingExternalVidgetDirectory(this[0].files[0],this[0].vid.value,function(progress){this.value=(progress);if(progress==1){this.style.border="5px solid green";}else{this.style.border=""}}.bind(this[1]),{});
			}.bind([img,progress]);
			
			container.parentNode.parentNode.style.width="150px";
			container.parentNode.style.height="100px";
			container.parentNode.parentNode.style.display="inline";
			container.parentNode.parentNode.style.position="absolute";
			container.parentNode.parentNode.style.top=(eve.clientY-parseInt(mainDesktop.style.marginTop)-50)+"px";
			container.parentNode.parentNode.style.left=(eve.clientX-parseInt(mainDesktop.style.marginLeft)-75)+"px";
			progress.style.width="200px";

			//audioPlayer.setAttribute("src","");
			var header=document.createElement("div");
			header.textContent="Vidget Updator (admin only)";
			header.style.backgroundColor="white";
			container.appendChild(header);
			container.appendChild(vid);
			container.appendChild(img);
			container.appendChild(progress);
			
			//container.appendchild(audioPlayer);
		}
		
		
		
	}
	
	var vidgetRun=document.createElement("img");
	vidgetRun.className="blockIcon"
	blockAdderUIScreen.childNodes[0].appendChild(vidgetRun);
	vidgetRun.draggable=true;
	vidgetRun.onmousedown=function(eve){
		eve.stopPropagation();
	}
	var ctx=canvasOverlayScreenHelperResizer.getContext("2d");
	canvasOverlayScreenHelperResizer.width=50;
	canvasOverlayScreenHelperResizer.height=45;
	ctx.fillStyle="white";
	ctx.fillText("Run",3,10);
	ctx.fillText("vblab ",3,20);
	ctx.fillText("Vidget ",3,30);
	vidgetRun.src=canvasOverlayScreenHelperResizer.toDataURL();
	vidgetRun.ondragstart=function(){
		document.body.ondrop=function(eve){
			eve.preventDefault();
			this.ondrop=function(){};
			var container=frame.addFrameToDesktop(mainDesktop).addRow().addCell();
			container.id=parseInt(Math.random()*250295032945031945);
			var vid=document.createElement("input");
			vid.type="number";
			vid.value=28;
			var textStyle=document.createElement("textarea");
			textStyle.value="position:fixed;bottom:0px;right:0px;";
			var launch=document.createElement("button");	
			launch.vid=vid;
			launch.textStyle=textStyle;
			launch.textContent="launch";	
			launch.onclick=function(){
				var parentNodeOrigin=launch.parentNode;
				getVidgetFromVblab2(this.vid.value,function(d,s,b){
					var scr=document.createElement('script');
					scr.name=" (id="+b[0]+")";
					scr.setAttribute("type","text/javascript");
					var position=[0,0]
					//storedVidgets[id][3]
					var injectingVariables="vidgetID="+b[0]+";preferedPosition=["+position[0]+","+position[1]+"];";
					injectingVariables+="var vidget"+b[0]+" =function (){this.vidgetAppIconId=[];this.vidgetAppIconId[vidgetID]=\"vidgetIcon\"+vidgetID;";
					var injectingVariablesEnd="";
					injectingVariablesEnd+="\nif(vidgetContainer.onDropListenerEvent)vidgetContainer.onDropListenerEvent('baseURL','../../vblab2/vidget/id"+b[0]+"/content/');";
					injectingVariablesEnd+="\nif(vidgetContainer.onDropListenerEvent)vidgetContainer.onDropListenerEvent('startOperation','"+this[0]+"');";
					injectingVariablesEnd+="\nif(vidgetContainer.onDropListenerEvent)vidgetContainer.onDropListenerEvent('initialStyleArgument','"+this[1].textStyle.value+"');";
					//if(argumentType)
						//injectingVariablesEnd+="\nif(vidgetContainer.onDropListenerEvent)vidgetContainer.onDropListenerEvent('"+argumentType+"','"+argumentValue+"');";
					injectingVariablesEnd+="\nreturn this}();";
					var version=-1;
					var appName="UNKNOWN";
					//appElement[id].text=(injectingVariables+(message)+injectingVariablesEnd).replace(/(\W)(vidgetVersion)(\W)/g,"$1'"+version+"'$3").replace(/(\W)(vidgetName)(\W)/g,"$1'"+appName+"'$3").replace(/(\W)(vidgetID)(\W)/g,"$1"+id+"$3").replace(/(vidgetContainer)/g,"vMO"+id).replace(/(\W)(vKey)(\W)/g,"$1"+storedVidgets[id][3]+"$3");//.setAttribute("src", storedVidgets[id][1]);
					scr.textContent=(injectingVariables+(d)+injectingVariablesEnd).replace(/(\W)(vidgetVersion)(\W)/g,"$1'"+version+"'$3").replace(/(\W)(vidgetName)(\W)/g,"$1'"+appName+"'$3").replace(/(\W)(vidgetID)(\W)/g,"$1"+b[0]+"$3").replace(/(vidgetContainer)/g,"vMO"+b[0]).replace(/(\W)(vKey)(\W)/g,"$1"+/*storedVidgets[id][3]*/0+"$3");//.setAttribute("src", storedVidgets[id][1]);

					//alert(appElement[id].textContent);
					//inform(appElement.textContent,5);
					//inform("<textarea>"+appElement[id].text,55);
					
					while(parentNodeOrigin.childNodes[0]){
						parentNodeOrigin.removeChild(parentNodeOrigin.childNodes[0])
					}
					if(this[1].textStyle.value){
						document.getElementById(this[0]).parentNode.parentNode.setAttribute("style",this[1].textStyle.value)
					}
					document.getElementById(this[0]).appendChild(scr);
				
				}.bind([container.id,this]),[this.vid.value]);
				
			}
			var progress=document.createElement("progress");
			container.parentNode.parentNode.style.width="350px";
			container.style.height="300px";
			container.style.width="550px";
			container.style.display="block";
			container.parentNode.parentNode.style.display="inline";
			container.parentNode.parentNode.style.position="absolute";
			container.parentNode.parentNode.style.top=(eve.clientY-parseInt(mainDesktop.style.marginTop)-175)+"px";
			container.parentNode.parentNode.style.left=(eve.clientX-parseInt(mainDesktop.style.marginLeft)-150)+"px";
			progress.style.width="200px";

			//audioPlayer.setAttribute("src","");
			var header=document.createElement("div");
			header.textContent="Launch Vidget";
			header.style.backgroundColor="white";
			container.appendChild(header);
			container.appendChild(vid);
			
			container.appendChild(launch);
			container.appendChild(progress);
			container.appendChild(textStyle);
			//container.appendchild(audioPlayer);
		}
		
		
		
	}
	
	

}

function moveDesktopViewPort(x,y){
	mainDesktop.style.marginTop=parseInt(mainDesktop.style.marginTop)+(y)+"px";
	mainDesktop.style.marginLeft=parseInt(mainDesktop.style.marginLeft)+(x)+"px";
	document.body.style.backgroundPosition=mainDesktop.style.marginLeft+" "+mainDesktop.style.marginTop;
}
function moveDesktopViewPortToHome(){
	mainDesktop.style.marginTop=0+"px";
	mainDesktop.style.marginLeft=0+"px";
	document.body.style.backgroundPosition=mainDesktop.style.marginLeft+" "+mainDesktop.style.marginTop;
}
