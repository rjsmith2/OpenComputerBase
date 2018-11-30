var scriptPackage=function(){};
//begin your script here
scriptPackage.register = function(jsonString,clientSocket){
	//{"email": "andreim@hotmail.com", "password":"lolasadsda","firstName":"Andrei","lastName":"Marden","gender":"m","username":"christ","birthday":"05/16/1991"}
	var data=JSON.parse(jsonString);
	if(!data.username || typeof(data.username) == "object" || data.username.length > 32 || data.username.length < 5 ||  /[^a-zA-Z0-9]/.test(data.username)) return clientSocket.echo({success:false,message:"Username is invalid"});
	if(!data.email || typeof(data.email) == "object" || data.email.length > 24) return clientSocket.echo({success:false,message:"Email is not defined"});
    else if(!/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(data.email)){
		return clientSocket.echo({success:false,message:"Email is not valid. Please use a different email"});
	}
	else if(!data.password || typeof(data.password) == "object" || data.password.length < 8) return clientSocket.echo({success:false,message:"Password cannot be validated"});
	else if(!data.firstName || typeof(data.firstName) == "object" || data.firstName.length > 30) return clientSocket.echo({success:false,message:"First Name is not valid"});
	else if(!data.lastName || typeof(data.lastName) == "object" || data.lastName.length > 30) return clientSocket.echo({success:false,message:"Last Name is not valid"});
	else if(!data.gender || typeof(data.gender) == "object" || data.gender.length > 1 || (data.gender != "u" && data.gender != "m" && data.gender != "f")) return clientSocket.echo({success:false,message:"Please select your gender"});
	else if(!data.birthday  || typeof(data.birthday) == "object" || !data.birthday.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) return clientSocket.echo({success:false,message:"Please select valid date"});
	var vLogin = db.collection('vLogin');
	vLogin.insert({email: data.email, password: data.password,username: data.username}, function(err,doc){
	if(err != null){
		if(err.toString().indexOf("username") != -1)return clientSocket.echo({success:false,message:"Email is already in use"});
		return clientSocket.echo({success:false,message:"Email is already in use"});
	}
	var myid = doc._id.toString();
	db.createCollection("u"+myid,"",function(err,doc){
		if(err == null){
			db.collection("u"+myid).insert({_id:"info", username: data.username,firstName: data.firstName, lastName: data.lastName, gender:data.gender,birthday:data.birthday});
		}else{
			return clientSocket.echo({success:false,message:"Cannot register with this username"});
		}
			clientSocket.echo({success:true});
			//mycollection = db.collection("u"+myid);
	});
	});
}
return scriptPackage;
