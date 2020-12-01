import { createElement } from 'lwc';
import employeeDetails from 'c/employeeDetails';
import { registerListener, unregisterAllListeners } from 'c/pubsub'

const currentPageReferenceAdapter = registerTestWireAdapter(CurrentPageReference);
const mockCurrentPageReference = require('./data/CurrentPageReference.json');

//mock the pubSub methods
jest.mock('c/pubsub', () => {
    return {
        registerListener: jest.fn(),
        unregisterAllListeners: jest.fn()
    }
})

//remove all elements from test DOM after each test
afterEach(() => {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
})

describe('Listeners', () => {
    it('should register and unregister myevent listener', () => {
        let element = createElement('c-status-component', { is: employeeDetails });
        document.body.appendChild(element);

        expect(registerListener.mock.calls.length).toBe(1);
        expect(registerListener.mock.calls[0][0]).toEqual('pubsubevent');

        document.body.removeChild(element);
        expect(unregisterAllListeners.mock.calls.length).toBe(1)
    })
})

describe('c-record-view-form-dynamic-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders lightning-record-view-form with given input values', () => {
        const RECORD_ID_INPUT = 'a012w00000KkROxAAN';
        const OBJECT_API_NAME_INPUT = 'Employee__c';

        // Create initial element
        const element = createElement('c-employee-details', {
            is: employeeDetails
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        // Validate if correct parameters have been passed to base components
        const formEl = element.shadowRoot.querySelector(
            'lightning-record-view-form'
        );
        expect(formEl.recordId).toBe(RECORD_ID_INPUT);
        expect(formEl.objectApiName).toBe(OBJECT_API_NAME_INPUT);
    });

    it('renders given set of lightning-output-field`s in specific order', () => {
        const OUTPUT_FIELDS = ['Profile_Picture__c', 'Employee_ID__c', 'Name', 'Email__c', 'Location__c','Project__c','Team__c'];
        const RECORD_ID_INPUT = '0031700000pJRRSAA4';
        const OBJECT_API_NAME_INPUT = 'Contact';

        // Create initial element
        const element = createElement('c-employee-details', {
            is: employeeDetails
        });
        // Set public properties
        element.recordId = RECORD_ID_INPUT;
        element.objectApiName = OBJECT_API_NAME_INPUT;
        document.body.appendChild(element);

        const outputFieldNames = Array.from(
            element.shadowRoot.querySelectorAll('lightning-output-field')
        ).map((outputField) => outputField.fieldName);
        expect(outputFieldNames).toEqual(OUTPUT_FIELDS);
    });
});