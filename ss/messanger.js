var scriptPackage=function(){};
//begin your script here
scriptPackage.info = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	echo("info");
	var data=JSON.parse(jsonString);
	if(myid == null){
		return clientSocket.echo("Not Logged In");
	}else if(!data.requestid || typeof(data.requestid) == "object"){
		mycollection.findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}else{
		db.collection("u"+data.requestid).findOne({"_id":"info"},function(err,doc){if(err==null)return clientSocket.echo(JSON.stringify(doc));});
	}
}
//end your script here
return scriptPackage;