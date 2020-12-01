import { LightningElement, wire, track,api } from 'lwc';
import getProject from '@salesforce/apex/ProjectController.getProject';
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees';
import ID_FIELD from '@salesforce/schema/Employee__c.Id';
import EMPLOYEE_PROJECT_FIELD from '@salesforce/schema/Employee__c.Project__c';
import { refreshApex } from '@salesforce/apex'
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
//import updateEmployee from '@salesforce/apex/EmployeeController.updateEmployee';
export default class DragAndDropLwc extends LightningElement {
   @track records
    @track propertyValue;
   @track bShowModal = false;
   @track flag = false;
    recordId
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener("passprojectid", this.recordDetails, this);
        console.log("in connected call back")
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    recordDetails(payload){
        console.log("in other component");
         this.propertyValue = payload;
         this.flag = true;
         console.log("in other component"+this.propertyValue);
     }
    @wire (getAllEmployees) wiredEmployees({error, data}){
        if(data){
           // console.log(data);
            this.records = data
           console.log(JSON.stringify(this.records))
        }
        if(error){
            console.error(error);
        }
    };  
    @wire(getProject, {projectId:'$propertyValue'}) projects;
   
    openModal() {
       this.bShowModal = true;
     }
 
    closeModal() {
        this.bShowModal = false;
    }
    handleSubmit(){
        console.log("in submit handler")
        this.closeModal();
    }
   get calcWidth(){
       let len = this.projects.length;
       return 'width: calc(100vw/2)'
   }

   handleListItemDrag(event){
       console.log("in parent before"+event.detail)
       this.recordId = event.detail;
       console.log("in parent"+this.recordId);
   }
   handleItemDrop(event){
    console.log("in parent haNDLE drop "+JSON.stringify(event.detail));
    let project = event.detail;
    this.records = this.records.map(item=>{
        return item.Id === this.recordId ? {...item, Project__c : project}:{...item}
    })
    refreshApex(this.projects);
   this.updateHandler(project);
   }
   updateHandler(project){
       this.openModal();
       console.log("in update handler"+JSON.stringify(project))
       const fields = {}
       fields[ID_FIELD.fieldApiName] = this.recordId 
       fields[EMPLOYEE_PROJECT_FIELD.fieldApiName] = project;    
       const recordInput = {fields};
       console.log(recordInput);
       console.log('in update handler'+this.recordId)
        updateRecord(recordInput).then(()=>{
       
       
        console.log("updated successfully")
        refreshApex(this.projects);
    
    }).catch(error=>{
        console.error(error);
    })
}
//     updateEmployee({EmpId : this.recordId, projId : this.project}).then(()=>{
//         console.log("updated successfully")
       
//     }).catch(error=>{
//         console.error(error);
//     })
    
//    }
   handleSave(){
    window.location.reload();
   }
   checkSubmit(){
   }
}  