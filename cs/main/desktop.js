//file containing desktop class that interacts with dom

function desktops(){};
desktops.ele=[];//each desktop has a id;
desktops.currentFocus=null;
desktops.create=function(){//create a new desktop class
    var desktop=document.createElement("div");
    desktop.ondblclick=function(){}
    desktop.dataSetting={};
    desktop.desktopSetting={};
    desktop.id='desktop'+desktops.ele.length;
    desktops.ele[desktops.ele.length]=desktop;
    desktop.className="desktopView";
    desktop.appendToDom=function(){
        document.body.appendChild(this);
        //adds this desktop to the user interface
    }
    desktop.removeFromDom=function(){
        //removes this desktop
    }
    desktop.show=function(){
        // same as desktop.show=this.style.display='';
        this.style.display="block";
    }
    desktop.hide=function(){
        // same as desktop.hide=this.style.display='none';
        this.style.display="none";
    }
    desktop.rearrange=function(){
         //reorder the desktops that are already created.
        //useful for users that wish to arrange desktops in specific order.. like most windows to least windows, etc
    }
    desktop.ondrop=function(event){
        event.preventDefault();
        var data=event.dataTransfer.getData(dragOperationTextWindowFixer());
        if(!document.getElementById(data))return;
        var dragDrop=document.getElementById(data).parentNode;
        if(dragDrop.ondropAction){
            dragDrop.ondropAction(event);
        }
        dragDrop.style.opacity="";
        if(dragDrop.canChange){
            dragDrop.style.top=(event.clientY-dragDrop.offsetPositionY)+"px";
            dragDrop.style.left=(event.clientX-dragDrop.offsetPositionX)+"px";
        }

    };
    desktop.ondragover=function(evt){evt.preventDefault();};
    desktop.icon={}
    desktop.icon.add=icons.create;
    desktop.gridSizeMultiply=48;
    
    //create a new desktop view.  You can create more than one desktop view.
    //does not initially get add to DOM when called. Must call .appendToDOM
    //attach events, update desktops.ele to include new desktop
    desktop.iconPlacement=[];//included icon id
    //desktop.taskbar=new Taskbar();
    this.currentFocus=desktop;//each time new desktop are made, give that a focus and hide other desktops.
    return desktop;
}



function icons(){};
icons.ele=[];
icons.create=function(name,imageUrl,type,pointer,desktopOptional){
    var iconContainer=document.createElement("div");
    var iconName=document.createElement("span");
    iconName.textContent=name;
    var icon=document.createElement("canvas");
    icon.width=desktopOptional?desktopOptional.gridSizeMultiply-16:48;
    icon.height=desktopOptional?desktopOptional.gridSizeMultiply-16:48;
    var imgLoader=new Image();
    imgLoader.src=imageUrl;
    imgLoader.icon=icon;
    imgLoader.onload=function(){        
        icon.getContext("2d").drawImage(this,0,0,icon.width,icon.height);
    }
    iconContainer.style.width=(desktopOptional?desktopOptional.gridSizeMultiply:48)+"px";
    iconContainer.onmouseover=function(){
        this.className+=' iconContainerOnDesktopHover';
    }
    iconContainer.onmouseout=function(){
        this.className='iconContainerOnDesktop';
    }
    iconContainer.draggable=true;
    iconContainer.isDragging=false;
    iconContainer.ondragstart=function(evt){
        evt.dataTransfer.setData("text/plain",this.icon.id);
        this.style.opacity="0.5";
        setTimeout(function(d){d.style.opacity="0";},20,iconContainer);
        this.offsetPositionX=window.mousex-(this.offsetLeft);
        this.offsetPositionY=window.mousey-(this.offsetTop);
    }
    iconContainer.ondragend=function(evt){
        
    }
    iconContainer.canChange=true;
    iconContainer.onmousemove=iconContainer.onmouseover=iconContainer.onmouseout=function(evt){

    }
    iconContainer.position=[];
    iconContainer.icon=icon;
    icon.id='icon'+icons.ele.length;
    icon.intID=icons.ele.length;
    icon.iconType=type;
    iconContainer.className="iconContainerOnDesktop";
    iconName.className="iconNameOnDesktop";
    icon.className="iconOnDesktop";
    icon.filePointer=pointer;
    icons.ele[icons.ele.length]=icon;
    icon.desktopContainer=null;
    icon.propertiesFlag={};
    icon.clone=function(){
    
    }
    icon.positions=[0,0];
    icon.setPositions=function(x,y){
        this.positions=[x,y];
    }
    iconContainer.moveToDesktop=function(desktopEle,x,y){//x and y is relative to desktop's position
        this.desktopContainer=desktopEle;
        desktopEle.appendChild(this);
        desktopEle.iconPlacement[this.intID]=this;
        this.style.top=y+"px";
        this.style.left=x+"px";
        
    }
    icon.colorize=function(){
    
    }
    icon.triggerRun=function(){
    
    }
    icon.paintImageIcon=function(){
    
    }
    icon.titleText=function(){
    
    }
    icon.notification={}
    icon.notification.count=function(){
    
    }
    icon.notification.toolTip=function(){
    
    }
    iconContainer.appendChild(icon);
    iconContainer.appendChild(iconName);
    return iconContainer;

    
}

function frame(){};
frame.addFrameToDesktop=function(destkopToAppendTo){
	var container=document.createElement("div");
	container.className="tlView";
	container.setAttribute("style","width:100%;");
	container.color=parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256);
	container.addRow=function(){
		var rowContainer=document.createElement("div");
		rowContainer.color=this.color;
		rowContainer.setAttribute("style","background-color:rgba("+rowContainer.color+",0.4);box-shadow: 0px 0px 5px 1px black;");
		rowContainer.addRow=this.addRow;
		this.appendChild(rowContainer);
		rowContainer.addCell=function(){
			var cell=document.createElement("div");
			cell.setAttribute("style","padding:2px;border:1px solid black;width:150px;height:50px;vertical-align:center;background: radial-gradient(ellipse at center, rgba(255,255,255,0) 0%,rgba(255,255,255,0) 92%,rgba("+this.color+",1) 100%);border:1px solid rgb("+this.color+");");
			this.appendChild(cell);
			cell.addRow=this.addRow;
			return cell;
		}
		return rowContainer;
	}
	destkopToAppendTo.appendChild(container);
	return container;
}
