import { createElement } from 'lwc';
import displayIdeaVp from 'c/displayIdeaVp';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import getIdeasByStatus from '@salesforce/apex/Project_Idea_Lightning.getIdeasByStatus';
import filterIdeas from '@salesforce/apex/Project_Idea_Lightning.filterIdeas';
import { CurrentPageReference } from 'lightning/navigation';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import approveIdea from '@salesforce/apex/Project_Idea_Lightning.approveIdea';

const mockGetIdeasList = require('./data/displayIdeaVpList.json');
const getIdeasAdapter = registerApexTestWireAdapter(getIdeasByStatus);
const mockCurrentPageReference = require('./data/CurrentPageReference.json');
const currentPageReferenceAdapter = registerLdsTestWireAdapter(CurrentPageReference);

jest.mock(
    '@salesforce/apex/Project_Idea_Lightning.filterIdeas',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

const APEX_IDEAS_SUCCESS = [
    {
        empId__c: "1010688",
        Name: "Remote Assistance",
        Status__c: "Pending for Approval",
        Description__c: "Remote assistance is a process that enables you to troubleshoot problems faced by clients with their software or hardware. It is a feature that is commonly utilized by people and companies using Windows-based systems.",
        Score__c: 0,
        Technology__c: "Java",
        Submitter_Name__c: "Satya Kireet",
        LastModifiedDate: "2020-10-01T05:02:40.000Z",
        Id: "a022w00000FxNaZAAV",
        nameUrl: "https://ideaportal-developer-edition.ap16.force.com/s/detail/a022w00000FxNaZAAV"
    }
];

describe('c-display-idea-vp', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
});
describe('c-display-idea-vp imperative apex', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });
    beforeEach( () => {
        const element = createElement('c-project-list', {
          is: displayIdeaVp
        });
        document.body.appendChild(element);
        
      });
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise((resolve) => setImmediate(resolve));
    }

    it('passes the user input to the Apex method correctly', () => {
        const USER_INPUT_YEAR = 2020;
        const USER_INPUT_MONTH = 8;
        const USER_INPUT_PROJECT = 'Salesforce';
        const APEX_PARAMETERS = { selectedMonthValue: USER_INPUT_MONTH, selectedYearValue: 0, selectedTechnologyValue: '' ,status:'Pending for Approval'};

        // Assign mock value for resolved Apex promise
        filterIdeas.mockResolvedValue(APEX_IDEAS_SUCCESS);

        // Create initial element
        const element = createElement('c-display-idea-vp', {
            is: displayIdeaVp
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
    it("navigates to detail page when view details action raised", () => {
        const rowActionEvent = new CustomEvent("rowaction", {
            detail: {
                action: { name: "Approve" },
                row: { Id: "a022w00000FxNaZAAV" }
            }
        });
        const element = createElement('c-display-idea-vp', {
            is: displayIdeaVp
        });
        document.body.appendChild(element);

        getIdeasAdapter.emit(mockGetIdeasList);
        currentPageReferenceAdapter.emit(mockCurrentPageReference);
        const ele = document.querySelector('c-display-idea-vp');
        return Promise.resolve().then(() => {
            const dataTable = ele.shadowRoot.querySelector("lightning-datatable");
            dataTable.dispatchEvent(rowActionEvent);
        })
    });
});
describe('getApprovedIdeas @wire data', () => {
    it("check parameter of wired method", () => {
        const element = createElement('c-display-idea-vp', {
            is: displayIdeaVp
        })
        document.body.appendChild(element)//attach to JSDOM
        const WIRE_PARAMETER = 'Pending for Approval';
        //   const element=document.querySelector('c-idea-moderation')
        getIdeasAdapter.emit(mockGetIdeasList)
        return Promise.resolve().then(() => {

            // Validate parameters of wire adapter
            expect(getIdeasAdapter.getLastConfig().status).toBe(WIRE_PARAMETER);
        });
    })
})