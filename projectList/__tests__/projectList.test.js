 import { createElement } from 'lwc';
import projectList from 'c/projectList';
import getProjects from '@salesforce/apex/ProjectController.getProjects';
import { CurrentPageReference } from 'lightning/navigation';
import { registerTestWireAdapter } from '@salesforce/sfdx-lwc-jest';
import {registerApexTestWireAdapter} from '@salesforce/sfdx-lwc-jest';
  const mockGetProjectList = require('./data/getProjectList.json')
  const mockCurrentPageReference = require('./data/CurrentPageReference.json');
  const getProjectListAdapter = registerApexTestWireAdapter(getProjects)
  const currentPageReferenceAdapter = registerTestWireAdapter(
    CurrentPageReference
  );
describe('c-project-list', () => {
  // afterEach(() => {
  //   // The jsdom instance is shared across test cases in a single file so reset the DOM
  //   while(document.body.firstChild) {
  //     document.body.removeChild(document.body.firstChild);
  //   }
  // });
  
  beforeEach( () => {
    const element = createElement('c-project-list', {
      is: projectList
    });
    document.body.appendChild(element);
    
  });
  it('render size records',()=>{
    const element = document.querySelector('c-project-list');
    getProjectListAdapter.emit(mockGetProjectList)
    currentPageReferenceAdapter.emit(mockCurrentPageReference);
    // return Promise.resolve().then(() => {
    //   expect(preElement.textContent).toBe(
    //     JSON.stringify(mockCurrentPageReference, null, 2)
    //   );
    // });
    return Promise.resolve().then(()=>{
      const datatableElement = element.shadowRoot.querySelector('lightning-datatable');
      expect(datatableElement.data.length).toBe(mockGetProjectList.length)
  })

});
it("navigates to detail page when view details action raised", () => {
  const rowActionEvent = new CustomEvent("rowaction", {
    detail: { action: { name: "View Project Details" },
    row: { Id: "a002w00000D61LQAAZ" } }
  });

  const element = document.querySelector('c-project-list');  
  return Promise.resolve().then(()=>{
  const dataTable = element.shadowRoot.querySelector("lightning-datatable");
  dataTable.dispatchEvent(rowActionEvent);
  })
});

it("navigates to new component when assign resource action raised", () => {
  const rowActionEvent = new CustomEvent("rowaction", {
    detail: { action: { name: "assign resource" },
    row: { Id: "a002w00000D61LQAAZ" } }
  });
 
  const element = document.querySelector('c-project-list');  
  return Promise.resolve().then(()=>{
  const dataTable = element.shadowRoot.querySelector("lightning-datatable");
  dataTable.dispatchEvent(rowActionEvent);
  })
});
})