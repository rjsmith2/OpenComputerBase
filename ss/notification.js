var scriptPackage=function(){};
//begin your script here
scriptPackage.notify = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	echo("notify");
	var data=JSON.parse(jsonString);
	
	
	if(myid == null){
		return clientSocket.echo("Not Logged In");
	}else if(!data.requestid || typeof(data.requestid) == "object"){
		mycollection.findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}else{
		db.collection("u"+data.requestid).findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}
}

scriptPackage.notifgetnew = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	echo("notifgetnew");
	var data=JSON.parse(jsonString);
	
	
	if(myid == null){
		return clientSocket.echo("Not Logged In");
	}else if(!data.requestid || typeof(data.requestid) == "object"){
		mycollection.findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}else{
		db.collection("u"+data.requestid).findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}
}

scriptPackage.notifgetall = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	if(clientSocket.idc == null){
		return clientSocket.echo("Not Logged In");
	}else{
		var userID=clientSocket.idc;
		db.collection("u"+userID).find({"_id":"notification"},{"listing":{$slice:-5}}).forEach(function(err,doc){
			if (!doc) {
			// we visited all docs in the collection
				return;
			}
			if(err != null) return this.echo("Error occured");
			else if(doc == null) return this.echo("Page not found");
			else return this.echo(JSON.stringify(doc));
		}.bind(clientSocket));
;
	}
}
//end your script here
return scriptPackage;