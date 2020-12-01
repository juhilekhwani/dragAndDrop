import { LightningElement, api } from 'lwc';

export default class DragAndDropList extends LightningElement {
    @api records;
    @api project;
    recordId
    connectedCallback(){
        //console.log("in list component");
        //console.log("project "+JSON.stringify(this.project) +"records "+JSON.stringify(this.records));
        
    }
    handleItemDrag(evt){
       
        const event = new CustomEvent( 'listitemdrag', {
            detail: evt.detail
        })
        console.log("in list"+ evt.detail)
        this.dispatchEvent(event);
        // this.recordId = evt.dataTransfer.getData('itemdrag');
    }
    handleDrop(evt){
        console.log("in drop"+JSON.stringify(this.project))
        const event = new CustomEvent( 'itemdrop', {
            detail: this.project.Id
        })
        this.dispatchEvent(event);
        
        // this.recordId = evt.dataTransfer.getData('itemdrag');
        // console.log("record "+this.recordId);

    }
    handleDragOver(evt){
        evt.preventDefault()
    }
    }
    
