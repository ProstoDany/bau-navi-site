import { Coordinates3D, VDOMTreeElement } from '../../types/index';
import { Worker } from "../../types";
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createHTMLFromVDOM } from '../../helpers/createHTMLFromVDOM';

interface LabelChildInterface {
    className: string;
    key: keyof Worker;
}

enum LABEL_ELEMENT_NAMES {
    LABEL = 'label',
    LABEL_CONTAINER = 'label',
    LABEL_TOP_SECTION = 'labelTopSection',
    LABEL_MAIN_SECTION = 'labelMainSection',
    LABEL_CLOSE_BTN = 'labelCloseButton',
    LABEL_TITLE = 'labelTitle'
}



export function createTileLabel(worker: Worker, coordinates: Coordinates3D) {
    const labelVDOMTree: VDOMTreeElement = {
        name: LABEL_ELEMENT_NAMES.LABEL,
        elementName: 'div',
        className: 'model__label label',
        children: [
            {
                name: LABEL_ELEMENT_NAMES.LABEL_CONTAINER,
                elementName: 'div',
                className: 'label__container',
                children: [
                    {
                        name: LABEL_ELEMENT_NAMES.LABEL_TOP_SECTION,
                        elementName: 'div',
                        className: 'label__top-section',
                        children: [
                            {
                                name: LABEL_ELEMENT_NAMES.LABEL_TITLE,
                                elementName: 'div',
                                className: 'label__title',
                                value: worker.name
                            },
                            {
                                name: LABEL_ELEMENT_NAMES.LABEL_CLOSE_BTN,
                                elementName: 'button',
                                className: 'label__close-btn',
                                value: 'close'
                            },
                        ]
                    },
                    {
                        name: LABEL_ELEMENT_NAMES.LABEL_MAIN_SECTION,
                        elementName: 'div',
                        className: 'label__main-section',
                        children: [
                        
                        ]
                    },
                ]
            }
        ]
    }
    const labelElements = createHTMLFromVDOM(labelVDOMTree)
    const label = labelElements[LABEL_ELEMENT_NAMES.LABEL] as HTMLDivElement;
    const closeButton = labelElements[LABEL_ELEMENT_NAMES.LABEL_CLOSE_BTN] as HTMLButtonElement;

    closeButton.addEventListener('click', () => {
        label.classList.remove('show')
    })

    const div = document.createElement('div');
    const divContainer = new CSS2DObject(div);
    divContainer.position.set(...coordinates);
    div.append(label)

    return {divContainer, label}
}