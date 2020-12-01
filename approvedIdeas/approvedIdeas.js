import { LightningElement, wire, track } from 'lwc';
import getIdeasByStatus from '@salesforce/apex/Project_Idea_Lightning.getIdeasByStatus';
import filterIdeas from '@salesforce/apex/Project_Idea_Lightning.filterIdeas';

/* this component retrieves approved ideas */
export default class ApprovedIdeas extends LightningElement {
    @track error;
    @track ideas = [];
    @track status='Approved';
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
    }

    Name = '';
    @track monthOptions = [
        { label: 'All', value: null },
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
        { label: 'All', value: null },
        { label: '2019', value: '2019' },
        { label: '2020', value: '2020' },
        { label: '2021', value: '2021' },
        { label: '2022', value: '2022' }

    ];
    @track technologyOptions = [
        { label: 'All', value: '' },
        { label: 'Java', value: 'Java' },
        { label: 'Salesforce', value: 'Salesforce' },
        { label: 'BigData', value: 'BigData' },
        { label: 'Azure', value: 'Azure' },
        { label: 'Other', value: 'Other' }

    ];
    @track selectedTechnologyValue = '';
    @track selectedMonthValue = 0;
    @track selectedYearValue = 0;
    ApprovedIdeacolumn = [

        {
            label: 'Project Idea Name',
            fieldName: 'nameUrl',
            type: 'url',
            typeAttributes: {
                label: { fieldName: 'Name' },
                target: '_self'
            },
            sortable: true,
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

        },
        {

            label: ' Date',
            fieldName: 'LastModifiedDate',
            type: 'date'

        }, {

            label: 'Project Details',
            fieldName: 'Project_Details__c',
            type: 'text',
            wrapText: true

        }

    ];

    handleName(event) {
        this.Name = event.target.value;
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
        } filterIdeas({ selectedMonthValue: this.selectedMonthValue, selectedYearValue: this.selectedYearValue, selectedTechnologyValue: this.selectedTechnologyValue ,status:'Approved'}).then(data => {
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

}