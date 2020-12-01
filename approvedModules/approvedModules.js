import { LightningElement , api, track, wire} from 'lwc';
import getApprovedModules from '@salesforce/apex/ModuleController.getApprovedModules';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation'; ///Navigation

const actions = [
    { label: 'View', name: 'show_details' },
];
export default class ApprovedModules extends NavigationMixin(LightningElement) {
    ApprovedM = false;
    
 checkboxHandler(event){
    
        this.ApprovedM = event.target.checked;
        console.log("checkbox checked" +this.ApprovedM)
        this.refreshingApex();
    }
    @track approved = [
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
    @wire(getApprovedModules) approvedModules;
    refreshingApex(){
        return refreshApex(this.approvedModules);
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
   

