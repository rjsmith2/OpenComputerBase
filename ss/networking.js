var scriptPackage=function(){};
//begin your script here
//TODO, disconnect the network when a socket disconnects idlingly
scriptPackage.networks={};//network name containing sockets. this is for logged in users
scriptPackage.guestNetworks={};//network name containing sockets for those are not logged in 
scriptPackage.joinNetwork=function(jsonString,clientSocket){
	var data=JSON.parse(jsonString);
	if(!data.networkName)return;
	var myid=clientSocket.idc;
	var networkName=data.networkName.toString().toLowerCase();
	if(!clientSocket.networks)clientSocket.networks={};
	if(!clientSocket.networkPackage)clientSocket.networkPackage=this;
	if(!clientSocket.guestNetworks)clientSocket.guestNetworks={};
	if(!clientSocket.uuid)clientSocket.uuid=generateUUID();
	if(!clientSocket.doNetworkDisconnectClose){
		clientSocket.doNetworkDisconnectClose=function(clientSocket){
			var networkPack=clientSocket.networkPackage;
			for(networkName in clientSocket.networks){
				for(var i=clientSocket.networks[networkName];--i>=0;){
					networkPack.forceLeaveNetwork(clientSocket,networkName);
				}
			}
			for(networkName in clientSocket.guestNetworks){
				for(var i=clientSocket.guestNetworks[networkName];--i>=0;){
					networkPack.forceLeaveGuestNetwork(clientSocket,networkName);
				}
			}
			
		};
	}
	clientSocket.on("close",function(){this.doNetworkDisconnectClose(this);}.bind(clientSocket));
	//check and see if this socket is in previous networks
	if(clientSocket.networks[networkName])this.forceLeaveNetwork(clientSocket,networkName);
	if(clientSocket.guestNetworks[networkName])this.forceLeaveGuestNetwork(clientSocket,networkName);
	if(myid){
		if(!this.networks[networkName])this.networks[networkName]=[];
		this.networks[networkName].push(clientSocket);
		var jsonStr=JSON.stringify({command:"joiner",data:{message:"",from:clientSocket.uuid,networkName:networkName}});
		this.broadcastToANetwork(jsonStr,networkName);
	}else{
		if(!this.guestNetworks[networkName])this.guestNetworks[networkName]=[];
		this.guestNetworks[networkName].push(clientSocket);
		clientSocket.guestNetworks[networkName]=1;
		var jsonStr=JSON.stringify({command:"joiner",data:{message:"",from:clientSocket.uuid,networkName:networkName}});
		this.broadcastToAGuestNetwork(jsonStr,networkName);
		console.log("Joined "+networkName);
	}
	var networkUserList=JSON.stringify({command:"networkUserList",data:{message:this.getUsersIDInNetwork(networkName),from:clientSocket.uuid,networkName:networkName}});
	clientSocket.echo(networkUserList);
	return;
}
scriptPackage.sendJSON=function(jsonString,clientSocket){
	var data=JSON.parse(jsonString);
	if(!data.json)return;//should be a string
	var myid=clientSocket.idc;
	if(!data.networkName)return;
	var networkName=data.networkName.toString().toLowerCase();
	if(!networkName||!(this.networks[networkName]||this.guestNetworks[networkName]))return;
	if(myid){
		
	}else{//guest network
		var jsonStr=JSON.stringify({command:"sendJSON",data:{json:data.json, from:clientSocket.uuid,networkName:networkName}});
		this.broadcastToAGuestNetwork(jsonStr,networkName);
	
	}
	return;
	
}
scriptPackage.broadcastToANetwork=function(jsonString,networkName){
	if(!networkName||!this.networks[networkName])return;
	for(var i=this.networks[networkName].length;--i>=0;){
		this.networks[networkName][i].echo(jsonString);
		
	}
}
scriptPackage.broadcastToAGuestNetwork=function(jsonString,networkName){
	if(!networkName||!this.guestNetworks[networkName])return;
	var network=this.guestNetworks[networkName];
	for(var i=this.guestNetworks[networkName].length;--i>=0;){
		network[i].echo(jsonString);
		
	}
}
scriptPackage.getUsersIDInNetwork=function(networkName){
	var network=this.guestNetworks[networkName];
	var names=[];
	for(var i=this.guestNetworks[networkName].length;--i>=0;){
		names[names.length]=network[i].uuid;
	}
	return names;
}
scriptPackage.forceLeaveNetwork=function(clientSocket,name){
	clientSocket.networkLeave();
}
scriptPackage.forceLeaveGuestNetwork=function(clientSocket,name){
	var network=this.guestNetworks[name];
	for(var i=network.length;--i>=0;)
		if(network[i].uuid==clientSocket.uuid){
	
			var jsonStr=JSON.stringify({command:"unjoiner",data:{message:"",from:clientSocket.uuid}});
			network.splice(i,1);
			delete clientSocket.guestNetworks[name];
			this.broadcastToAGuestNetwork(jsonStr,name);
			return;
		}
}
if(TCPclients==null) console.log("TCPclients are null. Fixme");
scriptPackage.listDevice=function(jsonString,clientSocket){

	var data=JSON.parse(jsonString);
	if(!data.networkName)return;
		
	var networkName=data.networkName;
	var myid=clientSocket.idc;
	var deviceList=TCPclients[networkName];
	
	for(var deviceAddress in deviceList){
		console.log(deviceAddress);
		var jsonStr=JSON.stringify({command:"listDevices",data:{message:deviceAddress,from:clientSocket.uuid}});
		clientSocket.echo(jsonStr);
	}
	
}
scriptPackage.sendToThisDevice=function(jsonString,clientSocket){
	var data=JSON.parse(jsonString);
	if(!data.networkName)return;
	if(!data.address)return;
	if(!data.statement)return;
	
	var address=data.address
	var networkName=data.networkName;
	if(!TCPclients[networkName])return;
	
	//var myid=clientSocket.idc;
	var device=TCPclients[networkName][address];
	if(device)device.write(data.statement+"\n\r");
	
}
//end your script here
return scriptPackage;