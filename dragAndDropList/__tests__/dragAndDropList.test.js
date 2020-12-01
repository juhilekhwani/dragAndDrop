import { createElement } from "lwc";
import dragAndDropList from "c/dragAndDropList";
describe('c-drag-and-drop component testing',()=>{
    beforeEach(() =>{
      const element  =  createElement('c-drag-and-drop-list', {
        is: dragAndDropList
      })
      document.body.appendChild(element);
    })
    it('render child component',()=>{
      const element = document.querySelector('c-drag-and-drop-list')
      const childElem = element.shadowRoot.querySelectorAll('c-drag-and-drop-card')
      expect(childElem.length).not.toBeNull();
    })
  })