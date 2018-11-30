return function(){
    
this.vbroadcast=function (JSON){
    for(var i in wss.clients){
        wss.clients[i].send(JSON);//must be already valid and JSON.stringified  (use JSON.stringify to convert object/array to string)
    }
}

return this;
}();