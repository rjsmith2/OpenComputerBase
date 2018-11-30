var ipaddress = '0.0.0.0';
var port      = 80 //8080;
ERROROBJECTforJSON={};
//pastebin run M9T2iHcv
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
___dirname=__dirname
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
echo=function(msg){
	
for(var i in wss.clients){
		wss.clients[i].send(JSON.stringify({"data":msg}));
	}
}
var WebSocketServer = require('ws').Server;
var http = require('http');
var mime = require('mime');
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
		  
			response.writeHead(200,{"Content-Type":mime.lookup(filename)});
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
	port: 8000,
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
        this.echo=function(msg){this.ec(msg,jsonIDCaller);};//might lead to mixed jsonIDCaller if operated concurrently in both sync/async mode. Check me.
        switch(json["command"]){
			case "install":tempInclude("install.js").install(this);break;
			case "uninstall":tempInclude("uninstall.js").uninstall(this);break;
	        case "register":tempInclude("register.js").register(json["data"],this);break;
	        case "login":tempInclude("login.js").login(json["data"],this);break;
			case "info":tempInclude("info.js").info(json["data"],this);break;
			case "listDevices":include("networking.js").listDevice(json["data"],this);break;
			case "relayToDevice":include("networking.js").sendToThisDevice(json["data"],this);break;
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
        //ws.send(JSON.stringify({"evalData":JSON.stringify(e.stack),"jsonOrigin":message,"errorCatched":true}));//remove this line prior to official deployment to the internet
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
console.log("websocket listening");

//UNIX SOCKETING 

var net = require('net');
TCPclients={};
var tcpServer = net.createServer(function(client) {
    // Do something with the client connection
	console.log("unix socket generated");
	client.write("print(\"Connected to Webby Jalopeno Central Service!\");\n");
	client.dataMemory={};
	client.on('error', function(err,a,b,c){
        if(!this.dataMemory)return;//this could lead to memory leak not closing connections properly.
		if(!this.dataMemory.registeredTo)return;
		delete TCPclients[this.dataMemory.registeredTo.toLowerCase()][this.add];
		var jsonStr=JSON.stringify({command:"deviceOffline",data:{json:{message:"[\""+ this.dataMemory.address+" is offline!\"]"}, from:"",networkName:this.dataMemory.registeredTo.toLowerCase()}});
		
		include("networking.js").broadcastToAGuestNetwork(jsonStr, this.dataMemory.registeredTo.toLowerCase());
    });
	client.on("close",function(){
		console.error("Closing",this.dataMemory); 
		
		if(!this.dataMemory)return;
		if(!this.dataMemory.registeredTo)return;
		delete TCPclients[this.dataMemory.registeredTo.toLowerCase()][this.add];
		var jsonStr=JSON.stringify({command:"deviceOffline",data:{json:{message:"[\""+ this.dataMemory.address+" is offline!\"]"}, from:"",networkName:this.dataMemory.registeredTo.toLowerCase()}});
		
		include("networking.js").broadcastToAGuestNetwork(jsonStr, this.dataMemory.registeredTo.toLowerCase());
	}.bind(client));
	 client.on('data', function (data) {      
		if(data instanceof Buffer) data=new Buffer(data).toString("utf-8");
		console.log('\x1b[36m%s\x1b[0m',new Date().toTimeString().split(" ")[0],
					"\x1b[38m","DATA",data.toString());
		var datArr=data.toString().split(/\n\r*/g);	
		console.log('\x1b[36m%s\x1b[0m',"-----"+new Date().toTimeString().split(" ")[0],"datArr",datArr);
		datArr.pop();		
		var code=datArr.pop();
		console.log('\x1b[36m%s\x1b[0m',"-----"+new Date().toTimeString().split(" ")[0],"Code",code);
		//console.log('\x1b[36m%s\x1b[0m',new Date().toTimeString().split(" ")[0] + "------------------", data);
		//console.log('\x1b[36m%s\x1b[0m',new Date().toTimeString().split(" ")[0] + "------------------");
		if(code=="LGN"){
			console.log("Device logging in");
			 var data=datArr;
			 var user="";
			 var pass=null;
			 var add="";
			
			 datArr.forEach(function(val){
				var data=val.toString().split("=");
				if(data[0]=="u"){
					user=data[1].split(",")[1];
					add=data[1].split(",")[0];
				}else if(data[0]=="p"){
					pass=data[1];
				}
			 });
			
			 this.dataMemory.registeredTo=user;
			 this.dataMemory.password=pass;
			 this.dataMemory.address=add;
			 if(add==null){
				this.write("print(\"This device has no address. Terminating this connection.\");");
			 }
			 
			 if(!TCPclients[user.toLowerCase()]) TCPclients[user.toLowerCase()]={};
			 TCPclients[user.toLowerCase()][add]=this;
			if(!this.dataMemory.registeredTo){
				this.write("setBackEndCode(\"RQ1\");print(\"It appears that this device is not registered..\");");
				this.write("print(\"Please register this device first before connecting!\");");
				this.write("print(\"Would you like to register now? (Y/n)\");");
				this.write("sendBackMsg(io.read());\n");
				return;
			}
			
			if(this.dataMemory.registeredTo){
				var jsonStr=JSON.stringify({command:"deviceOnline",data:{json:{message:"[\""+add+" is now online!\"]"}, from:"",networkName:user.toLowerCase()}});
				include("networking.js").broadcastToAGuestNetwork(jsonStr,user.toLowerCase());
			}
			//this.write("\n");
		}
		if(code=="SLP"){
			
			if(!this.dataMemory.registeredTo){
				this.write("setBackEndCode(\"RQ1\");print(\"It appears that this device is not registered.\");");
				this.write("print(\"Please register this device first before connecting!\");");
				this.write("print(\"Would you like to register now? (Y/n)\");");
				this.write("sendBackMsg(io.read());\n");
				return;
			}
		var jsonStr=JSON.stringify({command:"deviceMessage",data:{message:datArr}, from:this.dataMemory.address,networkName:this.dataMemory.registeredTo.toLowerCase()});
		  include("networking.js").broadcastToAGuestNetwork(jsonStr,this.dataMemory.registeredTo.toLowerCase());
		    console.log('\x1b[33m%s\x1b[0m',jsonStr);//value from clients (PRINT RESULT, ERRORS)
			console.log('\x1b[33m%s\x1b[0m',this.dataMemory);//value from clients (PRINT RESULT, ERRORS)
			//this.write("\n");
		}else if(code=="FCT"){//send function to client webworker
		  var jsonStr=JSON.stringify({command:"deviceEvalThis",data:{json:JSON.stringify(datArr)}, from:this.dataMemory.address,networkName:this.dataMemory.registeredTo.toLowerCase()});
		  include("networking.js").broadcastToAGuestNetwork(jsonStr,this.dataMemory.registeredTo.toLowerCase());
		}
		else if(code=="RQ1"){//regestering Input begin
			if(!datArr.length)return;
			
		   var userInput=datArr.pop().toString().substr(0,1);
		   if ( (userInput || "").toLowerCase()=="y"){
				this.write("setBackEndCode(\"RQ2\");");
				this.write("print(\"Register this device to a user.\");");
				this.write("print(\"Please insert a name of user. This device will be registered to that user.\");");
				this.write("print(\"To cancel, leave it blank.\");");
				this.write("local username=io.read();");				
				this.write("sendBackMsg(require(\"component\").computer.address..\",\"..username);\n");
		   }
		   else{
			this.write("print(\"Un-registered device is not authorized to stay connected. Server will now terminate this connection.\");\n");
		     this.destroy();
		   }
		}
		else if(code=="RQ2"){//registering device input
			console.log("RQ2--",datArr)
		   var userInput=datArr.pop().toString();
		   userInput=userInput.split(",");
		   console.log("\x1b[38m",userInput);
		   if (userInput[1].length>0){
				this.write("Jalo={};");
				this.write("Jalo.username='"+userInput+"';");	
				this.write("writeToFile('Jalopeno.ini',require(\"serialization\").serialize(Jalo));\n");
			    this.write("print();require(\"component\").computer.beep(300,0.75); \n");
				 this.write("print(\"*SOFT GRINDING SOUND EFFECT FROM WITHIN*\");\n");
				this.write("print(\"*GRINDING STOPS, [then you could almost smell something sizzling, what could that be you wonder...]*\");\n");
				this.write("print(\"This device is marked and now is the property of Jalopeno Central Service. All rights and ownership of this device now belong to Jalopeno! (no, really!) \")\n");
				this.write("print(\"You can access this device from [missing WWW link here, report to the Jalopeno Central Service to fix]\")\n");
				this.dataMemory.registeredTo=userInput[1];
				this.dataMemory.address=userInput[0];
				var jsonStr=JSON.stringify({command:"deviceRegistered",data:{json:{message:"[\""+userInput[0]+" registered to your collection!\"]"}, from:"",networkName:userInput[1].toLowerCase()}});
				include("networking.js").broadcastToAGuestNetwork(jsonStr,userInput[1].toLowerCase());
				if(!TCPclients[userInput[1].toLowerCase()]) TCPclients[userInput[1].toLowerCase()]={};
				TCPclients[userInput[1].toLowerCase()][userInput[0]]=this;
		   }
		   else{
		    this.write("print(\"Empty input detected. Server will now cancel processing.\");\n");
			this.write("print(\"Un-registered device is not authorized to stay connected. Server will now terminate this connection.\");\n");
		     this.destroy();
		   }
		}
		else if(this.dataMemory.registeredTo){//else just print it to the websites
			
		  var jsonStr=JSON.stringify({command:"deviceMessage",data:{json:datArr}, from:"",networkName:this.dataMemory.registeredTo.toLowerCase()});
		  include("networking.js").broadcastToAGuestNetwork(jsonStr,this.dataMemory.registeredTo.toLowerCase()) && console.log(code,jsonStr);
		  }
		 else
			console.log("uncaptured networking event, hackers be hacking") ;
		//console.log("datArr",'\x1b[33m%s\x1b[0m',datArr)
		  
    }.bind(client));
});
tcpServer.listen(81);
console.log("unixTCP Socket listening");