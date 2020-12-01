import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name_FIELD from '@salesforce/schema/Idea__c.Name';
import Technology__c_FIELD from '@salesforce/schema/Idea__c.Technology__c';
import Description__c_FIELD from '@salesforce/schema/Idea__c.Description__c';
import empId__c_FIELD from '@salesforce/schema/Idea__c.empId__c';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import SaveFile from '@salesforce/apex/Project_Idea_Lightning.SaveFile';
import checkIdeaCount from '@salesforce/apex/Project_Idea_Lightning.checkIdeaCount';


export default class EmpCreateIdea extends NavigationMixin(LightningElement){
    fields = [Name_FIELD, Description__c_FIELD, Technology__c_FIELD];
    MAX_FILE_SIZE = 100000;//100KB
    filesUploaded = [];
    file;
    createflag = false;
    flag = false;
    fileflag = false;
    uploadbutton = false;
    fileReader;
    fileContents;
    content;
    empId;

    connectedCallback(){

        this.empId = sessionStorage.getItem('empId');
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

        checkIdeaCount({'empId':sessionStorage.getItem('empId')}).then(data=>{
            this.flag = true;
    
       // fireEvent(this.pageRef, 'hidereview', this.recordId);
    
        }).catch(err=>{
    
            const evt = new ShowToastEvent({
                title: "Employee can create 2 ideas a day",
        
                variant: "error"
            });
            this.dispatchEvent(evt);
    
        })
        
     
        

    }

    handlesubmitIdea(event) {
        let fields = event.detail.fields;
        console.log('Onsubmit empId' + this.empId);
        fields.empId__c = sessionStorage.getItem('empId');
        console.log('fields value ' + fields);
        console.log('fields value in string    ' + JSON.stringify(fields));
        this.template.querySelector('lightning-record-form').submit(fields);
    }

    
handleSuccess(event) {

    console.log('in handle success of create idea');

    this.flag = false;
    this.uploadbutton = true;
    this.recordId = event.detail.id;
    this.createflag = false;
    const evt = new ShowToastEvent({
        title: "Idea has been submitted succesfully",

        variant: "success"
    });
    this.dispatchEvent(evt);
   
    console.log('idea id' + this.recordId + '   empid' + this.empId);
}

cancel(){
    this.uploadbutton = false;
    this.optionflag = true;
    this.fileflag = false;
}

uploadDocument(){
    this.fileflag = true;
}

handleUploadFinished(event) {
    this.fileflag = false;
    this.uploadbutton = false;
    this.optionflag = true;
    // Get the list of uploaded files
    const uploadedFiles = event.detail.files;
    let uploadedFileNames = '';
    for (let i = 0; i < uploadedFiles.length; i++) {
        uploadedFileNames += uploadedFiles[i].name + ', ';
    }
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success',
            message: uploadedFiles.length + ' Files uploaded Successfully: ' + uploadedFileNames,
            variant: 'success',
        }),
    );
}

uploadFile(){
    this.fileReader = new FileReader();
            // set onload function of FileReader object  
            this.fileReader.onloadend = (() => {
                this.fileContents = this.fileReader.result;
                let base64 = 'base64,';
                this.content = this.fileContents.indexOf(base64) + base64.length;
                this.fileContents = this.fileContents.substring(this.content);
            });

            SaveFile({ parentId: this.recordId, fileName: this.file.name, base64Data: encodeURIComponent(this.fileContents) }).then(res => {


                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!!',
                        message: this.file.name + ' - Uploaded Successfully!!!',
                        variant: 'success',
                    }),
                );

                this.fileflag = false;
                this.uploadbutton = false;
                this.optionflag = true;
            }).catch((error) => {

                window.console.log(error);
                console.log('error'+error.body.message);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error while uploading File',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );

            })
            this.fileReader.readAsDataURL(this.file);
}


handleFilesChange(event) {
    this.filesUploaded = event.target.files;
    this.file = this.filesUploaded[0];
    console.log('file upload' + this.file.size);
    console.log('typeeeee' + this.file.type);
    if (this.file.size > this.MAX_FILE_SIZE) {
        console.log('Please upload the file with size less than 100KB');

        const evt = new ShowToastEvent({
            title: "Please upload the file with size less than 100KB",

            variant: "error"
        });
        this.dispatchEvent(evt);
    }
    //image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint
    //text/plain
    //vnd.openxmlformats-officedocument.spreadsheetml.sheet


    else {
        console.log('file size ok');

        if(this.file.type=="text/plain"){//text
        this.uploadFile();
        }else if(this.file.type=="application/pdf"){//PDF
            this.uploadFile();
        }else if(this.file.type=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
            this.uploadFile();
        }else if(this.file.type=="application/vnd.ms-powerpoint"){
            this.uploadFile();
        }else if(this.file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            this.uploadFile();
            
        }else{
            const evt = new ShowToastEvent({
                title: "File Formats supported are TXT,PDF,EXL,PPT,DOC",

                variant: "error"
            });
            this.dispatchEvent(evt);
        }
    }
}

}