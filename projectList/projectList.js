/*
projectList component is used to show the list of all the projects and call the row action events 
*/
import { LightningElement, track, wire } from 'lwc';
//importing to get the project list from the org
import getProjects from '@salesforce/apex/ProjectController.getProjects';
//importing to navigate to record detail page
import { NavigationMixin } from 'lightning/navigation';
//importing to fire an event 
import { fireEvent } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

//row actions
const actions=[
    { label: 'assign resource', name:'assign resource'},
    { label: 'View Project Details', name:'View Project Details'},
    
]
const columns = [
//     {
//     label: 'Id',
//     fieldName: 'Id',
//     type: 'text',
//     sortable: true
// },
{
    label: 'Project Name',
    fieldName: 'Name',
    type: 'text',
    sortable: true
},
{
    label: 'Status',
    fieldName: 'Status__c',
    type: 'text',
    sortable: true
},
{
    label: 'Priority',
    fieldName: 'Priority__c',
    type: 'text',
    sortable: true
},
{
    label: 'KickOff Date',
    fieldName: 'KickOff_Date__c',
    type: 'text',
    sortable: true
},
{
    label: 'End Date',
    fieldName: 'End_Date__c',
    type: 'text',
    sortable: true
}, 
{label: 'More',
        type : 'action',
        typeAttributes: {rowActions: actions}}

]

export default class ProjectList extends NavigationMixin(LightningElement) {
    @wire(CurrentPageReference) pageRef;
    @track columns = columns

    projectId
    //wire service to get projects list from the org
@wire( getProjects) 
projects;
renderedCallback(){
    console.log(JSON.stringify(this.projects));
}

//function called on row action
rowHandler(event){
    let actionName = event.detail.action.name;
   
    switch (actionName) {
        case 'assign resource':
            //fires an event and passes the project id 
            fireEvent(this.pageRef, "passprojectid", event.detail.row.Id)
            break;
       //nssvigates to project detail page
        case 'View Project Details':
            this.navigateToRecordPage(event);
            break;

            case 'Delete':
                this.deleteCons(event.detail.row.Id);
    }
    console.log("in row handler method");
    console.log("object id-----"+event.detail.row.Id);
    
    
}
navigateToRecordPage(event){
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId:  event.detail.row.Id,
            objectApiName: 'Project__c',
            actionName: 'view'
        },
    });
}

}