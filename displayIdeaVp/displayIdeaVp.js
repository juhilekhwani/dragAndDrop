import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getIdeasByStatus from '@salesforce/apex/Project_Idea_Lightning.getIdeasByStatus';
import approveIdea from '@salesforce/apex/Project_Idea_Lightning.approveIdea';
import rejectIdea from '@salesforce/apex/Project_Idea_Lightning.rejectIdea';;
import { CurrentPageReference, NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import filterIdeas from '@salesforce/apex/Project_Idea_Lightning.filterIdeas';

const actions = [
    { label: 'Approve', name: 'Approve' },
    { label: 'Reject', name: 'Reject' },

];
/**component is used to display pending ideas to VP  . VP can approve or reject ideas */
export default class DisplayIdeaVp extends NavigationMixin(LightningElement) {
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
    @track selectedTechnologyValue = '';
    @track selectedMonthValue = 0;
    @track selectedYearValue = 0;
    @track error;
    @track ideas = [];
    @track status='Pending for Approval';
    @wire(getIdeasByStatus, {status:'$status'}) 
    wiredOpps(result) {
        const { data, error } = result;
        if (data) {
            let nameUrl;
            this.ideas = data.map(row => {
                nameUrl = `https://ideaportal-developer-edition.ap16.force.com/s/detail/${row.Id}`;
                return { ...row, nameUrl }
            })
            this.error = null;
        }
        if (error) {
            this.error = error;
            this.ideas = [];
        }
    };

    @wire(CurrentPageReference) pageRef;
    @api recordId;
    flag = false;
    description = '';
    ratingflag = false;
    ratin = '';
    @track comment = '';
    rid = '';
    Name = '';
    openmodel = false;
    @api editrecordId;


    columns = [
        {
        label: 'Project Idea Name',
        fieldName: 'nameUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_self'
        },
        sortable: true
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

        label: 'Date',
        fieldName: 'LastModifiedDate',
        type: 'date'


    },
    {
        label: '',
        type: 'action',
        "initialWidth": 160,
        typeAttributes: { rowActions: actions }
    }

    ];
    connectedCallback() {

        this.refreshingApex();
    }

    refreshingApex() {
        return refreshApex(this.ideas);
    }


    onComment(event) {
        this.comment = event.target.value;
    }
    /**this method is used to filter ideas accoding to month year and technology */
    handleFilterChange(event) {

        const filterName = event.target.name;
        if (filterName === 'Month Filter') {
            this.selectedMonthValue = event.target.value;
        } else if (filterName === 'Year Filter') {
            this.selectedYearValue = event.target.value;
        } else if (filterName === 'Technology Filter') {
            this.selectedTechnologyValue = event.target.value;
        } filterIdeas({ selectedMonthValue: this.selectedMonthValue, selectedYearValue: this.selectedYearValue, selectedTechnologyValue: this.selectedTechnologyValue ,status:'Pending for Approval'}).then(data => {
            this.ideas = data;
            let nameUrl;
            this.ideas = data.map(row => {
                nameUrl = `https://ideaportal-developer-edition.ap16.force.com/s/detail/${row.Id}`;
                return { ...row, nameUrl }
            })
            this.pendingIdeaCount = data.length;
            console.log('ideas length' + data.length);
        }).catch(error => {
            console.log(error);
        })

    }

    /**this method is used to approve and reject ideas */
    rowHandler(event) {
        console.log("in row handler method" + event.detail.action.name);
        console.log("object id-----" + event.detail.row.Id);
        switch(event.detail.action.name){

            case 'Approve':
                console.log('in approvae');
                approveIdea({ 'recordId': event.detail.row.Id }).then(() => {
                    console.log('in approve response ');
    
                    const evt = new ShowToastEvent({
                        title: "Project Idea has been Approved",
    
                        variant: "success"
                    });
                    this.dispatchEvent(evt);
                 
                    window.location.reload();
                }).catch((err) => {
                    console.log('err' + err.body.message);
                    const evt = new ShowToastEvent({
                        title: 'Error',
                        message: 'In order to approve the idea, its score should be greater than 5',
                        variant: 'Error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(evt);
                })
                break;
             case 'Reject':
                console.log('in reject');
                this.editrecordId = event.detail.row.Id;
                this.openmodel = true;
                break;
                

        }
   

    }

    disable() {
        this.flag = false;
    }

    closeModal() {
        this.openmodel = false;
    }

    editsuccess() {
        this.openmodel = false;
        rejectIdea({ 'recordId': this.editrecordId }).then(() => {
            console.log('in reject response ');
            const evt = new ShowToastEvent({
                title: "Project Idea has been rejected",

                variant: "info"
            });
            this.dispatchEvent(evt);
            window.location.reload();
        }).catch((err) => {
            console.log('error' + error.body.message);
        })


    }

}