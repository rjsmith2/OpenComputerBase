var scriptPackage=function(){};
//begin your script here
scriptPackage.info = function(jsonString,clientSocket){
//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	var data=JSON.parse(jsonString);
	var myid;
	if(!data.username || typeof(data.username) == "object" || data.password.length < 8) clientSocket.echo(clientSocket.ids+"fail");//this.innerInfo(data,clientSocket.ids);
	else if(myid=u2i(data.username))
		this.innerInfo(data,myid);//call it in sync way if cached version is found
	else	db.collection('vLogin').findOne({username:data.username},function(err,doc){
			if(doc==null)return this[2].echo("info>login.findOne of "+this[3]+" not found?");
				this[2].targetedUsername[doc.username]=doc._id;//storing it to ws for caching
				this[0].innerInfo(this[1],doc._id,this[2]);//basically calling to scriptPackage.innerInfo in its origial scope
		}.bind([this,data,clientSocket,data.username]));
	
	return;//don't bother returning anything since we're using both version of sync and async here.
	
}
scriptPackage.innerInfo=function(data,userID,clientSocket){
	if(userID == null){
		return clientSocket.echo("Not Logged In");
	}else{
		db.collection("u"+userID).findOne({"_id":"info"},function(err,doc){
			if(err != null) return this.echo("Error occured");
			else if(doc == null) return this.echo("Page not found");
			else return this.echo(JSON.stringify(doc));
		}.bind(clientSocket));
	}
}
scriptPackage.listPeopleByName=function(jsonString,clientSocket){
	var data=JSON.parse(jsonString);
	var page=Math.max(0,parseInt(data.pageNum));
	
	if(!data.usernameOrEmail)return;
	var email=data.usernameOrEmail;
	if(email.length<1)return;
	var myid=clientSocket.idc;
	var regexName=new RegExp(email,"i");
	
	db.collection('vLogin').count({"username":regexName},function(e,count){
		this[2].echo({"countResults":count,resultFor:this[1].usernameOrEmail});
		
	}.bind([this,data,clientSocket]))
	db.collection('vLogin').find({"username":regexName},{limit:10,skip:10*page},function(err,doc){
			if(doc==null)return;
			for(var dat in doc)
				this[2].echo({result:[doc[dat].username],resultFor:this[1].usernameOrEmail})
		}.bind([this,data,clientSocket]));
}
scriptPackage.followPlus=function(jsonString,clientSocket,preexistingData){
	var data=preexistingData||JSON.parse(jsonString);
	if(!data.target)return;
	var myid=clientSocket.idc;
	if(!data._preloadedID)return this.preloadID(data,clientSocket, //this runs when this data hasn't been preloaded yet  (convert username to its _id before proceeding below). 
			[data.target.toString()]//prepare values to be in _ID format inside numeric array format 
		);
	//If all values are preloaded, proceed to below: else, it aborts. It may abort for following reason: invalid variable, username that doesn't exist, _id that isn't found, or fatal error (syntax for example)
	var preloadedData=data._preloadedID;
	//echo("Result is "+preloadedData[0]);data.target(username)==>data.preloadedID[0](converted)==>outputs target user's_ID
	if(myid == preloadedData[0]) return;
	
	return;//stop here since below at this point here isn't completed
	db.collection('vLogin').findOne({"username":data.target},function(){// There was an issue with this line (it was generating fatal error so I had to fix here); This line should work now.
		if(doc==null)return;
	});
	clientSocket.echo({success:true});
}
scriptPackage.$dbFuncSearchPeopleByEmail=function(email){
	return (this.email.indexOf(email)>1)//3 char min?	

}
scriptPackage.preloadID=function(data,clientSocket,whoArray){
	var funcCaller=arguments.callee.caller.bind(this);	
	data._preloadedID=[]
	whoArray.forEach(function(d,i,a){
		var id;
		if(id=myid=u2i(d)){
			data._preloadedID[i]=id;
			if(data._preloadedID.length==whoArray.length)funcCaller("",clientSocket,data);
		}else{
			db.collection('vLogin').findOne({username:d},function(err,doc){
			if(doc==null)return;
				this[0]._preloadedID[i]=doc._id;
				if(this[0]._preloadedID.length==this[2])this[3]("",this[1],this[0])
			}.bind([data,clientSocket,a.length,funcCaller]));
		}
		
	},null,whoArray);
	return 1;
	
}
//end your script here
return scriptPackage;