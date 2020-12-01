import { LightningElement, wire, track } from 'lwc';
import submitComment from '@salesforce/apex/Project_Idea_Lightning.submitComment';
import {
    registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent
} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import showComments from '@salesforce/apex/Project_Idea_Lightning.showComments';
import { refreshApex } from '@salesforce/apex';
import getIdeaName from '@salesforce/apex/Project_Idea_Lightning.getIdeaName';

export default class ProjectIdeaComment extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    title = '';
    @track ideaId = '';
    @wire(showComments, { pid: '$ideaId' }) comments;
    @track comment = '';
    checkId = false;
    @track commentflag = true;;
    empId = '';
    openmodel=false;
    displayflag=false;
    
    


    refreshingApex() {
        return refreshApex(this.comments);
    }


    connectedCallback() {
        this.commentflag = true;
        console.log('in connected callback of comment');
        registerListener('hidecomment', this.hidecommentfunction, this);
        registerListener('commentEvent', this.handleaddevent, this);
        


    }

    disconnectedCallback() {
        console.log('in disconnected callback');
        this.commentflag = true;
    }

    hidecommentfunction(id) {
        console.log(' in handle hide comment' + id);
        this.commentflag = true;
        this.displayflag=false;
        console.log('value of flag' + this.commentflag);
    }

    handleaddevent(obj1) {
        console.log('in add comment');
        this.commentflag = false;
         this.checkId = true;
         this.openmodel=true;
         this.displayflag=true;
         console.log('data'+JSON.stringify(this.comments));
        console.log('in handle event of comments' + JSON.stringify(obj1));
        this.ideaId = obj1.pid;
        this.empId = obj1.empid;

        getIdeaName({ 'ideaId': obj1.pid }).then((data) => {
            this.title = data;
        }).catch((err) => {
            console.log('err' + err.body.message);
        })

    }


    onCommentHandler(event) {
        this.comment = event.target.value;
    }

    submitComment() {
      this.openmodel=false;
        console.log('in submit comment');
        let com = { 'sobjectType': 'Comment__c' };
         com.Idea__c = this.ideaId;
         com.text__c = this.comment;
        com.empId__c = this.empId;

        console.log('comment' + JSON.stringify(com));
    if(this.comment != '')
    {
        submitComment({ comment: com }).then((data) => {
            
            console.log('in response' + JSON.stringify(data));
            console.log('in submit comment response response ');
            this.refreshingApex();
            const evt1 = new ShowToastEvent({
                title: "Post has been submitted successfully",

                variant: "success"
            });
            this.dispatchEvent(evt1);


            const inputFields = this.template.querySelectorAll('form');
            this.template.querySelector('form').reset();
            this.comment = '';
        }).catch((error) => {
            console.log('error1');
            console.log('error' + error.body.message);
        })
    }
    else{
        const evt = new ShowToastEvent({
            title: '',
            message: 'Please enter comment ',
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    }

 
}