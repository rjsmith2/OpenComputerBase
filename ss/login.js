var scriptPackage=function(){};
var myid,mycollection,myusername;//this is declared globally restricted to login.js only.
//begin your script here
scriptPackage.login = function(jsonString,clientSocket){
	
	var data=JSON.parse(jsonString);
	    //clientSocket.echo({success:false,message:"Error occurred when logging in. Please try again"});
		clientSocket.idc=data.email;//declare this user id to be the rightful owner of the socket. 
		clientSocket.isListening={};
		if(!wss.username[data.email])	wss.username[data.email]=[];
		var idCon=wss.username[data.email].length;
		clientSocket.sID=idCon;
		wss.username[data.email][idCon]=(clientSocket);//Remember, each user can have more than one socket per session.  This may includes user's vidgets' sockets as well.
		if(!clientSocket.parentObject)clientSocket.parentObject=wss.username[data.email];//enabling cyclical references for ease of socket removal (DELETE keyword) and/or closing other connections
		clientSocket.echo({success:true});
		
	

}
//end your script here
return scriptPackage;
