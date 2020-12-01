import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class EmployeeLogout extends  NavigationMixin(LightningElement) {

    handlelogout(){
        console.log('in logout '+sessionStorage.getItem('empId'));
        sessionStorage.removeItem('empId');
        console.log('in logout '+sessionStorage.getItem('empId'));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: 'https://ideaportal-developer-edition.ap16.force.com/s/'
            }
        },
        true // Replaces the current page in your browser history with the URL
      );
    }
}