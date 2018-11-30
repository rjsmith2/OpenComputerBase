var scriptPackage=function(){};
//begin your script here
scriptPackage.functionName=function(json){
//do something here
	//clientSocket.echo();
	//db.users.insert({"_id":"AndreiM"});
	/*	
	
	var users=db.collection('users');
	db.runCommand({ping:1}, function(err, res) {
		if(!err && res.ok) clientSocket.echo("we're up");
	});
	clientSocket.echo("users"+users);
	db.users.ensureIndex( {"id": 1 }, { unique: true } );
	//db.users.ensureIndex({"id":1},{unique:true});
	db.users.insert({"_id":"AndreiM", "password":"pass", "id": 1},function(error,data){
			clientSocket.echo("error"+error);
			clientSocket.echo("data"+data);
	});*/
	
	//clientSocket.echo(typeof data);
	//data = this is the data from client;
	//data["email"] is user plain email
	//data["password"] is user password in plain format (I still recommend encrpyting them in database somehow);
	//var userTab=db.collection('user');// this way you dont have to keep repeating "db.scores('user')"
	
	//Do some database operation, verification, authenication, etc
	
	/* here an example you could use to output to client:
	//Example 1
	var messagePackage={
		command:"register",
		data:{
			success:false,
			reason:"Missing password input",
			errorCode:2502359
		}
	}
	clientSocket.echo(messagePacket);//Send it as JSON object. Server.js will handle the rest that you dont need to bother with.
	//Example 2
	var messagePackage={
		command:"register",
		data:{
			success:true,
		}, 
	}

	clientSocket.echo(messagePacket);//Send it as JSON object. Server.js will handle the rest that you dont need to bother with.
	*/	
		/*var mycollection = db.collection('mycollection');
		db.mycollection.find(function(err, docs) {
			clientsocket.echo(docs);
		});
		clientSocket.echo("coolstuff");*/
}
//end your script here
return scriptPackage;
