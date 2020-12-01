import { createElement } from 'lwc';
import employeeProfile from 'c/employeeProfile';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getEmployees from '@salesforce/apex/EmployeeController.getEmployees';
import { CurrentPageReference } from 'lightning/navigation';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import filterEmployee from '@salesforce/apex/EmployeeController.filterEmployee';
 
const mockGetEmployeeList = require('./data/employeesList.json');
const getEmployeesAdapter = registerApexTestWireAdapter(getEmployees);
const currentPageReferenceAdapter = registerTestWireAdapter(CurrentPageReference);
const mockCurrentPageReference = require('./data/CurrentPageReference.json');
 
jest.mock(
    '@salesforce/apex/EmployeeController.filterEmployee',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);
 
const APEX_EMPLOYEES_SUCCESS = [
    {
        Id: "a012w00000KkROxAAN",
        Name: "Mahima Gupta",
        Project__c: "a002w00000CGCVwAAP",
        Location__c: "Kolkata",
        Technology__c: "Salesforce",
        Project__r: { Name: "Billing management", Id: "a002w00000CGCVwAAP" }
    }
];
/*
const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};
*/
describe('c-employee-profile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });
 
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }
 
describe('c-employee-profile testing wire', () => {
    beforeEach(() => {
        const element = createElement('c-employee-profile', {
            is: employeeProfile
        })
        getEmployeesAdapter.emit(mockGetEmployeeList);
        currentPageReferenceAdapter.emit(mockCurrentPageReference);
        document.body.appendChild(element)
    })
 
    it('renders all employees from wired calling', () => {
        const ele = document.querySelector('c-employee-profile')
        
        return Promise.resolve().then(() => {
            const pElem = ele.shadowRoot.querySelectorAll('lightning-layout-item');
            console.log('data is not null'+ pElem);
            expect(pElem.length).toBe(mockGetEmployeeList.length);
        })
    })
 
})
})