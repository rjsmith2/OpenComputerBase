var scriptPackage=function(){};
//begin your script here
scriptPackage.readFile=function(jsonString,clientSocket){
    //{command:"readFile",data:JSON.stringify({"filePath":"server.js"})}
	
    var data=JSON.parse(jsonString);
	
    if(!data.filePath)return;
	
    data.filePath=___dirname+"/cs/"+data.filePath
	console.log("hey");
	console.log(data.filePath);
    //TODO, return if data filePath contain ./ or .. or external domain URL (ex not local);
    fs.readFile(data.filePath,data.fileType|"utf8",function(err, file) {
        if(!clientSocket&&clientSocket.echo)return;  //If user request a file and logs off while loading file ehre, abort.
         if (err) {
            return clientSocket.echo(err);
         }
		return clientSocket.echo({command:"file",data:{message:file}});
	});//might need binding here but try out without for now

}
//end your script here
return scriptPackage;
