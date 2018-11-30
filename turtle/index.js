var socketerCounter=0;
window.loaded=false;
window.onload=function(){this.loaded=true};
var socketer=function(){};
socketer.consoleSocket=null;
doFunction={};
socketer.socket=function(){
	console.log("Socketing...")
    var consoleSocket = new WebSocket("ws://andrei-rocko.rhcloud.com:8000/index.html");
    consoleSocket.socketer=this;
    consoleSocket.onopen=function(){
        if(window.loaded && window.startup)startup();
 
        
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
    	else if(JSON.parse(json.data).command){
        	var type=JSON.parse(json.data).command;
        	
        	 if(json.data && type=="sendJSON"){
        	   var data=JSON.parse(json.data).data;
                var from=data.from;
                if(data.turtleStat){
                    var jsonStringer=decodeURIComponent(data.turtleStat.replace(/\+/g, ' '));
                    jsonStringer=jsonStringer.replace(/\\$(\n|\r|\n\r|\r\n)*/gm,"");
                    //console.log(jsonStringer);
                    var j=JSON.parse(jsonStringer);
                // turtles[from].button.title
                    if(j["hasErroredOut"])
                     turtleLog.textContent+="\nERROR FROM "+from+": "+j["lastPrintResult"];
                    else if(j["lastPrintResult"] && j["lastPrintResult"]!="nil"){
                     turtleLog.textContent+="\nMessage from "+from+": "+j["lastPrintResult"];  
                    }
                     turtleLog.scrollTop =turtleLog.scrollHeight;  
                    delete j["lastPrintResult"];
                    delete j["hasErroredOut"];
                    var str=from+":\n";
                    for(var name in j){
                        str+="\n"+name+": "+j[name];
                    }
                turtles[from].button.textContent=str;
               
                }
         	  }
    	}
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
test = "test \
"
turtles={};
socket=socketer.socket();
setInterval(function(){socket.send(0)},10000);
startup=function(){
    printUsefulButtons();
    var fie={command:"turtle",
        data:JSON.stringify({
        	type:"getAllListener"
        })
    };
    
   socket.sendListen(fie,function(json){
       json.forEach(function(d){
           var o=document.createElement("button");
           o.textContent=d;
           turtles[d]={}
           turtles[d].button=o;
           o.isUsed=false;
           o.style.whiteSpace="pre";
           o.style.margin="2px";
           o.onclick=function(){
             this.isUsed=!this.isUsed;
             this.style.outline=(this.isUsed?1:0)+"px solid green";
             this.style.backgroundColor=(this.isUsed?"":"green");
           }
           o.value=d;
           turtlesSection.appendChild(o);
           var o={command:"joinNetwork",data:JSON.stringify({networkName:"turtleListener"+d})};
	        socket.send(JSON.stringify(o));
       });
       
   } );
    
    turtlesSection=document.createElement("div");
    
    document.body.appendChild(turtlesSection);
    
    turtleLog=document.createElement("textarea");
    turtleLog.readOnly=true;
    turtleLog.placeholder="Messages from turtles will be shown here";
    turtleLog.setAttribute("style","margin-top:15px;width:100%;display:block;clear:both;margin-right:auto;margin-left:auto;height:170px;")
    
    turtleCommand=document.createElement("textarea");
    turtleCommand.placeholder="Insert turtle/LUA commands here (advanced)";
    turtleCommand.setAttribute("style","margin-top:15px;width:80%;display:block;clear:both;margin-right:auto;margin-left:auto;height:170px;")
    
    turtleCommandSaved=document.createElement("div");
    turtleSave=document.createElement("button");
    turtleSave.textContent="Save As Button";
    turtleSave.onclick=function(){
          var button = document.createElement("button");
            button.cmdValue=turtleCommand.value;
            button.textContent=turtleCommand.value;
            button.onclick=function(){
                
                var fie={command:"turtle",
                 data:JSON.stringify({
            	    appendAction:this.cmdValue,
            	    turtleName:turtleName.value
                 })
                 };
             
                socket.sendListen(fie,function(json){
                
              
                 } );
                
            }
            turtleCommandSaved.appendChild(button);
            turtleCommand.value="";
    }
    turtleSend=document.createElement("button");
    turtleSend.textContent="Send";
    turtleSend.onclick=function(){
        var doTurtles=getSelectedTurtles();
        for(var i=0;i<doTurtles.length;i++){
            var fie={command:"turtle",
             data:JSON.stringify({
        	    appendAction:turtleCommand.value,
        	    turtleName:doTurtles[i]
             })
             };
     
        socket.sendListen(fie,function(json){
        
      
         } );
        }
             
           
            
            
            
        
    };
    document.body.appendChild(turtleSend);
    
    document.body.appendChild(turtleSave);
   
    var oldCmd=""
    turtleCommand.onkeyup=function(event){
        var key= event.keyCode;
        return;
        
    
    }
   document.body.appendChild(turtleCommand);
   document.body.appendChild(turtleCommandSaved);
   document.body.appendChild(usefulCommand);
    document.body.appendChild(turtleLog);
    delete startup;
}

var usefulCommand=document.createElement("div");
function printUsefulButtons(){
    var usefulCommands=[
        "turtle.up()",
        "turtle.down()",
        "turtle.turnLeft()",
        "turtle.turnRight()",
        "turtle.forward()",
        "turtle.back()",
        "turtle.attack()",
        "turtle.digUp()",
        "turtle.attackUp()",
        "turtle.digDown()",
        "turtle.attackDown()",
        "turtle.place()",
        "turtle.placeUp()",
        "turtle.placeDown()",
        "turtle.inspect()",
        "turtle.inspectUp()",
        "turtle.inspectDown()",
        "turtle.select(turtle.getSelectedSlot()+1)",
        "turtle.select(turtle.getSelectedSlot()-1)",
        "turtle.attackUp()",
        "turtle.up()",
        
        ]
    usefulCommands.forEach(function(d){
        var but=document.createElement("button");
        but.onclick=function(){
                var doTurtles=getSelectedTurtles();
                for(var i=0;i<doTurtles.length;i++){
                    var fie={command:"turtle",
                     data:JSON.stringify({
                	    appendAction:this.cmdValue,
                	    turtleName:doTurtles[i]
                     })
                     };
             
                socket.sendListen(fie,function(json){
                
              
                 } );
                }
            }
        but.cmdValue=d;
        but.textContent=d;
        usefulCommand.appendChild(but);
    });
}

function getSelectedTurtles(){
    var turtles=turtlesSection.childNodes;
    var selectedTurtle=[];
    for(var i=turtles.length;--i>=0;){
        if(turtles[i].isUsed)
            selectedTurtle.push(turtles[i].value);
    }
    return selectedTurtle;
}