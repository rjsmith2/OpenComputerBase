var scriptPackage=function(){};
//begin your script here
scriptPackage.install= function(clientSocket){
	clientSocket.echo("Staring Install");
	/////Input: _id = id(generated randomly), email, password =password, username = unique used to find DB.vLogin for Logging in.
	db.createCollection("vLogin");
	db.collection("vLogin").ensureIndex({username:1},{unique:true});
	db.collection("vLogin").ensureIndex({email:1},{unique:true});
	////Creates vUsers Table/Collection and makes id be unique.
	////Input: _id = username(unique/primary), id= id reference(unique)
	db.createCollection("changelogs");
	db.collection("changelogs").insert({log:"Changelog activated: all the major changes to the system will be posted here. ", byUser:-1});

	clientSocket.echo("done creating tables");
	////
}
return scriptPackage;
