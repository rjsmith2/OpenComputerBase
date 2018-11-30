var scriptPackage=function(){};
//begin your script here
scriptPackage.uninstall= function(clientSocket){
	////This function removes all relavent folders.
	clientSocket.echo("Starting to delete relevant tables");
	var vLogin=db.collection('vLogin');
	vLogin.find().forEach(function(err,doc){
		if(err){return;}
		if(!doc){
			vLogin.drop();
			return clientSocket.echo("done deleting all related tables");
		}
		db.collection("u"+doc._id.toString()).drop();
	});
	
	db.collection('changelogs').drop();
}
return scriptPackage;
