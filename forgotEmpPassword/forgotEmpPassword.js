import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import verifyEmployee from '@salesforce/apex/EmployeeController.verifyEmployee';
import sendOtp from '@salesforce/apex/EmployeeController.sendOtp';
import updateNewPassword from '@salesforce/apex/EmployeeController.updateNewPassword';

export default class ForgotEmpPassword extends NavigationMixin(LightningElement) {


    empId;
    checkemployee = true;
    newpassword = false;
    checkotp = false;
    empPassword;
    empConfirmPassword;
    empotp;
    realotp;

    handleEmployeeId(event) {
        this.empId = event.target.value;
    }
    handleOtp(event) {
        this.empotp = event.target.value;
    }
    handleNewPassword(event) {
        this.empPassword = event.target.value;
    }
    handleConfirmPassword(event) {
        this.empConfirmPassword = event.target.value;
    }

    checkEmployeeId() {
        let emp = { 'sobjectType': 'Employee__c' };
        emp.Employee_ID__c = this.empId;
        console.log(this.empId);
        verifyEmployee({ verifyemp: emp }).then((response) => {
            console.log(JSON.stringify(response));
            if (response == null) {
                throw new Error('Please enter correct employee id');
                this.checkemployee = false;
                this.checkotp = true;
                this.newpassword = false;
            } 
                sendOtp({employee:emp}).then((res)=>{
                    this.realotp = res;
                    const evt = new ShowToastEvent({
                        title: 'Password Reset OTP sent to your email address',
                        message: '',
                        variant: 'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);
                }).catch((err)=>{
                    console.log(err.body.message);
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: 'Unable to send OTP',
                        variant: 'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);
                })

            
            this.checkemployee = false;
            this.checkotp = true;
            this.newpassword = false;
         
        }).catch((err) => {

            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Please enter correct employee id',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        });
    }

    checkEmailOtp(){
        if(this.realotp == this.empotp){
            const evt = new ShowToastEvent({
                title: 'OTP Matched',
                message: '',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            this.checkemployee = false;
            this.checkotp = false;
            this.newpassword = true;
        } else{
            const evt = new ShowToastEvent({
                title: 'Invalid OTP',
                message: '',
                variant: 'error',
                mode: 'dismissable'
                
            });
            this.dispatchEvent(evt);
            this.checkemployee = false;
            this.checkotp = true;
            this.newpassword = false;
        }
    }

    checkNewPassword() {
        console.log(this.empId);
        if (this.empPassword != this.empConfirmPassword) {
            this.checkemployee = false;
            this.checkotp = false;
            this.newpassword = true;
            const evt = new ShowToastEvent({
                title: 'Passwords do not match',
                message: '',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }
        else {
            console.log('in else part')
            this.checkemployee = false;
            this.checkotp = false;
            this.newpassword = false;
            this.empId = sessionStorage.getItem('empId');
            console.log(this.empId);
            updateNewPassword({ 'emp':this.empId, 'empConfirmPassword': this.empConfirmPassword }).then((data) => {
                console.log('In update pasword:' + emp);
                this.empId = data;
                this.empConfirmPassword = data;
                const evt = new ShowToastEvent({
                    title: 'Password Reset Successful',
                    message: '',
                    variant: 'success',
                    mode: 'dismissable'
                });
                this.dispatchEvent(evt);

                this[NavigationMixin.Navigate]({
                    'type': 'standard__webPage',
                    'attributes': {
                        'url': 'https://ideaportal-developer-edition.ap16.force.com/s'
                    }
                })
            }).catch((err) => {
                console.log('err' + err.body.message);
            });

        }
    }
}