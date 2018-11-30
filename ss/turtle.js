var scriptPackage=function(){};
//begin your script here
scriptPackage.turtles={};
scriptPackage.turtle=function(jsonString,clientSocket){
	var data=JSON.parse(jsonString);
    if(data.type && data.type=="getAllListener"){
	    clientSocket.echo((Object.keys(scriptPackage.turtles)));
	    return;
	}
	
	if(!data.turtleName)return clientSocket.echo(JSON.stringify(3));
	
	if(data.appendAction){
	    if(this.turtles[data.turtleName]){
	        if(this.turtles[data.turtleName].response && this.turtles[data.turtleName].action.length==0){
	            this.turtles[data.turtleName].response.writeHead(200,{"Content-Type": "text/plain"});
	            this.turtles[data.turtleName].response.end(data.appendAction);
	        }else{
    	        this.turtles[data.turtleName].action.push(data.appendAction);
    	        
	        }
    	    clientSocket.echo(JSON.stringify(1));
    	    return;
	    }else{
	        
	       clientSocket.echo(JSON.stringify(2)); 
	       return;
	    }
	   
	}else{
	    
	     clientSocket.echo(JSON.stringify(0)); 
        return;
	}
}

scriptPackage.turtleHTTP=function(name,response,dataTurtle){
    //from whatDo turtles
    if(!this.turtles[name])return;
    
    if(this.turtles[name] && this.turtles[name].action.length){
        response.writeHead(200,{"Content-Type": "text/plain"});
	    response.end(this.turtles[name].action.unshift());
    }else
        setTimeout(this.waitingTurtleHTTP.bind(name,response,this),1000);
    if(dataTurtle){
   		var jsonStr=JSON.stringify({command:"sendJSON",data:{turtleStat:dataTurtle, from:name,networkName:"turtlelistener"+name.toLowerCase()}});
		include("networking.js").broadcastToAGuestNetwork(jsonStr,"turtlelistener"+name.toLowerCase());
    }
    this.turtles[name].response=response;
    
}

scriptPackage.waitingTurtleHTTP=function(name,response){
    //from whatDo turtles
    if(!this[2] || !this[2].turtle)return;
    name=this[0];
    response=this[1];
    if(!this[2].turtles[name])return;
    if(this[2].turtles[name] && this[2].turtles[name].action.length){
       response.writeHead(200,{"Content-Type": "text/plain"});
	   response.end(this[2].turtles[name].action.unshift());
    }else if(this[2].turtles[name])
        setTimeout(this[2].waitingTurtleHTTP.bind(name,response),1000);
    return;
    
}

scriptPackage.turtleTick=function(name){
	//clientSocket.echo();
}

scriptPackage.disconnectAllTurtle=function(name){
	scriptPackage.turtles.forEach(function(){d.response.end() });
}

scriptPackage.turtleRegister=function(name,response,dataTurtle){
    this.turtles[name]={action:[],response:response,listeningSocket:{}}
	response.writeHead(200,{"Content-Type": "text/html"});
	 response.end("1");
	if(dataTurtle){
   		var jsonStr=JSON.stringify({command:"sendJSON",data:{turtleStat:dataTurtle, from:name,networkName:"turtlelistener"+name.toLowerCase()}});
		include("networking.js").broadcastToAGuestNetwork(jsonStr,"turtlelistener"+name.toLowerCase());
    }
	 
}
//end your script here
return scriptPackage;
