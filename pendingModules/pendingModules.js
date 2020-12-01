import { LightningElement , api, track, wire} from 'lwc';
import getPendingModules from '@salesforce/apex/ModuleController.getPendingModules';
import changeToApprove from '@salesforce/apex/ModuleController.changeToApprove';
import changeToReject from '@salesforce/apex/ModuleController.changeToReject';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation'; ///Navigation
const actions=[
    { label: 'approve', name:'approve'},
    {label: 'reject', name: 'reject'},
    { label: 'View', name: 'show_details' }
]
export default class PendingModules extends NavigationMixin(LightningElement) {
 PendingM = false;
 checkboxHandler(event){
    
        this.PendingM = event.target.checked;
        console.log("checkbox checked" +this.PendingM) 
    }
    @track pending = [
        {
            label: 'Module Number',
            fieldName: 'Name',
            type: 'text',
            sortable: true
        },
        {
            label: 'ModuleName',
            fieldName: 'Module_Name__c',
            type: 'text',
            sortable: true
        },
        {
         label: 'Project',
         fieldName: 'Project__c',
         type: 'text',
         sortable: true
     },
    {label: 'Actions',
        type : 'action',
        typeAttributes: {rowActions: actions}}
]
    @wire(getPendingModules) pendingModules;
    refreshingApex(){
        console.log("calling refresh apex method" +refreshApex(this.pendingModules));
        return refreshApex(this.pendingModules);
        
    }
    rowHandler(event){
        let actionName = event.detail.action.name;
       // let row = event.detail.row;
        switch (actionName) {
            case 'approve':
                this.changeToApprove(event.detail.row.Id)
                break;
           
            case 'reject':
                this.changeToReject(event.detail.row.Id);
                break;
                case 'show_details':
                    this.NavigateToRecordPage(event.detail.row.Id);
        }
        console.log("in row handler method");
        console.log("object id-----"+event.detail.row.Id);
        
        
    }
    changeToApprove(currentRow) {
        // let currentRecord = [];
        // currentRecord.push(currentRow.Id);
        // this.showLoadingSpinner = true;
 
         
        changeToApprove({rowId: currentRow})
         .then(result => {
             window.console.log('result ====> ' + result);
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Success!!',
                 message: ' Module approved.',
                 variant: 'success'
             }),);
             this.refreshingApex();
             
         })
         .catch(error => {
             window.console.log('Error ====> '+error);
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Error!!', 
                 message: error.message, 
                 variant: 'error'
             }),);
         });
     }
     changeToReject(currentRow) {
        // let currentRecord = [];
        // currentRecord.push(currentRow.Id);
        // this.showLoadingSpinner = true;
 
         
        changeToReject({rowId: currentRow})
         .then(result => {
             window.console.log('result ====> ' + result);
             //this.showLoadingSpinner = false;
 
             // showing success message
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Success!!',
                 message: ' Module reject.',
                 variant: 'success'
             }),);
 
             this.refreshingApex(this.pendingModules.data);
 
              
 
         })
         .catch(error => {
             window.console.log('Error ====> '+error);
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Error!!', 
                 message: error.message, 
                 variant: 'error'
             }),);
         });
     }
     NavigateToRecordPage(currentRow){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: currentRow,
                objectApiName: 'Module__c',
                actionName: 'view'
            }
        });
     }
    

}