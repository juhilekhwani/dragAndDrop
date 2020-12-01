import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from 'lightning/navigation';
import updateNewPassword from '@salesforce/apex/EmployeeController.updateNewPassword';
export default class NewEmpPassword extends NavigationMixin(LightningElement) {
   
    empPassword;
    empConfirmPassword;
    empId;

    handleNewPassword(event){
        this.empPassword = event.target.value;
    }
    handleConfirmPassword(event){
        this.empConfirmPassword = event.target.value;
    }
    checkNewPassword(){
        console.log(this.empId);
        if(this.empPassword != this.empConfirmPassword){
            const evt = new ShowToastEvent({
                title: 'Passwords do not match',
                message: '',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
 
        }
        else{
           this.empId= sessionStorage.getItem('employeeId');
           console.log('session'+this.empId);
         //  submitPassword({this.empId,this.Con})
         //toast noti
         //redirect login page
         updateNewPassword({'empId':this.empId,'empConfirmPassword':this.empConfirmPassword}).then((data)=>{
            console.log(this.empId);
            //this.empId = data;
            
           // this.empConfirmPassword = data;
            const evt = new ShowToastEvent({
                title: 'Password Reset Successful',
                message: '',
                variant: 'success',
                mode: 'dismissable'
            });
        this.dispatchEvent(evt);
        sessionStorage.removeItem('employeeId');
        this[NavigationMixin.Navigate]({
            'type': 'standard__webPage',
            'attributes':{
                'url':'https://ideaportal-developer-edition.ap16.force.com/s'
            }
        });
        }).catch((err)=>{
            console.log('err'+err.body.message);
        })

        }
    }
}