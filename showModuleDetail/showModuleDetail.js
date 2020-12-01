import { LightningElement, wire} from 'lwc';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
export default class ShowModuleDetail extends LightningElement {
    moduleId;
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener("passmoduleid", this.recordDetails, this);
        console.log("in connected call back")
    }
     
    disconnectedCallback() {
        unregisterAllListeners(this);
    }

    recordDetails(payload){
       console.log("in other component");
        this.moduleId = payload;
        console.log("in other component"+this.moduleId);
    }
}