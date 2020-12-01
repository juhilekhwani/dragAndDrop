/**
 * employeePrfile component is used to get the employees data and display it in the tiled format
 */

import { LightningElement, wire, track} from 'lwc';
import imageResource from '@salesforce/resourceUrl/profileImages';
import {CurrentPageReference} from 'lightning/navigation';
import {fireEvent} from 'c/pubsub';
import filterEmployee from '@salesforce/apex/EmployeeController.filterEmployee';
import getEmployees from '@salesforce/apex/EmployeeController.getEmployees';
import { refreshApex } from '@salesforce/apex';

export default class EmployeeProfile extends LightningElement
{
	@wire (CurrentPageReference) pageRef;
	get currentPageRef() {
		return this.pageRef ? JSON.stringify(this.pageRef, null, 2) : '';
	  }
	searchTerm = '';
	//@wire(searchEmployees, {searchTerm: '$searchTerm'})
	employees;	
	@track emps = [];
	@wire(getEmployees)
	wiredOpps(result) {
        const { data, error } = result;
        if(data) {
			console.log('employee data '+ data);
            this.emps = data;
            this.error = null;
        }
        if(error) {
            this.error = error;
            this.emps = [];
        }
	} 
	@track employeesCount=0;
	//allEmployees = this.emps.data;

	@track locationOptions = [
        { label: 'All', value: 'All' },
        { label: 'Indore', value: 'Indore' },
		{ label: 'Pune', value: 'Pune' },
		{ label: 'Hyderabad', value: 'Hyderabad' },
		{ label: 'Kolkata', value: 'Kolkata' },
		{ label: 'Mumbai' ,  value: 'Mumbai' }
       
    ];  
	  @track selectedLocationValue = '';
	  
	  @track employeeProjectOptions = [
        { label: 'All', value: 'All' },
        { label: 'On Bench', value: 'Bench' },
       
    ];  
	  @track selectedProjectValue = '';
	  
	  @track employeeTechnologyOptions = [
        { label: 'All', value: 'All' },
		{ label: 'Salesforce', value: 'Salesforce' },
		{ label: 'Java', value: 'Java' },
		{ label: 'SAP', value: 'SAP' },
		{ label: 'BigData', value: 'Big Data' },
		{ label: 'Azure', value: 'Azure' },
    ];  
	  @track selectedTechnologyValue = '';
	  
	  refreshData(){
		  return refreshApex(this.emps);
	  }

	  /**
	   * handleFilterChange method takes one parameter and returns the list of employees based on the selected filter
	   * @param {*} event 
	   */
	  handleFilterChange(event) {
		const filterName = event.target.name;
        if (filterName === 'Location Filter') {
			this.selectedLocationValue = event.target.value;	
        } else if (filterName === 'Project Filter') {
			this.selectedProjectValue = event.target.value;
		}else if(filterName === 'Technology Filter'){
			this.selectedTechnologyValue = event.target.value;
		} filterEmployee({selectedLocationValue:this.selectedLocationValue,selectedProjectValue:this.selectedProjectValue,selectedTechnologyValue:this.selectedTechnologyValue}).then(data=>{
			this.emps=data;
            console.log('data'+ JSON.stringify(this.emps));
            this.employeesCount=data.length;
            console.log('ideas length'+data.length);
		}).catch(error=>{
			console.error(error);
		});
		}

	/*profileImage = imageResource;
	handleSearchTermChange(event) {
		window.clearTimeout(this.delayTimeout);
		const searchTerm = event.target.value;
		// eslint-disable-next-line @lwc/lwc/no-async-operation
		this.delayTimeout = setTimeout(() => {
			this.searchTerm = searchTerm;
		}, 300);
	}*/
	handleEmployeeDetails(event){
		fireEvent(this.pageRef,'pubsubevent',event.target.value);
 
	}
	get hasResults(){
		return (this.employees.data.length > 0);
	}
	

handleName(event)
{
  this.Name=event.target.value;
}
}