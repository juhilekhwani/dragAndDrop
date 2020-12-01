import { LightningElement ,api} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import Name from '@salesforce/schema/Employee__c.Name';
import Employee_ID__c from '@salesforce/schema/Employee__c.Employee_ID__c';
import Location__c from '@salesforce/schema/Employee__c.Location__c';
import Email__c from '@salesforce/schema/Employee__c.Email__c';
import Profile_Picture__c from '@salesforce/schema/Employee__c.Profile_Picture__c';
import Password__c from '@salesforce/schema/Employee__c.Password__c';
import Team__c from '@salesforce/schema/Employee__c.Team__c';

export default class HomeEmployeeLogin  extends  NavigationMixin(LightningElement){
    @api recordId;
    flag=false;
    openmodel=false;

    fields = [Name,Employee_ID__c,Location__c,Email__c,Password__c,Profile_Picture__c,	Team__c];

    connectedCallback(){
        if(sessionStorage.getItem('empId')==null){
            this.flag=true;

        }
    }
    showlogin(){

    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: 'https://ideaportal-developer-edition.ap16.force.com/s/employeelogin'
        }
    },
    true // Replaces the current page in your browser history with the URL
  );
    }


    onsubmit(){
        
    }
    adminLogin(){

        
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/login'
            }
        },
        true // Replaces the current page in your browser history with the URL
      );
        }

    
    showPortal(){

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/portal'
            }
        },
        true // Replaces the current page in your browser history with the URL
      );
        }

        signup(){

            this.openmodel=true;
        }

        onsuccess(){
            this.openmodel=false;

        }

}