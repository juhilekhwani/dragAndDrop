import { LightningElement , api, track, wire} from 'lwc';
import getRejectedModules from '@salesforce/apex/ModuleController.getRejectedModules';
import getPendingModules from '@salesforce/apex/ModuleController.getPendingModules';
import getApprovedModules from '@salesforce/apex/ModuleController.getApprovedModules';
import changeToApprove from '@salesforce/apex/ModuleController.changeToApprove';
import changeToReject from '@salesforce/apex/ModuleController.changeToReject';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
const actions=[
    { label: 'approve', name:'approve'},
    {label: 'reject', name: 'reject'}
]
export default class ShowModuleList extends LightningElement {
    @api recordId;
    @api objectApiName;
 @track rejected = [
        {
        label: 'Id',
        fieldName: 'Id',
        type: 'text',
        sortable: true
    },
    {
        label: 'ModuleName',
        fieldName: 'Module_name__c',
        type: 'text',
        sortable: true
    }
];
@track pending = [
    {
    label: 'Id',
    fieldName: 'Id',
    type: 'text',
    sortable: true
},
{
    label: 'ModuleName',
    fieldName: 'Module_name__c',
    type: 'text',
    sortable: true
},
{label: 'Actions',
        type : 'action',
        typeAttributes: {rowActions: actions}}
];
@track approved = [
    {
    label: 'Id',
    fieldName: 'Id',
    type: 'text',
    sortable: true
},
{
    label: 'ModuleName',
    fieldName: 'Module_name__c',
    type: 'text',
    sortable: true
}
];

    @wire(getRejectedModules) rejectedModules;
    @wire(getPendingModules) pendingModules;
    @wire(getApprovedModules) approvedModules;
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
             //this.showLoadingSpinner = false;
 
             // showing success message
             this.dispatchEvent(new ShowToastEvent({
                 title: 'Success!!',
                 message: ' Module approved.',
                 variant: 'success'
             }),);
             return refreshApex(this.pendingModules.data);
 
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



}