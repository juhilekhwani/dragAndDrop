import { LightningElement, api, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
export default class ModuleIcon extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    approveHandler(event){
        fireEvent(this.pageRef, "approvedModules");
    }
}