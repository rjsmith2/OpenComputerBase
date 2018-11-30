var scriptPackage=function(){};
//begin your script here
scriptPackage.logout = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	var data=JSON.parse(jsonString);
	myid = null;
	//mycollection = null;
	return clientSocket.echo("Successfully logged out");
}
//end your script here
return scriptPackage;
