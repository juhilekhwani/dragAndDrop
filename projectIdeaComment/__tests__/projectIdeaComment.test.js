import { createElement } from 'lwc';
import projectIdeaComment from 'c/projectIdeaComment';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import submitComment from '@salesforce/apex/Project_Idea_Lightning.submitComment';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import showComments from '@salesforce/apex/Project_Idea_Lightning.showComments';
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import getIdeaName from '@salesforce/apex/Project_Idea_Lightning.getIdeaName';



const currentPageReferenceAdapter = registerTestWireAdapter(
    CurrentPageReference
  );

const APEX_Comment_SUCCESS = [
    {
        Submitter_Name__c:"Shrilekha Pawar",
        text__c:"Nice",
        Id:"a022w00000EyAhkAAF"
    }
];

// Sample error for imperative Apex call
const APEX_Comment_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

const mockdata =require('./data/comments.json');
//const mockNodata =require('./data/NoIdeaRecords.json');
const getAdapter= registerLdsTestWireAdapter(showComments);

jest.mock('c/pubsub', () => {
    return {
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    }
})

    
jest.mock('@salesforce/apex/Project_Idea_Lightning.getIdeaName',
()=>({
    default: jest.fn()
}),
{virtual:true}
)


jest.mock('@salesforce/apex/Project_Idea_Lightning.submitComment',
()=>({
    default: jest.fn()
}),
{virtual:true}
)

describe('Comment testing' ,()=>{

    beforeEach(()=>{
        const element = createElement('c-project-idea-comment',{
            is:projectIdeaComment
        })
        submitComment.mockResolvedValue(APEX_Comment_SUCCESS);
      //c/approvedIdeas  expect(registerListener.mock.calls[0][0]).toEqual('commentEvent');
        document.body.appendChild(element)//attach to JSDOM
    })

    it("with data",()=>{
        const element=document.querySelector('c-project-idea-comment')
        getAdapter.emit(mockdata);
        return new Promise(setImmediate).then(()=>{
          
            const pElem = element.shadowRoot.querySelectorAll('lightning-layout-item')
            expect(pElem.length).toBe(mockdata.length)

        })
    })

  
/*
    
    it('passes the parameter Apex method correctly', () => {
        
        let com = { 'sobjectType': 'Comment__c' };
        com.Idea__c ='a022w00000EyAhkAAF' ;
        com.text__c = 'Nice';
       com.empId__c = '1009402';
        const APEX_PARAMETERS = { comment: com };

        // Assign mock value for resolved Apex promise
       submitComment.mockResolvedValue(APEX_Comment_SUCCESS);
      const element = document.querySelector('c-project-idea-comment');
         console.log('elemnt'+element);
     //  inputEl.value = com.text__c;
      // inputEl.dispatchEvent(new CustomEvent('change'));

       // Select button for executing Apex call
       const buttonEl = element.shadowRoot.querySelector('lightning-button');
       console.log('button'+buttonEl);
       buttonEl.click();
        return flushPromises().then(() => {
            // Validate parameters of mocked Apex call
            expect(submitComment.mock.calls[0][0]).toEqual(APEX_PARAMETERS);
        });
    });
    */
/*
    it('is accessible when data is returned', () => {
        // Assign mock value for resolved Apex promise
        submitComment.mockResolvedValue(APEX_Idea_SUCCESS);

      
        const element = document.querySelector('c-project-idea-comment');  

       // return Promise.resolve().then(() => expect(element).toBeAccessible());
    });*/

 /*   return Promise.resolve().then(() => {
        expect(preElement.textContent).toBe(
          JSON.stringify(mockCurrentPageReference, null, 2)
        );*/
/*
    it("No data",()=>{
        const element=document.querySelector('c-idea-guest')
        getAdapter.emit(mockNodata)
        return Promise.resolve().then(()=>{
            const dataTable = element.shadowRoot.querySelector('lightning-datatable');
               expect(dataTable.data.length).toBe(mockNodata.length);
         

        })
    })
*//*
    it("error",()=>{
        const element=document.querySelector('c-project-idea-comment')
        getAdapter.error();
        return Promise.resolve().then(()=>{
            const errorElement= element.shadowRoot.querySelector('.error');
            expect(errorElement.textContent).not.toBeNull();
               
         

        })
    })*/
    
    afterEach(()=>{
            // The jsdom instance is shared across test cases in a single file so reset the DOM
        while(document.body.firstChild){
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }


})
describe('Listeners', () => {
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }
    it('should register and unregister myevent listener', () => {
        const element = createElement('c-project-idea-comment', {
             is: projectIdeaComment
             }
        );
        submitComment.mockResolvedValue(APEX_Comment_SUCCESS);
        document.body.appendChild(element);

        expect(registerListener.mock.calls.length).toBe(2);
        expect(registerListener.mock.calls[0][0]).toEqual('hidecomment');
       expect(registerListener.mock.calls[1][0]).toEqual('commentEvent');

    
        expect(unregisterAllListeners.mock.calls.length).toBe(0);
        let com = { 'sobjectType': 'Comment__c' };
        com.Idea__c ='a022w00000EyAhkAAF' ;
        com.text__c = 'Nice';
       com.empId__c = '1009402';
        const APEX_PARAMETERS = { comment: com };

        // Assign mock value for resolved Apex promise
      
     // const element = document.querySelector('c-project-idea-comment');
         console.log('elemnt'+element);
     //  inputEl.value = com.text__c;
      // inputEl.dispatchEvent(new CustomEvent('change'));

       // Select button for executing Apex call
      
        return new Promise(setImmediate).then(() => {
            // Validate parameters of mocked Apex call
            const e2=document.querySelector('c-project-idea-comment');  

     
            const buttonEl = e2.shadowRoot.querySelector('lightning-button');
            console.log('button'+buttonEl);
            buttonEl.click();
            expect(submitComment.mock.calls[0][0]).toEqual(APEX_PARAMETERS);
        });
    })
})