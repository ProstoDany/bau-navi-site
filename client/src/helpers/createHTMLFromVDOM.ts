import { VDOMTreeElement } from './../types/index';

export function createHTMLFromVDOM(tree: VDOMTreeElement) {
    const elements: Record<string, HTMLElement> = {};
    
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
        
        elements[element.name] = HTMLElement
        return HTMLElement
    })(tree)

    return elements
}

