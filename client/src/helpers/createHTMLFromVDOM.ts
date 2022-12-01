import { VDOMElements, VDOMTreeElement } from './../types/index';

export function createHTMLFromVDOM(root: VDOMTreeElement) {
    const elements: VDOMElements = {
        root: document.createElement('div')
    };
    
    (function parseVDOMTree(element: VDOMTreeElement) {
        const HTMLElement = document.createElement(element.elementName);

        if (element.className) HTMLElement.className = element.className;
        if (element.HTMLid) HTMLElement.id = element.HTMLid;
        if (element.src && element.elementName === 'img') (HTMLElement as HTMLImageElement).src = element.src
        if (element.alt && element.elementName === 'img') (HTMLElement as HTMLImageElement).alt = element.alt
        if (element.type && (element.elementName === 'button' || element.elementName === 'input')) (HTMLElement as HTMLInputElement).type = element.type

        if (element.children) {
            element.children?.forEach(child => {
                const childHTMLElement = parseVDOMTree(child)
                HTMLElement.appendChild(childHTMLElement)
            })
        } else if (element.value) {
            HTMLElement.textContent = element.value
        }   
        
        // the root element is always with name root
        if (element === root) {
            elements.root = HTMLElement
        } else {
            elements[element.name] = HTMLElement
        }
        return HTMLElement
    })(root)

    return elements
}

