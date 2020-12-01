import { LightningElement ,track,wire} from 'lwc';
import getTasks from '@salesforce/apex/Project_Idea_Lightning.getTasks';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const taskActions = [

    { label: 'View Task Details', name: 'View Task Details' },

]
export default class MyTasks extends NavigationMixin(LightningElement) {
empId;
@track allTasks;

    @wire(getTasks, { employeeId: '$empId' }) tasks(result) {
        console.log('employee id '+this.empId)
    console.log('result task'+ JSON.stringify(result));
        let completedTaskArray = [];
        this.refreshTable = result;
        if (result.data) {
            let newData;
            newData = result.data;
            console.log("task data----" + JSON.stringify(newData))
            newData.forEach(element => {
                let newObject = {}
                newObject.Id = element.Id;
                newObject.Name = element.Name;
                newObject.Status__c = element.Status__c
                newObject.Priority__c = element.Priority__c
                newObject.Start_Date__c = element.Start_Date__c
                newObject.End_Date__c = element.End_Date__c
                newObject.Progress__c = element.Progress__c
                newObject.Project = element.Project__r.Name;
                console.log("project---" + newObject.Project)
                completedTaskArray.push(newObject);

            });
            this.allTasks = completedTaskArray;
            console.log("all tasks " + JSON.stringify(this.allTasks))
        }
    };


    columntask = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'text'


    },
    {
        label: 'Start Date',
        fieldName: 'Start_Date__c',
        type: 'date'

    },
    {
        label: 'End Date',
        fieldName: 'End_Date__c',
        type: 'Date'

    },
    {
        label: 'Priority',
        fieldName: 'Priority__c',
        type: 'text'

    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text',
        wrapText: true

    },
    {
        label: 'Progress',
        fieldName: 'Progress__c',
        type: 'text',
        editable: true

    },
    {
        label: 'Project',
        fieldName: 'Project',
        type: 'text',
        wrapText: true
    }
    

    ];
    connectedCallback(){

        this.empId = sessionStorage.getItem('empId');
        console.log('emp id in connected call back'+this.empId)
        if (this.empId == null) {
            console.log('empid is null');
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://ideaportal-developer-edition.ap16.force.com/s/employeelogin'
                }
            },
                true // Replaces the current page in your browser history with the URL
            );
        }
       // refreshApex(this.scores);

       
    }

    
    taskRowHandler(event){
        let actionName = event.detail.action.name;
        switch (actionName) {
    
    
            case 'View Task Details':
                this.navigateToRecordPage(event);
                break;
    
        }
    }
    navigateToRecordPage(event){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.row.Id,
                objectApiName: 'Task__c',
                actionName: 'view'
            },
        });
    }
}