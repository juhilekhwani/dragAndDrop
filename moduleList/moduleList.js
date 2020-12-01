import { LightningElement, track, wire } from 'lwc';
import getPendingModules from '@salesforce/apex/ModuleController.getPendingModules';
const actions=[
    { label: 'approve', name:'approve'},
    {label: 'reject', name: 'reject'}
]
const pending = [
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
]

export default class ModuleList extends LightningElement {
@track pendingColumns = pending
@wire( getPendingModules) 
pendingModules;


}