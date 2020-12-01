import { createElement } from 'lwc';
import employeeLogout from 'c/employeeLogout';
import { getNavigateCalledWith } from 'lightning/navigation';
describe('c-employee-logout', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });
    it('navigates to employee login on button clicked', () => {
        const INPUT_URL = 'https://ideaportal-developer-edition.ap16.force.com/s/';
        const INPUT_TYPE = 'standard__webPage';
        // Create initial element
        const element = createElement('c-employee-logout', {
            is: employeeLogout
        });
        document.body.appendChild(element);
        // Select button to simulate user interaction
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();
        const { pageReference } = getNavigateCalledWith();
        // Verify the component under test called the correct navigate event
        expect(pageReference.type).toBe(INPUT_TYPE);
        expect(pageReference.attributes.url).toBe(INPUT_URL);
    });
})