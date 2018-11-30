function network(){};//this must send to its own domain only.  No external domains. If external domain, make your own
network.postJSON=function(data,urlTo,callbackFunction,va){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST','../ss/'+urlTo,true);
    xmlhttp.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.callbackFunction=callbackFunction;
    xmlhttp.onreadystatechange=function(){        
            this.callbackFunction(this,va);
    }
    xmlhttp.send("json="+encodeURIComponent(JSON.stringify(data)));
    return xmlhttp;
}
network.post=function(data,urlTo,callbackFunction,va){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST','../ss/'+urlTo,true);
    xmlhttp.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
    xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xmlhttp.callbackFunction=callbackFunction;
    xmlhttp.onreadystatechange=function(){        
            this.callbackFunction(this,va);
    }
    xmlhttp.send(data);
    return xmlhttp;
}
network.get=function(dataurl,callbackFunction,va){
     var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",'../ss/'+dataurl,false);
    xmlhttp.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest");
    xmlhttp.callbackFunction=callbackFunction;
    xmlhttp.onreadystatechange=function(){        
            this.callbackFunction(this,va);
    }
    xmlhttp.send(null);
    return xmlhttp;          
}
network.upload;
network.cookiesPretend={};

