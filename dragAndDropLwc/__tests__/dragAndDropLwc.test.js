import { createElement } from "lwc";
import { CurrentPageReference } from 'lightning/navigation';
import getProject from '@salesforce/apex/ProjectController.getProject';
import dragAndDropLwc from "c/dragAndDropLwc";
import getAllEmployees from '@salesforce/apex/EmployeeController.getAllEmployees';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import {registerApexTestWireAdapter} from '@salesforce/sfdx-lwc-jest';
import { registerListener, unregisterAllListeners } from 'c/pubsub'

// the assertForTestConditions previously shown
const mockGetProjectList = require('./data/getProjectList.json')
const mockEmployeeList = require('./data/getEmployeeList.json')
const mockCurrentPageReference = require('./data/CurrentPageReference.json');
const getProjectListAdapter = registerApexTestWireAdapter(getProject)
const getEmployeeListAdapter = registerApexTestWireAdapter(getAllEmployees)
const currentPageReferenceAdapter = registerTestWireAdapter(
  CurrentPageReference
);
jest.mock('c/pubsub', () => {
  return {
      registerListener: jest.fn(),
      unregisterAllListeners: jest.fn()
  }
})

describe('c-drag-and-drop component testing',()=>{
  beforeEach(() =>{
    const element  =  createElement('c-drag-and-drop-lwc', {
      is: dragAndDropLwc
    })
    document.body.appendChild(element);
  })
  it('render child component',()=>{
    const element = document.querySelector('c-drag-and-drop-lwc')
    const childElem = element.shadowRoot.querySelectorAll('c-drag-and-drop-list')
    expect(childElem).not.toBeNull();
  })
})
afterEach(() => {
  while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
  }
  jest.clearAllMocks();
})

describe('Listeners', () => {
  it('should register and unregister myevent listener', () => {
      let element = createElement('c-drag-and-drop-lwc', { is: dragAndDropLwc });
      document.body.appendChild(element);

      expect(registerListener.mock.calls.length).toBe(1);
      expect(registerListener.mock.calls[0][0]).toEqual('passprojectid');

      document.body.removeChild(element);
      expect(unregisterAllListeners.mock.calls.length).toBe(1)
  })
})
describe("modal tests", () => {
  it("shows modal header elements when header is set", () => {
    const modal = createElement("c-drag-and-drop-lwc", {
      is: dragAndDropLwc,
    });
    document.body.appendChild(modal);
    currentPageReferenceAdapter.emit(mockCurrentPageReference);
    getProjectListAdapter.emit(mockGetProjectList)
    getEmployeeListAdapter.emit(mockEmployeeList)
   
    
    const headerElementBeforeHeaderSet = modal.shadowRoot.querySelector(
      ".slds-modal__header"
    );
    expect(headerElementBeforeHeaderSet).toBeNull();

    
    
  }); 
});