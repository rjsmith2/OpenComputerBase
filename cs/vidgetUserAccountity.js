var postMessageOrg=postMessage;
userSystem=function(PID){
    this.PID=PID
};
userSystem.prototype.counterCallBacker=0;
userSystem.prototype.functG=[];
userSystem.prototype.postMessage=function(arg){
    arg.unshift(this.PID);
	postMessageOrg(arg);

}
userSystem.prototype.followPlus=function(who,callBack){
    this.postMessage([2000,["followPlus",this.counterCallBacker,who]]);
    this.functG[this.counterCallBacker]=callBack;
    this.counterCallBacker++;
}
userSystem.prototype.followMinus=function(who,callBack){
    this.postMessage([2000,["followMinus",this.counterCallBacker,who]]);
    this.functG[this.counterCallBacker]=callBack;
    this.counterCallBacker++;
}
userSystem.prototype.callBackTrigger=function(event){
    this.functG[event[3]](event[2]);
}
userSystem.prototype.followMinus=function(who){
    
}