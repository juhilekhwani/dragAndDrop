import { LightningElement, api, track, wire } from 'lwc';
import getModules from '@salesforce/apex/ModuleController.getModules';
import retriveModules from '@salesforce/apex/ModuleController.retriveModules';
import { CurrentPageReference } from 'lightning/navigation';
import { NavigationMixin } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';
import delSelectedModules from '@salesforce/apex/ModuleController.delSelectedModules';

// importing to show toast notifictions
import {ShowToastEvent} from 'lightning/platformShowToastEvent';



const actions= [
    { label : 'Show details', name: 'show_details'},
    { label: 'Delete', name: 'delete'}
];
export default class ShowModules extends  NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    @wire(CurrentPageReference) pageRef;


   
    @track columns = [{
        label: 'Module Name',
        fieldName: 'Module_Name__c',
        type: 'text',
        sortable: true,
        editable: true
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text',
        sortable: true,
        editable: true
    },
    {
        label: 'Module Description',
        fieldName: 'Module_Description__c',
        type: 'text',
        sortable: true, 
        editable: true
    },
    {label: 'Actions',
    type : 'action',
    typeAttributes: {rowActions: actions}}
    


];
createModule(event){
    this[NavigationMixin.Navigate]({
        type:'standard__objectPage',
        attributes:{
            objectApiName: 'Module__c',
            actionName: 'new'
        }
    })
}

    @wire(getModules) modules;
    @track searchedRecords;
    @track error;
   
    handleKeyChange( event ) {  
        const ProjectName = event.target.value;  
        if ( ProjectName ) {  
            retriveModules( { ProjectName } )    
            .then(result => {  
                this.searchedRecords = result;  
                console.log('I am here',this.searchedRecords);
               // console.log(JSON.stringify(result, null, '\t'));
                return refreshApex(this.searchedRecords);
            })  
            .catch(error => {  
                this.error = error;  
            });  
        } else  
        this.searchedRecords = undefined;  
    }
    rowHandler(event){
        let actionName = event.detail.action.name;
       // let row = event.detail.row;
        switch (actionName) {
            case 'show_details':
                fireEvent(this.pageRef, "passmoduleid", event.detail.row.Id)
                break;
           
             case 'delete':
                this.deleteCons(event.detail.row.Id);
                break;
        }
        console.log("in row handler method");
        console.log("object id-----"+event.detail.row.Id);
        
        
    }
    deleteCons(currentRow) {
     

        
        delSelectedModules({mId: currentRow})
        .then(result => {
            window.console.log('result ====> ' + result);
        

            // showing success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success!!',
                message: ' Module deleted.',
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
    refreshingApex(){
        return refreshApex(this.modules);
    }
    
}