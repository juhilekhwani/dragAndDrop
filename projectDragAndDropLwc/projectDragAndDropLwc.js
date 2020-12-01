import { LightningElement, api, wire } from 'lwc';
import getProject from '@salesforce/apex/ProjectController.getProject';
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees';
export default class ProjectDragAndDropLwc extends LightningElement {
    @api propertyValue;
    @wire(getProject, {projectId:'$propertyValue'}) project;
    connectedCallback(){
        console.log("in lwc target")
        console.log("project id: "+JSON.stringify(this.propertyValue))
        
    }
    @wire (getAllEmployees) wiredEmployees({error, data}){
        if(data){
            console.log(data);
            this.records = data
        }
        if(error){
            console.error(error);
        }
    };
    get calcWidth(){
        let len = this.project.length;
        return 'width: calc(100vw/6)'
    }
}