var scriptPackage=function(){};
//begin your script here
scriptPackage.doChangeLogThis= function(json,clientSocket){
//must be a valid clientSocket (with idc and has admin permission) otherwise  should abort.
if(json && json.msg && json.msg.length>5)
db.collection("changelogs").insert({log:json.msg.toString(), byUser:-1, date:new Date()});

}
return scriptPackage;
