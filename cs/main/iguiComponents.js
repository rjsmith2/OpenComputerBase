//addon for igui.js; extends ui library system that works with guiApps.css
if(document.createElement==null)console.log("dependencies missing");
iguiComponents={};
iguiComponents.create={};
iguiComponents.create.listWithDisplayPanel=function(){
   var panelTableView= document.createElement("div");
   panelTableView.className="tlView";
   panelTableView.row=[];
   panelTableView.row.push(document.createElement("div"))
   panelTableView.row[0].cell=[];
   panelTableView.row[0].cell.push(document.createElement("div"));
   panelTableView.row[0].cell.push(document.createElement("div"));
   
   panelTableView.listView=panelTableView.row[0].cell[0];
   panelTableView.listView.addList=function(iconSrc,title){
        var divRow=document.createElement("div");
        divRow.className="listRowWithIconAndCaption"
        var icon=document.createElement("img");
        icon.src=iconSrc;
        
        var caption=document.createElement("span");
        caption.textContent=title;
        divRow.icon=icon;
        divRow.caption=caption;
        divRow.appendChild(icon);
        divRow.appendChild(caption);
        this.appendChild(divRow);
        return divRow;
   
   }
   
   panelTableView.listView.className='tListIconView'
   panelTableView.panelView=panelTableView.row[0].cell[1];
   panelTableView.panelView.className='tPanelView'
   panelTableView.appendChild(panelTableView.row[0]);   
   panelTableView.row[0].appendChild(panelTableView.row[0].cell[0]);     
   panelTableView.row[0].appendChild(panelTableView.row[0].cell[1]);
   return panelTableView;
  
}

iguiComponents.create.directoryTreeWithDisplayPanel=function(){
   var panelTableView= document.createElement("div");
   panelTableView.className="tlView";
   panelTableView.row=[];
   panelTableView.row.push(document.createElement("div"))
   panelTableView.row[0].cell=[];
   panelTableView.row[0].cell.push(document.createElement("div"));
   panelTableView.row[0].cell.push(document.createElement("div"));
   
   panelTableView.directoryTreeView=panelTableView.row[0].cell[0];
   
   var container=document.createElement("div");
   panelTableView.directoryTreeView.appendChild(container);
   panelTableView.directoryTreeView.container=container;
   panelTableView.directoryTreeView._dataElementArray={};
   panelTableView.directoryTreeView.addDirectory=function(folderName,folderIcon,insertBeforeEle){
        var divRow=document.createElement("div");
        divRow.className="directoryTreeRowWithIconCaptionAndArrowClosed";
		divRow._getElementByName=function(){};
		divRow.getFullUrlAsArray=function(arr){
				if(!arr)
					arr=[];
				arr.unshift(this.caption.textContent);
				if(this.parentNode.parentNode.getFullUrlAsArray){
					return this.parentNode.parentNode.getFullUrlAsArray(arr);
				}
			return arr;
			}
		if(this._dataElementArray!=null && this._dataElementArray[folderName]){
			return this._dataElementArray[folderName];
		}
		this._dataElementArray[folderName]=divRow;
        var icon=document.createElement("img");
        icon.src=folderIcon;
        divRow.expanded=false;
        
        var caption=document.createElement("span");
        caption.textContent=folderName;
        divRow.icon=icon;
        divRow.caption=caption;
        divRow.appendChild(icon);
        divRow.appendChild(caption);
        if(this.container){
            if(insertBeforeEle)
                this.container.insertBefore(divRow,insertBeforeEle);
            else
                this.container.appendChild(divRow);
        }else{
            if(insertBeforeEle)
                this.insertBefore(divRow,insertBeforeEle);
            else
                this.appendChild(divRow);
        }
        
            
        divRow.tree=document.createElement("div");
		divRow.tree._dataElementArray={};
		divRow.tree.addDirectory=this.addDirectory;
        divRow.tree.show=function(){
            this.setAttribute('style',"display:block");
        }
        divRow.tree.hide=function(){
            this.setAttribute('style',"display:none");
        }
        icon.onclickAction=function(icon){
           var parent=this.parentNode;            
            if(parent.expanded){
                parent.tree.hide();
                parent.className='directoryTreeRowWithIconCaptionAndArrowClosed';
            }
            else{
                parent.tree.show();
                parent.className='directoryTreeRowWithIconCaptionAndArrowOpened';
            }
            parent.expanded=!parent.expanded;
            
            
        };
        divRow.appendChild(divRow.tree);
            
        if(!divRow.expanded)
            divRow.tree.setAttribute('style',"display:none");
        icon.addEventListener('mousedown',icon.onclickAction.bind(icon));
		caption.addEventListener('mousedown',icon.onclickAction.bind(icon));
        return divRow;
   
   }
   panelTableView.directoryTreeView.className='tDirectoryTreeView'
   panelTableView.panelView=panelTableView.row[0].cell[1];
   panelTableView.panelView.className='tPanelView'
   panelTableView.appendChild(panelTableView.row[0]);
   panelTableView.row[0].appendChild(panelTableView.row[0].cell[0]);
   panelTableView.row[0].appendChild(panelTableView.row[0].cell[1]);
    return panelTableView;
}