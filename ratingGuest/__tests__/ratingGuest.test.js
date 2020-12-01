
import { createElement } from 'lwc';
import ratingGuest from 'c/ratingGuest';
import { CurrentPageReference } from 'lightning/navigation';
import {registerApexTestWireAdapter} from '@salesforce/sfdx-lwc-jest';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import submitReviewEmp from '@salesforce/apex/Project_Idea_Lightning.submitReviewEmp';
import showReviews from '@salesforce/apex/Project_Idea_Lightning.showReviews';
// Realistic data after a create record call
const mockCreateRecord = require('./data/ratingGuests.json');
const mockGetReviewList = require('./data/getReviews.json')
  const mockCurrentPageReference = require('./data/CurrentPageReference.json');
  const getReviewListAdapter = registerApexTestWireAdapter(showReviews)
  const currentPageReferenceAdapter = registerTestWireAdapter(
    CurrentPageReference
  );

describe('c-rating-guest', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling createRecord.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('sets value from lightning-input field as parameter to createRecord call', () => {
        // const USER_INPUT = 'Gomez Inc.';
        // const INPUT_PARAMETERS = [
        //     { apiName: 'Account', fields: { Name: USER_INPUT } }
        // ];
        
      let  review = { 'sobjectType': 'Review__c' };
        review.Idea__c = 'a022w00000Hu2llAAB';
        review.Rating__c = 2;
        review.Comment__c='nice';
        review.empId__c='1008214';

        // Create initial element
        const element = createElement('c-rating-guest', {
            is: ratingGuest
        });
        currentPageReferenceAdapter.emit(mockCurrentPageReference);
        element.recordId = 'a022w00000Hu2llAAB';
        element.displayflag = true;
        element.ratingflag = true;
        document.body.appendChild(element);
       
        getReviewListAdapter.emit(mockGetReviewList)

        // Select input field for simulating user input
    //    const inputEl = element.shadowRoot.querySelector(
    //         'lightning-input'
    //     );
        //inputEl.value = 'nice';
       // inputEl.dispatchEvent(new CustomEvent('change'));

        // Select button for simulating user interaction
        // const buttonEl = element.shadowRoot.querySelector('lightning-button');
        //  buttonEl.dispatchEvent(new CustomEvent('click'))


        // Return a promise to wait for any asynchronous DOM updates. Jest
        // will automatically wait for the Promise chain to complete before
        // ending the test and fail the test if the promise rejects.
        return Promise.resolve().then(() => {
            // Validate createRecord call
          const datatable =  element.shadowRoot.querySelector('lightning-datatable')
            expect(datatable.data.length).toBe(mockGetReviewList.length);
       // expect(handler).toHaveBeenCalled()
            
        });
    });


    });

   
