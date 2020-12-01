import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name_FIELD from '@salesforce/schema/Idea__c.Name';
import Technology__c_FIELD from '@salesforce/schema/Idea__c.Technology__c';
import Description__c_FIELD from '@salesforce/schema/Idea__c.Description__c';
import empId__c_FIELD from '@salesforce/schema/Idea__c.empId__c';
import getProjectIdeas from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeas';
import Status_c_FIELD from '@salesforce/schema/Idea__c.Status__c';
import { CurrentPageReference } from 'lightning/navigation';
import searchIdeaByName from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByName';
import { refreshApex } from '@salesforce/apex';
import getRejectedIdeas from '@salesforce/apex/Project_Idea_Lightning.getRejectedIdeas';
import getTasks from '@salesforce/apex/Project_Idea_Lightning.getTasks';
import getApprovedIdeas from '@salesforce/apex/Project_Idea_Lightning.getApprovedIdeas';
import getScoreBoard from '@salesforce/apex/Project_Idea_Lightning.getScoreBoard';
import searchIdeaByNameRejected from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByNameRejected';
import searchIdeaByNameApproved from '@salesforce/apex/Project_Idea_Lightning.searchIdeaByNameApproved';
import SaveFile from '@salesforce/apex/Project_Idea_Lightning.SaveFile';
import { NavigationMixin } from 'lightning/navigation';
import updateIdeas from '@salesforce/apex/Project_Idea_Lightning.updateIdeas';
import unlockRecord from '@salesforce/apex/Project_Idea_Lightning.unlockRecord';
import archiveIdea from '@salesforce/apex/Project_Idea_Lightning.archiveIdea';
import filterPendingIdeas from '@salesforce/apex/Project_Idea_Lightning.filterPendingIdeas';
import filterRejectedIdeas from '@salesforce/apex/Project_Idea_Lightning.filterRejectedIdeas';
import filterApprovedIdeas from '@salesforce/apex/Project_Idea_Lightning.filterApprovedIdeas';
import checkIdeaCount from '@salesforce/apex/Project_Idea_Lightning.checkIdeaCount';









import {
    registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent
} from 'c/pubsub';

const actions = [
    { label: 'Rate Idea', name: 'show_details' },
    { label: 'Feedback', name: 'Comments' },
    { label: 'Details', name: 'edit' },
    { label: 'Archive', name: 'Archive' }

];

const taskActions = [

    { label: 'View Task Details', name: 'View Task Details' },

]
export default class IdeaGuest extends NavigationMixin(LightningElement) {
    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track data = []; //data to be displayed in the table
    @track columns; //holds column info.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 10; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records
    @track monthOptions = [
        { label: 'All', value: '0' },
        { label: 'Jan', value: '1' },
        { label: 'Feb', value: '2' },
        { label: 'Mar', value: '3' },
        { label: 'Apr', value: '4' },
        { label: 'May', value: '5' },
        { label: 'Jun', value: '6' },
        { label: 'Jul', value: '7' },
        { label: 'Aug', value: '8' },
        { label: 'Sept', value: '9' },
        { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' },
        { label: 'Dec', value: '12' },
    ];
    @track yearOptions = [
        { label: 'All', value: '0' },
        { label: '2019', value: '2019' },
        { label: '2020', value: '2020' },
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' }
       
    ];
    @track technologyOptions = [
        { label: 'All', value: '0' },
        { label: 'Java', value: 'Java' },
        { label: 'Salesforce', value: 'Salesforce' },
        { label: 'BigData', value: 'BigData' },
        { label: 'Azure', value: 'Azure' },
        { label: 'Other', value: 'Other' }
       
    ];
    @track selectedTechnologyValue='';
    @track selectedMonthValue = 0;
    @track selectedYearValue=0;
    ideaname = '';
    ideaDescription = '';
    notaskmsg = '';
    password = '';
    @api editrecordId;
    @track openmodel = false;
    
    
    Searchkey = '';
    rejectedflag = false;
    approvedflag = false;
    scoreflag = false;
    taskflag = false;
    @wire(CurrentPageReference) pageRef;
    @wire(getProjectIdeas) ideas;
    @track pendingIdeaCount=0;
    
    /*({ error, data }) {
        if (data) {
            //if you want to perform data transformation then following code will be used,
            //so that individual values to be assigned into each columns
           
            this.items = data;
            this.totalRecountCount = data.length; //here it is 23
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5

            //initial data to be displayed ----------->
            //slice will take 0th element and ends with 5, but it doesn't include 5th element
            //so 0 to 4th rows will be displayed in the table
            this.data = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }


    /**/
    @wire(getRejectedIdeas) rejectedIdeas;
    @wire(getApprovedIdeas) approvedIdeas;
    //@wire(getTasks,{employeeId:'$empId'})tasks;
    @wire(getScoreBoard) scores;
    filesUploaded = [];
    file;
    createflag = false;
    flag = false;
    fileflag = false;
    uploadbutton = false;
    fileReader;
    fileContents;
    content;
    @track allTasks;
    @wire(getTasks, { employeeId: '$empId' }) tasks(result) {
        if (result == null) {
            this.notaskmsg = 'No task is assigned to you';
        }
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





    fields = [Name_FIELD, Description__c_FIELD, Technology__c_FIELD];
    recordId;
    empId = '';
    optionflag = true;
    showideaflag = false;

    checkId = false;
    Name = '';
    @wire(CurrentPageReference) pageRef;
    MAX_FILE_SIZE = 100000;//100KB


    scorecolumn = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'text'


    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'

    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'

    }
    ];

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
        type: 'text'

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
        type: 'text'
    },
    {
        label: '',
        type: 'action',
        typeAttributes: { rowActions: taskActions }
    }

    ];
    ApprovedIdeacolumn = [

        {
            label: 'Project Idea Name',
            fieldName: 'Name',
            type: 'text',
            wrapText: true


        },
        {
            label: 'Submitted By',
            fieldName: 'Submitter_Name__c',
            type: 'text'

        },
        {
            label: 'Technology',
            fieldName: 'Technology__c',
            type: 'text'

        },
        {
            label: 'Score',
            fieldName: 'Score__c',
            type: 'text'

        },

        {
            label: 'Status',
            fieldName: 'Status__c',
            type: 'text'

        }, {

            label: 'Date',
            fieldName: 'LastModifiedDate',
            type: 'date'
            
        },{

            label: 'Project Details',
            fieldName: 'Project_Details__c',
            type: 'text',
            wrapText: true

        }

    ];

    RejectIdeacolumns = [{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text'


    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'

    },
    {
        label: 'Technology',
        fieldName: 'Technology__c',
        type: 'text'

    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'

    },

    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'

    }, {

        label: 'Date',
        fieldName: 'LastModifiedDate',
        type: 'date'
        
    },{

        label: 'Reason',
        fieldName: 'Reason__c',
        type: 'text',
        wrapText: true

    }

    ];



    columns = [{
        label: 'Project Idea Name',
        fieldName: 'Name',
        type: 'text'


    },
    {
        label: 'Submitted By',
        fieldName: 'Submitter_Name__c',
        type: 'text'

    },
    {
        label: 'Technology',
        fieldName: 'Technology__c',
        type: 'text'

    },
    {
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'

    },

    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text'

    },

    {
        label: 'Employee Id',
        fieldName: 'empId__c',
        type: 'text'

    }, {

        label: 'Created Date',
        fieldName: 'CreatedDate',
        type: 'date'


    },
    {
        label: '',
        type: 'action',
        typeAttributes: { rowActions: actions }
    }


    ];

    handleFilterChangeApproved(event){

        const filterName = event.target.name;
        if (filterName === 'Month Filter') {
			this.selectedMonthValue = event.target.value;
        } else if (filterName === 'Year Filter') {
			this.selectedYearValue = event.target.value;
		}else if(filterName === 'Technology Filter'){
			this.selectedTechnologyValue = event.target.value;
		}  filterApprovedIdeas({selectedMonthValue:this.selectedMonthValue,selectedYearValue:this.selectedYearValue,selectedTechnologyValue:this.selectedTechnologyValue}).then(data=>{
            this.approvedIdeas.data=data;
          
            console.log('ideas length'+data.length);
        }).catch(error=> {
            console.log(error);
        })

    }
    handleFilterChangeRejected(event){
        const filterName = event.target.name;
        if (filterName === 'Month Filter') {
			this.selectedMonthValue = event.target.value;
        } else if (filterName === 'Year Filter') {
			this.selectedYearValue = event.target.value;
		}else if(filterName === 'Technology Filter'){
			this.selectedTechnologyValue = event.target.value;
		}  filterRejectedIdeas({selectedMonthValue:this.selectedMonthValue,selectedYearValue:this.selectedYearValue,selectedTechnologyValue:this.selectedTechnologyValue}).then(data=>{
            this.rejectedIdeas.data=data;
          
            console.log('ideas length'+data.length);
        }).catch(error=> {
            console.log(error);
        })
    }

    handleFilterChange(event) {

		const filterName = event.target.name;
        if (filterName === 'Month Filter') {
			this.selectedMonthValue = event.target.value;
        } else if (filterName === 'Year Filter') {
			this.selectedYearValue = event.target.value;
		}else if(filterName === 'Technology Filter'){
			this.selectedTechnologyValue = event.target.value;
		}  filterPendingIdeas({selectedMonthValue:this.selectedMonthValue,selectedYearValue:this.selectedYearValue,selectedTechnologyValue:this.selectedTechnologyValue}).then(data=>{
            this.ideas.data=data;
            this.pendingIdeaCount=data.length;
            console.log('ideas length'+data.length);
        }).catch(error=> {
            console.log(error);
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
    handleReset(event) {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        console.log('input fields   ' + JSON.stringify(inputFields));
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
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
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error while uploading File',
                        message: error.message,
                        variant: 'error',
                    }),
                );

            })
            this.fileReader.readAsDataURL(this.file);
}

refreshingApex(){
    return refreshApex(this.ideas);
}


updateIdea(event){
    /*  let fields = event.detail.fields;
      updateIdeas({'recordid':fields.Id,'name':fields.Name,'description':fields.Description__c}).then(data=>{
  
      }).catch(err=>{
  
      })*/
    console.log('in update idea');
    this.ideaname = 'updated';
    this.ideaDescription = 'updated desc';
    updateIdeas({ 'recordId': this.recordId }).then((data) => {
        console.log('in update idea response' + data);
        this.openmodel = false;
    }).catch(err => {

        console.log('err' + err);
    })
}



connectedCallback(){
    console.log('in connected callback');
    refreshApex(this.task);
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
    console.log('empId from session storage ' + this.empId);
    /*getProjectIdeas({'employeeId':empId}).then((data)=>{
        console.log('data'+JSON.stringify(data));
        this.ideas=data;
    }).catch((err)=>{
        console.log('err'+err.body.message);
    })*/
}
backtomenu(){
    this.flag = false;
    this.optionflag = true;
}

onComment(event){
    this.comment = event.target.value;
}
handleRejectedNameSearch(){


    console.log('in handle name search' + this.Name);
    if (this.Name != '') {
        searchIdeaByNameRejected({ 'Name': this.Name }).then((data) => {
            console.log('data' + JSON.stringify(data));
            this.rejectedIdeas.data = data;
        }).catch((err) => {
            console.log('err' + err.body.message);
        })
    }
}
rowHandler(event){


    console.log("in row handler method" + event.detail.action.name);
    console.log("object id-----" + event.detail.row.Id);





    if (event.detail.action.name == 'show_details') {
        console.log('in show detail action' + event.detail.row.Id);
        const obj = { 'pid': event.detail.row.Id, 'empid': this.empId };
        console.log(JSON.stringify(obj));
        fireEvent(this.pageRef, 'appEventGuest', obj);
        fireEvent(this.pageRef, 'hidecomment', event.detail.row.Id);


    }



    /*if(event.detail.action.name=='review'){
    
        fireEvent(this.pageRef,'showReview',event.detail.row.Id);
       
        
        
          
    }
    */

    if (event.detail.action.name == 'Comments') {
        const obj1 = { 'pid': event.detail.row.Id, 'empid': this.empId };
        fireEvent(this.pageRef, 'commentEvent', obj1);
        fireEvent(this.pageRef, 'hidereview', event.detail.row.Id);


    }
    if (event.detail.action.name == 'Archive') {
        console.log('in archive');


        archiveIdea({ 'recordId': event.detail.row.Id }).then(() => {
            console.log('in archive response ');

            const evt = new ShowToastEvent({
                title: "Project Idea has been Archived",

                variant: "success"
            });
            this.dispatchEvent(evt);
            //  eval("$A.get('e.force:refreshView').fire();");
            this.refreshingApex();
            //   window.reload();
        }).catch((err) => {
            console.log('err' + err.body.message);
            const evt = new ShowToastEvent({
                title: 'Error',
                message: '',
                variant: 'Error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        })



    }

    /*if(event.detail.action.name=='edit'){
    this.editrecordId = event.detail.row.Id;
    this.openmodel = true;
    }*/

    if (event.detail.action.name == 'edit') {
        console.log('row>>' + JSON.stringify(event.detail.row));
        if (this.empId != '' && this.empId == event.detail.row.empId__c) {

            //this.recordId = row.Id;
            this.editrecordId = event.detail.row.Id;
            //  this.openmodel = true;
            unlockRecord(event.detail.row.Id).then(data => {

            }).catch(err => {
                console.log('error' + err.body.message);
            })

            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: event.detail.row.Id,
                    objectApiName: 'Idea__c',
                    actionName: 'view'
                },
            });



        } else {
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'You are not allowed to edit this record',
                variant: 'Info',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        }

    }



}

handleNameSearch(){
    console.log('in handle name search' + this.Name);

    if (this.Name != '') {
        searchIdeaByName({ 'Name': this.Name }).then((data) => {
            console.log('data' + JSON.stringify(data));
            this.ideas.data = data;
        }).catch((err) => {
            console.log('err' + err.body.message);
        })
    }

}



handleApprovedNameSearch(){

    console.log('in handle name search' + this.Name);
    if (this.Name != '') {
        searchIdeaByNameApproved({ 'Name': this.Name }).then((data) => {
            console.log('data' + JSON.stringify(data));
            this.approvedIdeas.data = data;
        }).catch((err) => {
            console.log('err' + err.body.message);
        })
    }

}

handleName(event)
{
    this.Name = event.target.value;
}
onCreate(){
    checkIdeaCount({'empId':sessionStorage.getItem('empId')}).then(data=>{
        this.flag = true;

    this.optionflag = false;
    this.showideaflag = false;
    this.taskflag = false;
    this.rejectedflag = false;
    this.approvedflag = false;
    this.scoreflag = false;
    fireEvent(this.pageRef, 'hidereview', this.recordId);

    }).catch(err=>{

        const evt = new ShowToastEvent({
            title: "Employee can create 2 ideas a day",
    
            variant: "error"
        });
        this.dispatchEvent(evt);

    })
    
}
get acceptedFormats() {
    return ['.pdf', '.png', '.jpg', '.jpeg'];
}

checkEmployeeId(event){
    this.empId = event.target.value;


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


handleSuccess(event) {

    console.log('in handle success of create idea');

    this.flag = false;
    this.uploadbutton = true;
    this.recordId = event.detail.id;
    this.createflag = false;
    const evt = new ShowToastEvent({
        title: "Project Idea created succesfully",

        variant: "success"
    });
    this.dispatchEvent(evt);
    this.refreshingApex();
    this.refreshingApex(this.data);
    console.log('idea id' + this.recordId + '   empid' + this.empId);
    /*updateEmployeeIdIdea({ideaId:this.recordId, empId:this.empId}).then((res)=>{

    }).catch(err=>{
        console.log('error'+err.body.message);
    })*/
}

cancel(){
    this.uploadbutton = false;
    this.optionflag = true;
    this.fileflag = false;
}

uploadDocument(){
    this.fileflag = true;
}

showIdeas(){
    this.selectedTechnologyValue='';
    this.selectedMonthValue = 0;
    this.selectedYearValue=0;
    getProjectIdeas({ Name: '' }).then(data => {
        this.ideas.data = data;
    }).catch((err) => {
        console.log(err);

    })
    this.refreshingApex();
    //  this.optionflag=true;
    this.showideaflag = true;
    this.approvedflag = false;
    this.rejectedflag = false;
    this.taskflag = false;
    this.scoreflag = false;
    fireEvent(this.pageRef, 'hidereview', this.recordId);
    fireEvent(this.pageRef, 'hidecomment', this.recordId);

}

handlemytasks(){

    refreshApex(this.tasks);
    fireEvent(this.pageRef, 'hidereview', this.recordId);
    // this.optionflag=false;

    fireEvent(this.pageRef, 'hidecomment', this.recordId);
    this.taskflag = true;
    this.rejectedflag = false;
    this.approvedflag = false;
    this.showideaflag = false;
    this.scoreflag = false;


}
handlerejectedideas(){
    this.selectedTechnologyValue='';
    this.selectedMonthValue = 0;
    this.selectedYearValue=0;
    console.log('in rejected ideas');
    getRejectedIdeas({ Name: '' }).then(data => {
        this.rejectedIdeas.data = data;
    }).catch((err) => {
        console.log(err);

    })
    refreshApex(this.rejectedIdeas);
    // this.optionflag=false;
    this.rejectedflag = true;
    this.approvedflag = false;
    this.showideaflag = false;
    this.taskflag = false;
    this.scoreflag = false;
    fireEvent(this.pageRef, 'hidereview', this.recordId);
    fireEvent(this.pageRef, 'hidecomment', this.recordId);
    refreshApex(this.rejectedIdeas);


}

handlescoreboard(){
    this.rejectedflag = false;
    this.approvedflag = false;
    this.showideaflag = false;
    this.taskflag = false;
    this.scoreflag = true;
    refreshApex(this.scores);
    fireEvent(this.pageRef, 'hidereview', this.recordId);
    fireEvent(this.pageRef, 'hidecomment', this.recordId);
}


handleapprovedIdeas(){
    this.selectedTechnologyValue='';
    this.selectedMonthValue = 0;
    this.selectedYearValue=0;

    getApprovedIdeas({ Name: '' }).then(data => {
        this.approvedIdeas.data = data;
    }).catch((err) => {
        console.log(err);

    })
    refreshApex(this.approvedIdeas);
    this.approvedflag = true;
    this.rejectedflag = false;
    this.showideaflag = false;
    this.taskflag = false;
    this.scoreflag = false;
    fireEvent(this.pageRef, 'hidereview', this.recordId);
    fireEvent(this.pageRef, 'hidecomment', this.recordId);

}
closeModal() {
    this.openmodel = false;
    this.refreshingApex();
}
submitDetails() {
    console.log(this.iname + this.ides);
    this.isModalOpen = false;
    /*  updateIdeas(recordId,this.iname,this.ides).then().catch(error=>{
          console.error('Error' + error);
      })*/
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
/*
previousHandler() {
    if (this.page > 1) {
        this.page = this.page - 1; //decrease page by 1
        this.displayRecordPerPage(this.page);
    }
}

//clicking on next button this method will be called
nextHandler() {
    if ((this.page < this.totalPage) && this.page !== this.totalPage) {
        this.page = this.page + 1; //increase page by 1
        this.displayRecordPerPage(this.page);
    }
}

//this method displays records page by page
displayRecordPerPage(page){

   
    this.startingRecord = ((page - 1) * this.pageSize);
    this.endingRecord = (this.pageSize * page);

    this.endingRecord = (this.endingRecord > this.totalRecountCount)
        ? this.totalRecountCount : this.endingRecord;

    this.data = this.items.slice(this.startingRecord, this.endingRecord);

    //increment by 1 to display the startingRecord count, 
    //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
    this.startingRe

}*/
}