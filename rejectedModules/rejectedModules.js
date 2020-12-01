import { LightningElement , api, track, wire} from 'lwc';
import getRejectedModules from '@salesforce/apex/ModuleController.getRejectedModules';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation'; ///Navigation
const actions = [
    { label: 'View', name: 'show_details' },
];
export default class RejectedModules extends NavigationMixin(LightningElement) {
    RejectedM = false;
    checkboxHandler(event){
       
           this.RejectedM = event.target.checked;
           console.log("checkbox checked" +this.RejectedM)
           this.refreshingApex();
       }
       @track rejected = [
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
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
        }
    }
       
   ]
       @wire(getRejectedModules) rejectedModules;
       refreshingApex(){
           return refreshApex(this.rejectedModules);
       }
       navigateToRecordViewPage(event) {
        const row = event.detail.row;
        // View a custom object record.
        console.log("record id  "+row.Id)
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: row.Id,
                objectApiName: 'Module__c',
                actionName: 'view'
            }
        });
    }
}