import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { generateUUID } from "three/src/math/MathUtils";
import { createHTMLFromVDOM } from "../../helpers/createHTMLFromVDOM";
import { LabelData, VDOMTreeElement } from "../../types";

interface ILabel {
    VDOM: VDOMTreeElement;
    hide: () => void;
    show: () => void
}

export class Label implements ILabel {
    VDOM: VDOMTreeElement;
    data: LabelData

    constructor (VDOM: VDOMTreeElement) {
        this.VDOM = VDOM;
        this.data = this.create();
    }

    hide() {
        this.data.elements.root.classList.remove('show')
    }

    show() {
        this.data.elements.root.classList.add('show')
    }

    protected create(): LabelData {
        const labelElements = createHTMLFromVDOM(this.VDOM);
        const label = labelElements.root as HTMLDivElement;
        
        const div = document.createElement('div');
        const divContainer = new CSS2DObject(div);
        divContainer.position.z = -2;

        div.append(label)

        return {CSS2DContainer: divContainer, elements: labelElements, id: generateUUID()}
    }
}