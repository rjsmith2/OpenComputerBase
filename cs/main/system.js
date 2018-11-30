Desktop=function(){}
Desktop.setWallpaper=function(s){
 postMessage([2000,s]);
}
Desktop.addGlobalCSSSetting=function(id,cssString){
 postMessage([2001,id,cssString]);
}
Desktop.uploadFileToDirectory=function(fileObject,path,callbackFunction,param){
	var hxr=new XMLHttpRequestExternal();
	var desktopHXRID=hxr._listen();
	hxr.callback=callbackFunction
	hxr.param=param;
	 postMessage([703,fileObject,path,desktopHXRID]);
	 hxr.onreadystatechange=function(d){this.callback(d[2],this.param);}
	return hxr;
}
Desktop.getDirectoryID=0;
Desktop.getDirectory=function(path,callbackFunction){
	var hxr=new XMLHttpRequestExternal();
	var desktopHXRID=hxr._listen();
	hxr.callback=callbackFunction
	hxr.onreadystatechange=function(d){this.callback(d[2][0],d[2][1].split(";"));}
	 postMessage([704,path,this.getDirectoryID,desktopHXRID]);
	 return hxr;
}
Desktop.addNewDirectory=function(path,folderName,callbackFunction){
	var hxr=new XMLHttpRequestExternal();
	var desktopHXRID=hxr._listen();
	hxr.callback=callbackFunction
	hxr.onreadystatechange=function(d){this.callback(d[2][0],d[2][1].split(";"));}
	postMessage([705,path,folderName,desktopHXRID]);
	return hxr;
}