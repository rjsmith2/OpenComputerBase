var win=window.open();
var document=win.document;
/*
document.body.addEventListener("mousemove",function(eve){win.title="demo";});
var createElementd=document.createElement("div");
createElementd.textContent="test";
document.body.appendChild(createElementd);
var thisShouldBeFirst=document.createElement("div");
thisShouldBeFirst.textContent="This should be the first";
document.body.insertBefore(thisShouldBeFirst,createElementd);
*/
//insertBefore test two

var grouppie=document.createElement("div");
var test=document.createElement("span");
test.textContent=" a test";
grouppie.appendChild(test);
var test2=document.createElement("span");
test2.textContent="this is";
grouppie.insertBefore(test2,test);
document.body.appendChild(grouppie);
