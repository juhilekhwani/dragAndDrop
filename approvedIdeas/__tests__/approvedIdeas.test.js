import { createElement } from 'lwc';
import approvedIdeas from 'c/approvedIdeas';
//import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import filterIdeas from '@salesforce/apex/Project_Idea_Lightning.filterIdeas';
import getIdeasByStatus from '@salesforce/apex/Project_Idea_Lightning.getIdeasByStatus';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

const mockGetIdeasList = require('./data/ideasList.json');
const getIdeasAdapter = registerLdsTestWireAdapter(getIdeasByStatus);

jest.mock(
    '@salesforce/apex/Project_Idea_Lightning.filterIdeas',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

const APEX_EMPLOYEES_SUCCESS = [
    {
        empId__c: "1009402",
        Name: "Bug tracking system",
        Status__c: "Approved",
        Description__c: "create  ticket , Assign ticket , escalate issue , feedback",
        Submitter_Name__c: "Shrilekha Pawar",
        Technology__c: "Salesforce",
        Score__c: 6,
        Project_Details__c: "Bug tracking system",
        LastModifiedDate: "2020-10-08T09:19:27.000Z",
        Id: "a022w00000FwceRAAR",
        nameUrl: "https://ideaportal-developer-edition.ap16.force.com/s/detail/a022w00000FwceRAAR"
    }
];

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

    it('passes the user input to the Apex method correctly', () => {
        const USER_INPUT_YEAR = 2020;
        const USER_INPUT_MONTH = 8;
        const USER_INPUT_PROJECT = 'Billing management';
        const APEX_PARAMETERS = { selectedMonthValue: USER_INPUT_MONTH, selectedYearValue: 0, selectedTechnologyValue: '', status: 'Approved' };

        // Assign mock value for resolved Apex promise
        filterIdeas.mockResolvedValue(APEX_EMPLOYEES_SUCCESS);

        // Create initial element
        const element = createElement('c-approved-ideas', {
            is: approvedIdeas
        });
        document.body.appendChild(element);

        const inputEl = element.shadowRoot.querySelector('lightning-combobox');
        inputEl.value = USER_INPUT_MONTH;
        inputEl.dispatchEvent(new CustomEvent('change'));
        const inputE2 = element.shadowRoot.querySelector('lightning-combobox');
        inputE2.value = USER_INPUT_YEAR;
        inputE2.dispatchEvent(new CustomEvent('change'));
        const inputE3 = element.shadowRoot.querySelector('lightning-combobox');
        inputE3.value = USER_INPUT_PROJECT;
        inputE3.dispatchEvent(new CustomEvent('change'));

        return flushPromises().then(() => {
            expect(filterIdeas.mock.calls[0][0]).toEqual(APEX_PARAMETERS);

        });
    });
})
describe('c-apex-wire-method-with-params', () => {
    beforeAll(() => {
        // We use fake timers as setTimeout is used in the JavaScript file.
        jest.useFakeTimers();
    });

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getApprovedIdeas @wire data', () => {
        it("check parameter of wired method", () => {
            const element = createElement('c-approved-ideas', {
                is: approvedIdeas
            })
            document.body.appendChild(element)//attach to JSDOM
            const WIRE_PARAMETER = 'Approved';
            //   const element=document.querySelector('c-idea-moderation')
            getIdeasAdapter.emit(mockGetIdeasList)
            return Promise.resolve().then(() => {

                // Validate parameters of wire adapter
                expect(getIdeasAdapter.getLastConfig().status).toBe(WIRE_PARAMETER);
            });
        })
    })
});