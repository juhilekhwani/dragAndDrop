import { LightningElement , wire, track, api} from 'lwc';
import {registerListener, unregisterAllListeners} from 'c/pubsub';
//import searchEmployees from '@salesforce/apex/EmployeeController.searchEmployees';
import {CurrentPageReference} from 'lightning/navigation';

export default class EmployeeDetails extends LightningElement {


    // @track selectedEmployees = [];

    @wire (CurrentPageReference) pageRef;
    @track recordId;
    @api recordId;
    connectedCallback(){
        registerListener('pubsubevent',this.handleCallback,this);
    }
    handleCallback(detail){
        // console.log(detail);
        // searchEmployees(detail).then(response=>{
        //     console.log(response);
        // }).catch(error=>{
        //     console.error('Error');
        // });
        this.recordId = detail;

    }
    disconnectedCallback(){
        unregisterAllListeners(this);
    }
    // handlePopup() {
    //     this.template.querySelector("section").classList.remove("slds-hide");
    //     this.template
    //       .querySelector("div.modalBackdrops")
    //       .classList.remove("slds-hide");
    //   }
    
    //   handleSkip() {
    //     this.template.querySelector("section").classList.add("slds-hide");
    //     this.template
    //       .querySelector("div.modalBackdrops")
    //       .classList.add("slds-hide");
    //   }
    
}