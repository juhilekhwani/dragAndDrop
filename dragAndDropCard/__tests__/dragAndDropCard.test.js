import { createElement } from "lwc";
import dragAndDropCard from "c/dragAndDropCard";

afterEach(() => {
  while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
  }
  jest.clearAllMocks();
})
describe('c-drag-and-drop component testing',()=>{
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
});
    it('draggable is true',()=>{
      const RECORD =  {Id:"a012w00000LnfkTAAR",
      Name:"Uttam Singh","Email__c":"uttam.singh@yash.com",
      Project__c:"a002w00000AiMuOAAV","Location__c":"Mumbai",
      "Profile_Picture__c":"<p><img src=\"/servlet/rtaImage?eid=a012w00000LnfkT&amp;feoid=00N2w00000FzF4e&amp;refid=0EM2w0000012ErR\" alt=\"Uttam.jpg\"></img></p>"}
        const PROJECT = 
        {Id:"a002w00000AiMuOAAV",Name:"Bench"}
      const element = createElement('c-drag-and-drop-card', {
          is:  dragAndDropCard 

      });
      element.record = RECORD;
      element.project = PROJECT;
      document.body.appendChild(element);
      const childElem = element.shadowRoot.querySelector('div')
      console.log(childElem)
      expect(childElem.draggable).toBeTruthy();
    })
    it('itemDragStart is called',()=>{
      const RECORD =  {Id:"a012w00000LnfkTAAR",
      Name:"Uttam Singh","Email__c":"uttam.singh@yash.com",
      Project__c:"a002w00000AiMuOAAV","Location__c":"Mumbai",
      "Profile_Picture__c":"<p><img src=\"/servlet/rtaImage?eid=a012w00000LnfkT&amp;feoid=00N2w00000FzF4e&amp;refid=0EM2w0000012ErR\" alt=\"Uttam.jpg\"></img></p>"}
        const PROJECT = 
        {Id:"a002w00000AiMuOAAV",Name:"Bench"}
      const element = createElement('c-drag-and-drop-card', {
          is:  dragAndDropCard 

      });
      element.record = RECORD;
      element.project = PROJECT;
      document.body.appendChild(element);
      const handler = jest.fn();
      element.addEventListener('itemdrag', handler);

      const childElem = element.shadowRoot.querySelector('div')
      console.log(childElem)
      childElem.dispatchEvent(new CustomEvent('dragstart'))
      expect(handler).toHaveBeenCalled();
    })
    it('record name is passed',()=>{
      const RECORD =  {Id:"a012w00000LnfkTAAR",
      Name:"Uttam Singh","Email__c":"uttam.singh@yash.com",
      Project__c:"a002w00000AiMuOAAV","Location__c":"Mumbai",
      "Profile_Picture__c":"<p><img src=\"/servlet/rtaImage?eid=a012w00000LnfkT&amp;feoid=00N2w00000FzF4e&amp;refid=0EM2w0000012ErR\" alt=\"Uttam.jpg\"></img></p>"}
        const PROJECT = 
        {Id:"a002w00000AiMuOAAV",Name:"Bench"}
      const element = createElement('c-drag-and-drop-card', {
          is:  dragAndDropCard 

      });
      element.record = RECORD;
      element.project = PROJECT;
      document.body.appendChild(element);
      

      const childElem = element.shadowRoot.querySelector('h3')
      console.log(childElem)
      
      expect(childElem.title).toBe('Uttam Singh');
    })
  })