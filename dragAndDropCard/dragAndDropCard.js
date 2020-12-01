import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class DragAndDropCard extends NavigationMixin(LightningElement) {
    @api project;
    @api record;
    //employeeId = this.record.Id
    connectedCallback() {
         console.log("project "+JSON.stringify(this.project) +"records "+JSON.stringify(this.record));

    }
    get isSameProject() {
        console.log(this.project.Id)
        console.log(this.record.Project__c)
        console.log(this.project.Id === this.record.Project__c)
        console.log("employee id" + this.record.Id)
        if(this.project.Id === this.record.Project__c){
            console.log("true")
        }else
        console.log('false')
        return this.project.Id === this.record.Project__c;
    }
    navigateHandler(event) {
        event.preventDefault();
        console.log("in navigation")
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: event.target.dataset.id,
                objectApiName: 'Employee__c',
                actionName: 'view'
            }
        })
    }
    itemDragStart() {
        console.log("start " + this.record.Id);
        const event = new CustomEvent('itemdrag', {
            detail: this.record.Id
        })
        // event.dataTransfer.setData('itemdrag', this.record.Id);

        this.dispatchEvent(event);
    }
}