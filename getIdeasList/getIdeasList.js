import { LightningElement ,wire,track} from 'lwc';
import getProjectIdeas from '@salesforce/apex/Project_Idea_Lightning.getProjectIdeas';
export default class GetIdeasList extends LightningElement {
    columns = [{
        label: 'Project Idea Name',
        fieldName: 'nameUrl',
        type: 'url',
            typeAttributes: {label: { fieldName: 'Name' }, 
            target: '_blank'},
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
    
  
];
@track error;
    @track ideas = [];


    @wire(getProjectIdeas )
    wiredOpps(result) {
        const { data, error } = result;
        if(data) {
            let nameUrl;
            this.ideas = data.map(row => { 
                nameUrl = `https://ideaportal-developer-edition.ap16.force.com/s/detail/${row.Id}`;
                return {...row , nameUrl} 
            })
            this.error = null;
        }
        if(error) {
            this.error = error;
            this.ideas = [];
        }
    }
}