//file containing window class that interacts with desktop classes and dom
function dragOperationTextWindowFixer(){
    return 'text';
}

function windows(){}
windows.ele=[];
windows.currentFocusInt=1500;
windows.historyStack = [];

function updateHistoryStack(index) {
    windows.historyStack.splice(index, 1);
    for (var i = index, l = windows.historyStack.length; i < l; i++) {
        windows.historyStack[i].stack = i;
    }
}

windows.create=function(windowName,source,taskbarra){//creates a new window
    
    var windowContainer=document.createElement("div");

    windowContainer.id="window"+windows.ele.length;
    windowContainer.className="windowContainer";
    
    windowContainer.stack = -1;

    var windowTitleContainer=document.createElement("div");
    
    windowTitleContainer.id="title"+windows.ele.length;
    windowTitleContainer.className="windowTitleContainer";
    windowTitleContainer.onTitleUpdate=function(){this.parentNode.taskbar.updateTaskTitle(this.parentNode);}
    windows.ele[windows.ele.length]=windowContainer;
    windowContainer.windowTitleContainer=windowTitleContainer;
    var windowContentContainer=document.createElement("div");
    windowContentContainer.className="windowContentContainer";
    windowContentContainer.draggable=false;
    windowContentContainer.ondragstart=function(){return;};
    windowContainer.ondropAction=function(evt){//when window is done moving, make it undraggable.
        this.draggable=false;
    };
    windowTitleContainer.onmousedown=function(){//lets window to be moved if allowed by options (placeholder)
        this.parentNode.draggable=true;
    }
    windowTitleContainer.onmouseup=function(){//window should no longer be draggable anywhere within once mouse is let off.
        this.parentNode.draggable=false;
    }
    
    windowTitleContainer.ondblclick = function(evt) {
        this.windowActionContainer.windowActionMax.onclick();     
        evt.stopPropagation();        
    }
    windowContainer.onfocusAction=function(){
        var lastIndex = windows.historyStack.length - 1;
        
        if (lastIndex >= 0) {
            //the window is already focused so exit
            if (this === windows.historyStack[lastIndex]) return;
            //otherwise remove the class from the previous window
            windows.historyStack[lastIndex].removeClass("windowContainerFocused");
        }
        
        //replace the existing element from the history and push it to end of the stack
        if (this.stack != -1) {
            updateHistoryStack(this.stack);
        }
        
        this.style.zIndex = ++windows.currentFocusInt;
        this.addClass("windowContainerFocused");
        this.stack = windows.historyStack.length;
        windows.historyStack.push(this);
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
            this.draggable=false;
            this.canChange=false;
        }else{
            this.isResizing=false;
            this.canChange=true;
            this.resizeXtype=-1;
            this.resizeYtype=-1;
        }
        this.style.cursor=scursor;
    }
    windowContainer.isResizing=false;
    windowContainer.resizeXtype=-1;
    windowContainer.resizeYtype=-1;
    windowContainer.resizeEvent=function(event,element){
        var element=arguments.callee.ele;
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
        
        window.canvasOverlayScreenHelperResizer.overlayAt(posX,posY,posWidth,posHeight);
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
            window.canvasOverlayScreenHelperResizer.show();
             window.canvasOverlayScreenHelperResizer.zIndex=++windows.currentFocusInt;
            return;
        }
        this.onfocusAction();
    }
    windowContainer.ondragstart=function(evt){//allows drag window movement
        if(!this.canChange || this.isResizing)
            return;
        if(!this.draggable)return;
        evt.dataTransfer.setData(dragOperationTextWindowFixer(),this.windowTitleContainer.id);
        this.style.opacity="1";
        setTimeout(function(d){d.style.opacity="0";},20,this);
        this.offsetPositionX=window.mousex-(this.offsetLeft);
        this.offsetPositionY=window.mousey-(this.offsetTop);
    }
    windowContainer.onDropCancelAction=function(evt){//not used yet
        event.preventDefault();
        var data=event.dataTransfer.getData(dragOperationTextWindowFixer());
        var dragDrop=document.getElementById(data).parentNode;
        dragDrop.canChange=false;
    }
    windowContainer.maximumize=function(){
        this.windowSizeOrgin=[this.offsetWidth,this.offsetHeight];
        this.windowPositionOrgin=[this.style.top,this.style.left];
        this.style.width=this.desktopParent.offsetWidth - 5 +"px";
        this.style.height=this.desktopParent.offsetHeight - 33 +"px";
        this.style.top=this.desktopParent.offsetTop+"px";
        this.style.left=this.desktopParent.offsetLeft+"px";
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
    
    
    var windowTitleText=document.createElement("span");
    windowTitleText.className="windowTitleText";
    windowName?(windowTitleText.textContent=windowName):(windowTitleText.innerHTML="<i>&#8734;</i>");
    var windowActionContainer=document.createElement("div");
    windowActionContainer.className="windowActionContainer"
    /*
    var windowActionClose=document.createElement("img");
    windowActionClose.className="windowActionCloseButton";
    windowActionClose.src='img/windows/close_button.png';
    windowActionClose.onclick=function(){
        var parent=this.parentNode.parentNode.parentNode;
        parent.taskbar.removeWindow(parent);
        parent.desktopParent.removeChild(parent);
    }
    windowActionClose.onmousedown=function(event){//prevents parent function from running
        event.stopPropagation();
        event.preventDefault();
    }
    
    var windowActionMax=document.createElement("img");
    windowActionMax.className="windowActionMaxButton";
    windowActionMax.src='img/windows/amax.gif';
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
    */
    var windowActionMax = createDom("div", {
        className: "micon maximize"
        , onclick: function(evt) {
            var parent = this.parentNode.parentNode.parentNode;
            
            //make sure window in on most top
            parent.onfocusAction();
            
            if (windowActionMax.max) { //restore
                parent.restore();
                this.max = 0;
                this.replaceClass("restore", "maximize");
            } else { //maximumize
                parent.maximumize();
                this.max = 1;
                this.replaceClass("maximize", "restore");
            }
        }
        , onmousedown: function(evt) { //prevents parent function from running
            evt.stopPropagation();
            evt.preventDefault();
        }
    });
    windowActionMax.max = 0;
    
    var windowActionClose = createDom("div", {
        className: "micon close"
        , onclick: function(evt) {
            var parent = this.parentNode.parentNode.parentNode;
            var lastIndex = windows.historyStack.length - 1;
            
            updateHistoryStack(parent.stack);
            
            if (lastIndex == parent.stack && windows.historyStack.length > 0) {
                windows.historyStack[windows.historyStack.length - 1].addClass("windowContainerFocused");
            }
            
            parent.taskbar.removeWindow(parent);
            parent.desktopParent.removeChild(parent);
        }
        , onmousedown: function(evt){//prevents parent function from running
            evt.stopPropagation();
            evt.preventDefault();
        }
    });
    
    
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
    windowContainer.show=function(){
            this.style.display="block";
    }
    windowContainer.hide=function(){
        this.style.display="none";
    }
    windowContainer.moveToDesktop=function(){
        this.desktopParent.appendChild(this);
        this.resizeItself();
        this.onfocusAction();
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
    windowContainer.desktopParent=desktops.ele[0];
    windowContainer.appendChild(windowContentContainer);
    windowContainer.windowContentContainer=windowContentContainer;
    windowContainer.taskbar=taskbarra||desktops.currentFocus.taskbar;
    windowContainer.taskbar.addWindow(windowContainer);

    return windowContainer;
}