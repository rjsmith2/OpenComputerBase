var vidgetObjects={};
var socketerCounter=0;
var socketer=function(){};
socketer.consoleSocket=null;
doFunction={};
socketer.socket=function(){
	console.log("Socketing...")
    var consoleSocket = new WebSocket("ws://" + location.host + ":8000/index.html");
    consoleSocket.socketer=this;
    consoleSocket.onopen=function(){
    }
    consoleSocket.onclose=function(){
	   	setTimeout(function(){
			socket=socketer.socket();
		},500);
    }
    consoleSocket.onmessage=function(eve){
    	var json=JSON.parse(eve.data);
    	if(json.id)this.arrFunct[json.id](json["data"]);
    	else if(doFunction[json.command])doFunction[json.command](json);
     }
    consoleSocket.onerror=function(eve){
    	console.log("socket error main");
    }
    consoleSocket.arrFunct=[];
	consoleSocket.sendListen=function(data,callBack){
		data["idc"]=++socketerCounter;
		this.arrFunct[socketerCounter]=callBack;
		this.send(JSON.stringify(data));
	}
    socketer.consoleSocket=consoleSocket;
    
    return consoleSocket;
}

socket=socketer.socket();
setInterval(function(){socket.send(0)},30000);
startup=function(){}
startup.activate=function(){
	
	runVidgetAPIThread();
	vidgetContainer=document.createElement("div");
	var vidgetParent=document.createElement("div");
	var vidgetContainerConfig=document.createElement("div");
	vidgetContainer.setAttribute("style","");
	vidgetContainer.className="vidgetScreen";
		var loginError=document.createElement("div");
	loginError.textContent="";
	loginError.className="loginError";
	//vidgetContainer.src="img/icons/whitePack.png";
	login=vidgetContainer.cloneNode();
	
	login.className='loginBox';
	var register=login.cloneNode();
	//register.style.display="none";

	signIn=document.createElement("a");
	signIn.textContent=" Log in";
	signIn.eleTo=login;
	signIn.eleFrom=register;
	register.setAttribute("data-hidden",1);
	signIn.onclick=function(){
		var parentEle=this.eleTo;
		parentEle.style.marginTop="";
		this.eleFrom.style.opacity=0;
		this.eleFrom.setAttribute("data-hidden",1);
	}
	signIn.setAttribute("style","background-color:rgb(0,30,125);padding:15px;border-top-right-radius:15px;border-bottom-right-radius:35px;cursor:pointer;color:lightblue;box-shadow:black -12px 0px 3px 1px;display:inline-block;margin-bottom:5px");
	register.appendChild(signIn);
	registerButton=document.createElement("button");
	
	var newUserName=selfDescriptiveInputText("First & Last name (Ex: Steve William)");
	newUserName.className="registerInputField";
	register.appendChild(newUserName);
	registerButton.username=newUserName;
	
	var newAccName=selfDescriptiveInputText("Account Name (Ex: TombRaided52)");
	newAccName.className="registerInputField";
	register.appendChild(newAccName);
	registerButton.newAccName=newAccName;
	
	var newPassword=selfDescriptiveInputText("Password","password");
	newPassword.className="registerInputField";
	register.appendChild(newPassword);
	registerButton.password=newPassword;
	
	var newEmail=selfDescriptiveInputText("Email","email");
	newEmail.className="registerInputField";
	register.appendChild(newEmail);
	registerButton.email=newEmail;
	
	var newBirthDate=selfDescriptiveInputText("Birth date (mm-dd-yyyy)","date");
	newBirthDate.className="registerInputField";
	register.appendChild(newBirthDate);
	registerButton.birth=newBirthDate;
	
	registerButton.textContent="Register";
	registerButton.className="registerButton";
	
	
	register.appendChild(registerButton);
	
	//document.body.appendChild(vidgetContainer);
	document.body.appendChild(login);
	//document.body.appendChild(register);
	
	var logo=document.createElement("img");
	
	logo.src="img/logo/logo.png";
	
	logo.style.padding="5px";
	login.appendChild(logo);
	registerLink=document.createElement("a");
	registerLink.textContent=" Register";
	registerLink.eleTo=login;
	registerLink.eleFrom=register;
	registerLink.onclick=function(){
		var parentEle=this.eleTo;
		parentEle.style.marginTop=(parentEle.offsetHeight*-1 -15)+"px";
		this.eleFrom.style.opacity=1;
		this.eleFrom.setAttribute("data-hidden",0);
	}
	registerLink.setAttribute("style","float:right; background-color:rgb(0,30,125);padding:15px;border-top-left-radius:15px;border-bottom-left-radius:35px;cursor:pointer;color:lightblue;box-shadow:black 12px 0px 3px 1px;");
	//login.appendChild(registerLink);
		var usernameLoginContainer=document.createElement("input");
		usernameLoginContainer.className="hiddenInputText";
		usernameLoginContainer.canvasHole=document.createElement("canvas");
		usernameLoginContainer.canvasHole.parentEle=usernameLoginContainer;
		usernameLoginContainer.canvasHole.className='canvasInputText ';
		usernameLoginContainer.canvasHole.makeHole=makeHole;
		usernameLoginContainer.isDefaulted=true;
		usernameLoginContainer.revertify=function(){
			this.value="[Minecraft Username]";
			this.canvasHole.makeHole(this.value);
		}
		usernameLoginContainer.revertify();
		if(localStorage["username"]){
		    usernameLoginContainer.value=localStorage["username"];
		    usernameLoginContainer.isDefaulted=false;
		}
		usernameLoginContainer.normalify=function(){
		}
		usernameLoginContainer.onchange=function(){
				this.normalify();
				this.isDefaulted=false;
		}
		usernameLoginContainer.onfocus=function(){
			if(this.isDefaulted)
				this.value="";
			this.canvasHole.setAttribute("data-focused",1);
		}
		
		usernameLoginContainer.onkeyup=usernameLoginContainer.onkeydown=usernameLoginContainer.onmouseup=usernameLoginContainer.oninput=function(){
			var sel = getInputSelection(usernameLoginContainer);
			usernameLoginContainer.canvasHole.start=sel.start;
			usernameLoginContainer.canvasHole.makeHole(this.value);
			
			
		}
		usernameLoginContainer.onblur=function(){
			
			this.canvasHole.setAttribute("data-focused",null);
			if(this.value===""){
				this.revertify(this.isDefaulted=true);					
			}
			usernameLoginContainer.canvasHole.start=-5;
			usernameLoginContainer.canvasHole.makeHole(this.value);
			
			
		}
		imgLogin=document.createElement("img");
		login.appendChild(imgLogin);
		login.appendChild(usernameLoginContainer.canvasHole);
		login.appendChild(usernameLoginContainer);

		var textBox = document.getElementById("textBoxId");
		usernameLoginContainer.onselect=usernameLoginContainer.onselectionchange=function(eve){
			var test = getInputSelection(usernameLoginContainer);
		};

		var usernamePasswordContainer=usernameLoginContainer.cloneNode();
		usernamePasswordContainer.isDefaulted=true;
		usernamePasswordContainer.type="password";
		usernamePasswordContainer.value="[Password]";
		usernamePasswordContainer.canvasHole=usernameLoginContainer.canvasHole.cloneNode();
		usernamePasswordContainer.canvasHole.parentEle=usernamePasswordContainer;
		//login.appendChild(usernamePasswordContainer.canvasHole);
		//login.appendChild(usernamePasswordContainer);
		usernamePasswordContainer.canvasHole.makeHole=makeHole
		usernamePasswordContainer.onkeyup=usernamePasswordContainer.onkeydown=usernamePasswordContainer.onmouseup=usernamePasswordContainer.oninput=function(e){
		    if (e&&e.keyCode == 13) {return imgLogin.onclick()}
			var sel = getInputSelection(usernamePasswordContainer);
			usernamePasswordContainer.canvasHole.start=sel.start;
			usernamePasswordContainer.canvasHole.makeHole(this.value.replace(/./g,"*"));
			
			
		}
       
		usernamePasswordContainer.onblur=function(){
			usernamePasswordContainer.canvasHole.start=-5;
			usernamePasswordContainer.canvasHole.makeHole(this.value.replace(/./g,"*"));
			if(this.value===""){
				this.revertify(this.isDefaulted=true);					
			}
			this.canvasHole.dataset.focused=null;
			
			
		}
		usernamePasswordContainer.revertify=function(){
			this.value="[Password]";
			this.canvasHole.makeHole(this.value);
		}
		usernamePasswordContainer.revertify();
		
		usernamePasswordContainer.normalify=function(){
		}
		usernamePasswordContainer.onchange=function(){
				this.normalify();
				this.isDefaulted=false;
		}
		usernamePasswordContainer.onfocus=function(){
			if(this.isDefaulted)
				this.value="";
			this.canvasHole.dataset.focused=1;
		}
		
		imgLogin.src="/img/hot.jpg";
		imgLogin.className='imgLoginButton'
		
		
		usernameLoginContainer.canvasHole.makeHole(usernameLoginContainer.value);
		
		 if(localStorage["password"]){
		    usernamePasswordContainer.value=localStorage["password"];
		    usernamePasswordContainer.onkeyup();
		    usernamePasswordContainer.isDefaulted=false;
		}
		else 
		    usernamePasswordContainer.canvasHole.makeHole(usernamePasswordContainer.value);

	imgLogin.error=loginError;
	imgLogin.pass=usernamePasswordContainer;
	imgLogin.user=usernameLoginContainer;
	imgLogin.onclick=function(){
		if(usernameLoginContainer.isDefaulted){
			this.error.textContent="Please fill out your username";
		}
		else if(!navigator.onLine){
			this.error.textContent="Your browser is in offline mode. Can not connect to server";
		}
		else{
			this.error.textContent="";
			//send the login verification
			/*
			var xhr = new XMLHttpRequest();
			xhr.ele=this;
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
				    var json=JSON.parse(this.response);
					(this.ele.error.textContent="");
					if(this.response.toString().indexOf('xdebug-error')!=-1){
						this.ele.error.textContent=("The server has encountered an error logging in. Try again later.");
					}else{
						if(json["success"]){
						        localStorage["username"]=imgLogin.user.value;
						        localStorage["password"]=imgLogin.pass.value;
						    register.style.display="none";
						    registerLink.onclick();
						    imgLogin.pass.value=JSON.parse(json["message"])["key"];
						    setTimeout(function(){
							login.parentNode.removeChild(login);
							register.parentNode.removeChild(register);
							jsonGetNewNotificationRequest();
							delete login;
							delete register;
							document.body.appendChild(vidgetContainer);
						    },500);
						}else{
						    	this.ele.error.textContent=(JSON.parse(json["message"])["error"]);
						}
					}
				}
			};

			xhr.open("POST", "../linker.php", true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.timeout = 4000;
			xhr.ontimeout = function () { alert("Timed out!!!"); }
			*/
			var inputFields={command:"login",
			   data:JSON.stringify({
    				email:imgLogin.user.value
		    	})
			   
			};
			socket.sendListen(inputFields,function(json){
				(this.error.textContent="");
				if(json["success"]){
				        localStorage["username"]=imgLogin.user.value;
				        localStorage["password"]=imgLogin.pass.value;
				    register.style.display="none";
				    registerLink.onclick();
				    setTimeout(function(){
						login.parentNode.removeChild(login);
						//register.parentNode.removeChild(register);
						//jsonGetNewNotificationRequest();
						delete login;
						delete register;
						document.body.appendChild(vidgetContainer);
						vidget.run(6,null,null,null,{type:"notificationBoard"});
						//vidget.run(7);//friend app test
				    },500);
				}else if(json["message"]){
				    	this.error.textContent=(json["message"]);
				}
			
			}.bind(this));
		}
	}
	login.appendChild(loginError);
	
	var registerError=loginError.cloneNode();
	register.appendChild(registerError);
	
	registerButton.error=registerError;
	registerButton.onclick=function(){
		/*
		var xhr = new XMLHttpRequest();
			xhr.error=this.error;
			xhr.onreadystatechange = function () {
				if (this.readyState == 4) {
					var json=JSON.parse(this.response);
					(this.error.innerHTML="");
					if(!json["success"]){
					   	this.error.innerHTML+=JSON.parse(json["message"])["error"];
					}
					if(this.error.innerHTML==""){
						//registered...
						
					    imgLogin.user.value=registerButton.email.value;
			        	imgLogin.pass.value=registerButton.password.value;
			        	usernameLoginContainer.canvasHole.makeHole(registerButton.email.value);
	                	usernamePasswordContainer.canvasHole.makeHole("***************************");
			        	imgLogin.user.isDefaulted=false;
						imgLogin.pass.isDefaulted=false;
			        	signIn.onclick();
			        	imgLogin.onclick();
			        	
			        	
						
					}
					
					if(this.response.toString().indexOf('xdebug-error')!=-1){
						this.error.textContent=("The server has encountered an error logging in. Try again later.");
					}
				}
			};

			xhr.open("POST", "../linker.php", true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.timeout = 4000;
			xhr.ontimeout = function () { alert("Timed out!!!"); }
			*/
			var inputFields={command:"register",
			   data:JSON.stringify({
    				firstName:this.username.value.split(" ")[0],
    				username:this.newAccName.value,
    				lastName:this.username.value.split(" ")[1],
    				email:this.email.value,
    				password:this.password.isDefaulted?"":this.password.value,
    				gender:"u",
    				birthday:"01/20/1983",//|this.birth.value,
		    	})
			   
			};
			socket.sendListen(inputFields,function(json){
					(this.error.innerHTML="");
					if(json["success"]==false && json["message"]){
					   	this.error.innerHTML+=json["message"]+" ";
					}
					if(this.error.innerHTML==""){
						//registered...
						
					    imgLogin.user.value=registerButton.email.value;
			        	imgLogin.pass.value=registerButton.password.value;
			        	usernameLoginContainer.canvasHole.makeHole(registerButton.email.value);
	                	usernamePasswordContainer.canvasHole.makeHole("***************************");
			        	imgLogin.user.isDefaulted=false;
						imgLogin.pass.isDefaulted=false;
			        	signIn.onclick();
			        	imgLogin.onclick();
					}
				
				
			}.bind(this));
			/*
			 var urlString="reg="+encodeURIComponent(JSON.stringify(inputFields));
			xhr.send(urlString);
			*/
	}
	document.body.appendChild(vidget.tooltipNameFloater);
	
	
	//vidgetContainer.appendChild(vidget.searchVidgetInput);
	vidgetContainer.appendChild(vidgetParent);
	vidgetContainer.style.display="none"
	
	//vidgetObjects["storage"]=vidget.preload();
	//vidgetObjects["storage"].setAttribute("style","background-position:58px 0px,0px 0px;");
	//vidgetObjects["vChat"]=vidget.preload();
	//vidgetObjects["vChat"].setAttribute("style","background-image:url(https://cdn4.iconfinder.com/data/icons/free-social-media-icons/16/Chat.png);background-position:inherit;background-size:100%;");
	//vidgetObjects["vChat"].run=function(){
	//	vidget.run(6);
		
	//}


	vidgetObjects["messages"]=vidget.preload();
	vidgetObjects["messages"].setAttribute("style","background-position:522px 339px,0px 0px;");

	//vidgetObjects["Add..."]=vidget.addFolderTo();
	//vidgetObjects["Add..."].setAttribute("style","background-position:146px 328px,0px 0px;");
	//vidgetObjects["Add..."].className="vidgetContainerIconExtra "+vidgetObjects["Add..."].className;
	/*vidgetObjects["Add..."].run=function(){
		this.folder.expand();
		this.run=function(){
			this.folder.collaspe();
			this.run=this.runOrginal
		}
	}
	vidgetObjects["Add..."].folder.vidgets["New Folder"]=vidget.preload();
	vidgetObjects["Add..."].folder.vidgets["New Folder"].setAttribute("style","background-position:-234px 204px, 0px 0px");
	vidgetObjects["Add..."].runOrginal=vidgetObjects["Add..."].run;*/

	var vidgetObjectMovePositionHelperLeft=document.createElement("div");
	vidgetObjectMovePositionHelperLeft.className="vidgetObjectMovePositionHelper vidgetContainerIcon"
	var vidgetObjectMovePositionHelperRight=document.createElement("div");
	vidgetObjectMovePositionHelperRight.className="vidgetObjectMovePositionHelper vidgetContainerIcon";
	Object.keys(vidgetObjects).forEach(vidget.setupVidget,[vidgetObjects,vidgetParent,vidgetObjectMovePositionHelperLeft,vidgetObjectMovePositionHelperRight]);
//	Object.keys(vidgetObjects["Add..."].folder.vidgets).forEach(vidget.setupVidget,[vidgetObjects["Add..."].folder.vidgets,vidgetObjects["Add..."].folder,vidgetObjectMovePositionHelperLeft,vidgetObjectMovePositionHelperRight]);

	//vidgetContainer.appendChild(vidgetObject
	
		var canvasOverlayScreenHelperResizer=document.createElement("canvas");//used to draw box border overlay gui on the interface. Like while user is resizing window, resize box ui would show up here to assist...
	canvasOverlayScreenHelperResizer.show=function(container){
		this.style.display="block";
		this.style.zIndex=windows.currentFocusInt+1
		this.width=document.body.offsetWidth;
		this.height=document.body.offsetHeight;
		var ctx=this.getContext("2d");
		var computed=window.getComputedStyle(container, null);
		var grad= ctx.createLinearGradient(0, 0, container.offsetWidth, container.offsetHeight);
		grad.addColorStop(0, computed.getPropertyValue("border-top-color")||computed.getPropertyValue("border-left-color")||computed.getPropertyValue("border-right-color")||computed.getPropertyValue("border-bottom-color")||computed.getPropertyValue("outline-color"));
		grad.addColorStop(0.5,computed.getPropertyValue("background-color"));
		grad.addColorStop(1, computed.getPropertyValue("border-top-color")||computed.getPropertyValue("border-left-color")||computed.getPropertyValue("border-right-color")||computed.getPropertyValue("border-bottom-color")||computed.getPropertyValue("outline-color"));
		ctx.strokeStyle=grad;
		ctx.lineWidth=computed.getPropertyValue("border-top-width")||computed.getPropertyValue("border-left-width")||computed.getPropertyValue("border-right-width")||computed.getPropertyValue("border-bottom-width")||computed.getPropertyValue("outline-width");
		ctx.grad=grad;
		ctx.outlineColor= computed.getPropertyValue("outline-color")||"silver";
		ctx.globalCompositeOperation ="copy";
	}
	canvasOverlayScreenHelperResizer.hide=function(){
		this.style.display="none";
	}
	canvasOverlayScreenHelperResizer.setAttribute("style","position:absolute;top:0;left:0;width:100%;height:100%:z-index:999;background-color:transparent;display:none;");
	canvasOverlayScreenHelperResizer.overlayAt=function(x,y,width,height){	
		var ctx=this.getContext("2d");	
		ctx.globalCompositeOperation ="copy";
		ctx.strokeStyle=ctx.outlineColor;
		ctx.lineWidth+=1.5;
		ctx.strokeRect(x,y,width,height);
		ctx.lineWidth-=1.5;
		ctx.globalCompositeOperation ="source-over"; 
		ctx.strokeStyle=ctx.grad;
		ctx.strokeRect(x,y,width,height);
		
		return;
	}
	window.canvasOverlayScreenHelperResizer=canvasOverlayScreenHelperResizer;
	document.body.appendChild(canvasOverlayScreenHelperResizer);
	
	//bar
	var topBar=document.createElement("div");
	topBar.className="topBar";
	var vblabSpan=document.createElement("canvas");
	vblabSpan.className="topBarvblabIcon";
	vblabSpan.textContent="";
	vblabSpan.width=32;
	vblabSpan.height=32;
	var vblabSpanCTX=vblabSpan.getContext("2d");
	vblabSpanCTX.moveTo(4,8);
	vblabSpanCTX.lineTo(16,24);
	vblabSpanCTX.lineTo(28,32);
	vblabSpanCTX.stroke(); 
	topBar.appendChild(vblabSpan);
	document.body.appendChild(topBar);
	
	infoPanelThingy=document.createElement("div");
	infoPanelThingy.className="infoPanelThingy"
	var infoPanelInnerBar=document.createElement("div");
	infoPanelInnerBar.className="infoPanelInnerBar";
	infoPanelInnerBar.signOut=document.createElement("span");
	var serverButton=document.createElement("div");
	serverButton.className="infoPanelBarButton";
	serverButton.style.backgroundImage="url(http://www.serfish.com/root/img/icon-console-16.png)";
	serverButton.onclick=function(){vidget.run(4);}
	infoPanelInnerBar.appendChild(serverButton);
	var changelogVApp=document.createElement("div");
	changelogVApp.className="infoPanelBarButton";
	changelogVApp.style.backgroundImage="url(http://jira.atlassian.com/images/icons/issuetypes/requirement.png)";
	changelogVApp.onclick=function(){vidget.run(7);}
	infoPanelInnerBar.appendChild(changelogVApp);
	infoPanelThingy.appendChild(infoPanelInnerBar);
	document.body.appendChild(infoPanelThingy);
	
}

vidget=function(){}
vidget.setupVidget=function(d){
		var vidgetParent=this[1];
		var vidgObject=this[0][d];
		var vidgetObjectMovePositionHelperLeft=this[2];
		var vidgetObjectMovePositionHelperRight=this[3];
		vidgetParent.appendChild(vidgObject);
		vidgObject.name=d;
		vidgObject.mouseDowned=false;
		vidgObject.mouseDragging=false;
		vidgObject.onmousedown=function(){
			this.mouseDowned=true;
			this.mouseDragging=false;
			 window.getSelection().removeAllRanges();
		};
		vidgObject.onmouseup=function(){
			this.mouseDowned=false;
			this.mouseDragging=false;
		};
		vidgObject.onclick=function(){
			if(this.mouseDragging)return;
			this.run();
		}
		vidgObject.onmouseover=function(eve){
			vidget.displayVidgetNameUnderVidgetIcon([(this.offsetLeft),(this.offsetTop+this.offsetHeight)],this.name);
		}
		vidgObject.onmouseout=function(eve){
			vidget.clearVidgetName();
			if(this.mouseDowned && !this.fakeElement){
				this.mouseDragging=true;
				var binder=[function(eve){
					var fakeElement=this.fakeElement;
					fakeElement.style.display="none";
					var tar=document.elementFromPoint((eve.clientX-parseInt(fakeElement.offsetWidth/2)),(eve.clientY-parseInt(fakeElement.offsetHeight/2)));
					fakeElement.style.display="";
					fakeElement.style.top=(eve.clientY-parseInt(fakeElement.offsetHeight/2))+"px";
					fakeElement.style.left=(eve.clientX-parseInt(fakeElement.offsetWidth/2))+"px";
					fakeElement.style.transform="scale(1,1)";
					
					if(tar.className.indexOf("vidgetContainerIcon")!=-1 && tar.className.indexOf("vidgetObjectMovePositionHelper")==-1){
						tar.parentNode.insertBefore(vidgetObjectMovePositionHelperLeft,tar);
						tar.parentNode.insertBefore(vidgetObjectMovePositionHelperRight,tar.nextSibling);
					}
					
				
				}, this];
				this.fakeElement=this.cloneNode();
				this.fakeElement.orginEle=this;
				this.fakeElement.style.position="fixed"
				document.body.appendChild(this.fakeElement);
				document.body.className+=" unselectable ";
				window.addEventListener('mousemove',this.mousemoveEvent=function(eve){
					var element=this[1];
					if(element.mouseDragging==false){
						
						document.body.className=document.body.className.replace(" unselectable ","");
						window.removeEventListener('mousemove',element.mousemoveEvent);
						document.body.removeChild(element.fakeElement);
						if(vidgetObjectMovePositionHelperLeft.parentNode){
							vidgetObjectMovePositionHelperLeft.parentNode.removeChild(vidgetObjectMovePositionHelperLeft);
							vidgetObjectMovePositionHelperRight.parentNode.removeChild(vidgetObjectMovePositionHelperRight);
						}
						element.fakeElement=null;
						element.mouseDragging=false;
						

					}else						
						this[0].bind(element)(eve);
						document.title=eve.target.className
				
				}.bind(binder),false);
				
				window.addEventListener('mouseup',this.mouseupEvent=function(eve){
					var element=this[1];
					element.fakeElement.style.display="none";
					var tar=document.elementFromPoint((eve.clientX-parseInt(element.fakeElement.offsetWidth/2)),(eve.clientY-parseInt(element.fakeElement.offsetHeight/2)));
					element.fakeElement.style.display="";
					window.removeEventListener('mouseup',element.mouseupEvent);
					element.mouseDragging=false;
					element.mouseDowned=false;
					element.fakeElement.style.display="none";
					if(tar.className.indexOf("vidgetContainerIcon")==-1 && tar.className.indexOf("vidgetContainerFolder")==-1)return;
					
					if(tar.nextSibling==element){
						tar.parentNode.insertBefore(element,tar);
					}
					else if( tar.className.indexOf("vidgetContainerFolder")!=-1){
						if(tar.img!=element)
							tar.appendChild(element);
					}else{
						tar.parentNode.insertBefore(element,tar);
						var enxtElee=tar.previousSibling;
						element.parentNode.insertBefore(element,enxtElee);
					}
					
					eve.preventDefault();
					eve.stopPropagation();
					return false;
					
				
				}.bind(binder),false);
				
				window.addEventListener('mouseout',this.mouseoutEvent=function(eve){//cancel the drag operation if it went outside
					var from = eve.relatedTarget || eve.toElement;
					var element=this[1];
					if(from)return;

					element.mouseDragging=false;			
					window.removeEventListener('mouseout',element.mouseoutEvent);
				
				}.bind(binder),false);
			
			}
		}
	};
vidget.preload=function(){
	var img=document.createElement("div");
	img.className="vidgetContainerIcon"
	return img;
}
vidget.addFolderTo=function(){
	var img=document.createElement("div");
	img.className="vidgetContainerIcon";
	img.folder=document.createElement("div");
	img.folder.style.display="none";
	img.folder.className="vidgetContainerFolder";
	img.folder.img=img;
	img.folder.expand=function(){
		this.parentNode.parentNode.insertBefore(this,this.parentNode.nextSibling);
		img.folder.style.display="";
	}
	img.folder.vidgets={};
	img.folder.collaspe=function(){
		img.folder.style.display="none";
		this.img.appendChild(this);
	}
	img.appendChild(img.folder);
	return img;
}
vidget.library={};
vidget.tooltipNameFloater=document.createElement("span");
vidget.tooltipNameFloater.className="vidgetNameToolTip";
vidget.displayVidgetNameUnderVidgetIcon=function(xy,name){
	var tooltipNameFloater=this.tooltipNameFloater;
	tooltipNameFloater.textContent=name;
	tooltipNameFloater.setAttribute("style","position:absolute;top:"+(xy[1])+"px;left:"+(xy[0])+"px;");
	tooltipNameFloater.className=" vidgetNameToolTipActive "+tooltipNameFloater.className;
	
}
vidget.clearVidgetName=function(xy,name){
	var tooltipNameFloater=this.tooltipNameFloater;
	tooltipNameFloater.textContent="";
	tooltipNameFloater.setAttribute("style","display:none;");
	tooltipNameFloater.className=tooltipNameFloater.className.replace(" vidgetNameToolTipActive ","");
	
}
vidget.searchVidgetInput=document.createElement("input");
vidget.searchVidgetInput.value="Search Pastebins";
vidget.searchVidgetInput.isDefaulted=true;
vidget.searchVidgetInput.revertify=function(){
	this.setAttribute("style","color:gray;font-style: oblique ;");
	this.value="Search Pastebins"
}
vidget.searchVidgetInput.revertify();
vidget.searchVidgetInput.normalify=function(){
	this.setAttribute("style","");	
}
vidget.searchVidgetInput.onchange=function(){
		this.normalify();
		this.isDefaulted=false;
		for(var d in vidgetObjects){
			if(d.indexOf(this.value)!=-1){
				vidgetObjects[d].style.display="";
			}
			else{
				vidgetObjects[d].style.display="none";
			}
		}
}
vidget.searchVidgetInput.onblur=function(){
	if(this.value===""){
		this.revertify(this.isDefaulted=true);
			for(var d in vidgetObjects){
				vidgetObjects[d].style.display="";
				
			}
	}
}
vidget.searchVidgetInput.onfocus=function(){
	if(this.isDefaulted)
		this.value="";
}
vidget.searchVidgetInput.onkeydown=vidget.searchVidgetInput.onkeyup=vidget.searchVidgetInput.onchange;
vidget.searchVidgetInput.className="vidgetSearchInput";
vidget.searchDisplayVidget=function(){

}
window.onload=startup.activate;

function generateUserLoginUI(){
	
}

function getInputSelection(el) { // Tim Down solution
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

makeHole=function(str){
			this.width=this.parentEle.offsetWidth;
			this.height=this.parentEle.offsetHeight;
			var ctx=this.getContext("2d");
			ctx.font=((document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('font-size')))+" "+document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('font-family')
			ctx.fillStyle=document.defaultView.getComputedStyle(this,null).getPropertyValue('background-color');
			ctx.globalCompositeOperation="source-over";
			ctx.fillRect(0,0,this.width,this.height);
			ctx.globalCompositeOperation="destination-out";
			ctx.fillStyle="white";

			if(str){
				ctx.fillText(str,parseInt(document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('padding-left')),this.height/1.4);
				ctx.fillStyle=document.defaultView.getComputedStyle(this,null).getPropertyValue('color');
				
				ctx.globalCompositeOperation="source-over";
				ctx.fillText(str,parseInt(document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('padding-left')),this.height/1.4);
				ctx.strokeStyle=document.defaultView.getComputedStyle(this,null).getPropertyValue('outline-color');
				ctx.globalAlpha =1;
				ctx.strokeText(str,parseInt(document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('padding-left')),this.height/1.4);
			}
			ctx.globalAlpha = 1;
			
			if(this.start<0)return;
			ctx.strokeStyle=document.defaultView.getComputedStyle(this,null).getPropertyValue('color');
			ctx.beginPath();
			var text=str.substring(0,this.start);
			var caretPos=ctx.measureText(text).width;
			ctx.moveTo(caretPos+3,2);
			ctx.lineTo(caretPos+3,parseInt((document.defaultView.getComputedStyle(this.parentEle,null).getPropertyValue('font-size')))*2);
			ctx.stroke();

		}
		
function makeFriendCard(){

}
 
function selfDescriptiveInputText(defaultText,type){
if(!type)type="text";
var input=document.createElement("input");
input.value=defaultText;
input.isDefaulted=true;
input.setAttribute("type",type);
input.defaultText=defaultText;
input.isPassword=false;
input.revertify=function(){
	this.setAttribute("style","color:gray;font-style: oblique ;");
	if(this.type=="password"){
		this.isPassword=true;
		this.type="text";
	}
	this.value=this.defaultText;
}
input.revertify();
input.normalify=function(){
	this.setAttribute("style","");	
	if(this.isPassword){
		this.isPassword=false;
		this.type="password";
	}
}
input.addEventListener("change",input.onchange=function(eve){
		this.normalify();
		this.isDefaulted=false;
		
}.bind(input), false);

input.addEventListener("blur",function(){
	if(this.value===""){
		this.revertify(this.isDefaulted=true);
	}
}.bind(input),false);
input.addEventListener("focus",function(){
	if(this.isDefaulted)
		this.value="";
}.bind(input),false);
input.onkeydown=input.oninput=input.onkeyup=input.onchange;
return input;
}

function runVidgetAPIThread(){
var newScript=document.createElement("script");
newScript.src="vidgetapi.js";
document.body.appendChild(newScript);
}

function jsonGetNewNotificationRequest(){
	
	var inputFields={command:"addEventListner",
	    data:{
	        eventName:"notification",
    	}
	   
	};
	
	socket.sendListen(inputFields,function(json){
			//alert(json);
			
			});
	
	inputFields={command:"notifgetall",
	    data:{
    	}
	   
	};
	
	socket.sendListen(inputFields,function(json){
			
			});
}

function vidgetifyCSS(vidgetID,cssString){
	//TODO add keyframes support
	cssString=cssString.replace(/^(((\.)*(\w|\s|[\"\[\]\-\:\=\^\,])+|\*|\!|\~)?(\s*>\s*)?(#\w+)?\s*(\.(\w|\:)+)?\s*{)/gm,"."+vidgetID+" $1");
	return cssString;
}