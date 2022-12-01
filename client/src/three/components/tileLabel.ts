import { Worker } from "../../types/three"
import { Label } from "../objects/Label";

enum LABEL_ELEMENT_NAMES {
    LABEL = 'label',
    LABEL_CONTAINER = 'label',
    LABEL_TOP_SECTION = 'labelTopSection',
    LABEL_MAIN_SECTION = 'labelMainSection',
    LABEL_CLOSE_BTN = 'labelCloseButton',
    LABEL_TITLE = 'labelTitle'
}


export function TileLabel(worker: Worker): Label {
    const label = new Label({
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
    })
    // [worker.coordinates[0] / 2, worker.coordinates[1] * -1 / 2, 2]
    const closeButton = label.data.elements[LABEL_ELEMENT_NAMES.LABEL_CLOSE_BTN] as HTMLButtonElement;
    const root = label.data.elements.root as HTMLDivElement;

    closeButton.addEventListener('click', () => {
        root.classList.remove('show')
    })

    return label
}