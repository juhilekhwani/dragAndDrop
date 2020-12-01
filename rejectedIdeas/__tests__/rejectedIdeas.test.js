import { createElement } from 'lwc';
import rejectedIdeas from 'c/rejectedIdeas';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getIdeasByStatus from '@salesforce/apex/Project_Idea_Lightning.getIdeasByStatus';
import filterIdeas from '@salesforce/apex/Project_Idea_Lightning.filterIdeas';

const mockGetIdeasList = require('./data/rejectedIdeasList.json');
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
        empId__c: "1010688",
        Name: "Deliveries App",
        Status__c: "Rejected",
        Description__c: "Turn drivers into sales, service, and operations heroes with\na mobile app that ends the need for paper and connects\nfield employees to each other and headquarters.",
        Submitter_Name__c: "Satya Kireet",
        Technology__c: "Salesforce",
        Score__c: 0,
        LastModifiedDate: "2020-10-12T05:28:24.000Z",
        Reason__c: "not good",
        Id: "a022w00000FxQjJAAV",
        nameUrl: "https://ideaportal-developer-edition.ap16.force.com/s/detail/a022w00000FxQjJAAV"
    }
];

/*const APEX_CONTACTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};*/

describe('c-rejected-ideas', () => {
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
        const USER_INPUT_PROJECT = 'Salesforce';
        const APEX_PARAMETERS = { selectedMonthValue: USER_INPUT_MONTH, selectedYearValue: 0, selectedTechnologyValue: '', status: 'Rejected' };

        // Assign mock value for resolved Apex promise
        filterIdeas.mockResolvedValue(APEX_EMPLOYEES_SUCCESS);

        // Create initial element
        const element = createElement('c-rejected-ideas', {
            is: rejectedIdeas
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

        // const buttonEl = element.shadowRoot.querySelector('lightning-button');
        // buttonEl.click();

        return flushPromises().then(() => {
            expect(filterIdeas.mock.calls[0][0]).toEqual(APEX_PARAMETERS);
        });
    });
})
/*describe('c-rejected-ideas testing wire', () => {
    beforeEach(() => {
        const element = createElement('c-rejected-ideas', {
            is: rejectedIdeas
        })
        document.body.appendChild(element)
    })


    it('renders all ideas from wired calling', () => {
        const element = document.querySelector('c-rejected-ideas')
        getIdeasAdapter.emit(mockGetIdeasList)
        return Promise.resolve().then(() => {
            const iElem = element.shadowRoot.querySelector('lightning-datatable')
            expect(iElem.data.length).toBe(mockGetIdeasList.length)
        })
    })*/
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
            const element = createElement('c-rejected-ideas', {
                is: rejectedIdeas
            })
            document.body.appendChild(element)//attach to JSDOM
            const WIRE_PARAMETER = 'Rejected';
            //   const element=document.querySelector('c-idea-moderation')
            getIdeasAdapter.emit(mockGetIdeasList)
            return Promise.resolve().then(() => {

                // Validate parameters of wire adapter
                expect(getIdeasAdapter.getLastConfig().status).toBe(WIRE_PARAMETER);
            });
        })
    })
})