import { LightningElement,wire } from 'lwc';
import getScoreBoard from '@salesforce/apex/Project_Idea_Lightning.getScoreBoard';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

export default class ScoreBoard extends NavigationMixin(LightningElement) {
    @wire(getScoreBoard)scores;
    empId=null;

    scorecolumn = [{
        label: 'Name',
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
        label: 'Score',
        fieldName: 'Score__c',
        type: 'text'

    }
    ];

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
        refreshApex(this.scores);

    }
}