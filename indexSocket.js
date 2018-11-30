var ipaddress = '0.0.0.0';
var port      = 50001 //8080;
ERROROBJECTforJSON={};

fs      = require('fs');

console.log(__dirname);
/*
process.on('uncaughtException', function (err) {
//	var json=JSON.stringify({"error":err.message});
	echo("error"+err.message+err.stack);
	include("turtle.js").disconnectAllTurtle()
	for(var i in wss.clients){//might trigger deadlock of error of death D:
		wss.clients[i].send(JSON.stringify({"error":err.message+err.stack,"ERROROBJECTforJSON":(ERROROBJECTforJSON||"")}));
		wss.clients[i].close();
	}
  //console.error(err);
});
*/
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
echo=function(msg){
	
for(var i in wss.clients){
		wss.clients[i].send(JSON.stringify({"data":msg}));
	}
}
var processAbortOld=process.abort;
process.abort=function(){
	var json=JSON.stringify({"warning":"restarting process"});
	echo("FORCED RESTART");
	for(var i in wss.clients){//might trigger deadlock of error of death D:
		wss.clients[i].send(json);
		wss.clients[i].close();
	}
	processAbortOld();
}
var WebSocketServer = require('ws').Server;
var http = require('http');

process.tempInclude=function(fileName){//Make sure the files are in SS directory inside repo folder;
	//check and see if this can introduce memory leak. 
	var fileNameWithoutExt=fileName.slice(0,-3);
	if(global[fileNameWithoutExt])delete global[fileName];//no need to keep previous script for the next script.
	return global[fileNameWithoutExt]=Function(fs.readFileSync(__dirname+'/ss/'+fileName)+'')();	
}
process.include=function(fileName){//Make sure the files are in SS directory inside repo folder;
	var fileNameWithoutExt=fileName.slice(0,-3);
	if(global[fileNameWithoutExt])return global[fileNameWithoutExt];
	return global[fileNameWithoutExt]=Function(fs.readFileSync(__dirname+'/ss/'+fileName)+'')();	
}
//Mongo JS vs MongoDB??? 
tempInclude=process.tempInclude;
include=process.include;


var server = http.createServer(function(request, response) {
    //response.write((new Date()) + ' Received request for ' + request.url);
	//response.writeHead(200, {'Content-Type': 'text/html'});
	 if(request.url=="/turtle" && request.method == "GET"){
	 	fs.readFile(__dirname+"/turtle/index.html","binary",function(err, file) {
	 		if(err)return;
	 		
	 		response.writeHead(200,{"Content-Type": "text/html"});
			response.write(file, "binary"); 
			response.end();
			return;
	 	});
	 	
	 }
	 else if(request.url=="/turtleCSS" && request.method == "GET"){
	 	fs.readFile(__dirname+"/turtle/index.css","binary",function(err, file) {
	 		if(err)return;
	 		
	 		response.writeHead(200);
			response.write(file, "binary"); 
			response.end();
			return;
	 	});
	 	
	 }
	else if(request.url=="/turtleJS" && request.method == "GET"){
	 	fs.readFile(__dirname+"/turtle/index.js","binary",function(err, file) {
	 		if(err)return;
	 		
	 		response.writeHead(200);
			response.write(file, "binary"); 
			response.end();
			return;
	 	});
	 	
	 }
	 else if (request.url=="/turtle" && request.method == "POST"){
	 		 var data = "";
		    request.on("data", function(chunk) {
		        data += chunk;
		    });
		
		    request.on("end", function() {
		        var name = data.match(/id=(\w+)/);
		        var whatDo = data.match(/whatDo=(1)/);
		        var dataTurtle = data.match(/data=(.+?)(\?|$)/);
		        dataTurtle=dataTurtle[1]||"";
		        if(!name[1])return response.end();
		       
		         if(whatDo){
		        	 include("turtle.js").turtleHTTP(name[1],response,dataTurtle);
		         }else{
		            include("turtle.js").turtleRegister(name[1],response,dataTurtle);
		         }
				 
				 
		    }.bind(request));
		   
	 	
	 }else{
	  var filename=request.url;//__dirname+request.url;
	  filename=__dirname+"/cs/"+filename;
   
	  fs.readFile(filename,"binary",function(err, file) {
	      
			if(err) {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("bug!\n");
				response.write(err + "\n");
				response.end();
				return;
			}
		  
			response.writeHead(200);
			response.write(file, "binary"); // this may not work for all other like images,pdf, video, etc ;s. I may need to fix this later but for now we'll use it for html mainly.
			response.end();
		});
	 }
});

server.listen( port, ipaddress, function() {
    console.log(ipaddress + ' Server is listening on port '+port);
});

wss = new WebSocketServer({
    server: server,
    autoAcceptConnections: false
});
wss.username={};
wss.on('connection', function(ws) {
	ws.ec=function(msg,id){
		var d={"data":msg};
		if(id)d["id"]=id;
		this.send(JSON.stringify(d));
		
	};
	ws.targetedUsername={};
  ws.on('message', function(message) {
  		 //ws.send("Server sees this as plain:"+message);
  		 ERROROBJECTforJSON=message;
  	try {//if valid JSON format then
        var json=JSON.parse(message);
        //echo(message);
        var jsonIDCaller=json["idc"]||0;
        this.echo=function(msg){this.ec(msg,jsonIDCaller);jsonIDCaller=null;};//might lead to mixed jsonIDCaller if operated concurrently in both sync/async mode. Check me.
        switch(json["command"]){
			case "install":tempInclude("install.js").install(this);break;
			case "uninstall":tempInclude("uninstall.js").uninstall(this);break;
	        case "register":tempInclude("register.js").register(json["data"],this);break;
	        case "login":tempInclude("login.js").login(json["data"],this);break;
	        case "account_followPlus":tempInclude("info.js").followPlus(json["data"],this);break;
	        case "account_followMinus":tempInclude("info.js").followMinus(json["data"],this);break;
			case "info":tempInclude("info.js").info(json["data"],this);break;
			case "listPeopleByName":tempInclude("info.js").listPeopleByName(json["data"],this);break;
			case "joinNetwork":include("networking.js").joinNetwork(json["data"],this);break;//if you update this file, you need to restart server for this to take effect
			case "sendJSONTo":include("networking.js").sendJSON(json["data"],this);break;//if you update this file, you need to restart server for this to take effect
			//case "messanger":tempInclude("messanger.js").info(json["data"],ws);break;
			//case "notification":tempInclude("info.js").info(json["data"],ws);break;
			case "notify":tempInclude("notification.js").notify(json["data"],this);break;
			case "readFile":tempInclude("fileSystem.js").readFile(json["data"],this);break;
			case "notifgetnew":tempInclude("notification.js").notifgetnew(json["data"],this);break;
			case "notifgetall":tempInclude("notification.js").notifgetall(json["data"],this);break;
			case "turtle":include("turtle.js").turtle(json["data"],this);break;
	        case "evaler":ws.send(JSON.stringify({"evalData":JSON.stringify((1,eval)(json["data"])+""),"jsonOrigin":message}));break;//remove this line prior to official deployment to the internet
        }
    } catch (e) {//else
    	//console window interfaces
    	//ws.send("ERROR ALTERNATIVE PATH USED")
        ws.send(JSON.stringify({"evalData":JSON.stringify(e.stack),"jsonOrigin":message,"errorCatched":true}));//remove this line prior to official deployment to the internet
    }
  	//var json=JSON.stringify({"evalData":(1,eval)(message)});
  
  //	ws.send(new Function("return "+message)().toString());//will be sent as binary btw
  });
});


 u2i=function(username,ws){
	return (wss.username[username]?wss.username[username].id:
				(ws&&ws.targetedUsername&&ws.targetedUsername[username]?ws.targetedUsername[username]:false
				)
			)

}

generateUUID=function(){
    var hr = process.hrtime();
    var d= hr[0]*1e9+hr[1]
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};