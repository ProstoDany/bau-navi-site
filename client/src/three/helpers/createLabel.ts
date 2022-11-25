import { generateUUID } from 'three/src/math/MathUtils';
import { Coordinates3D, VDOMTreeElement } from '../../types/index';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createHTMLFromVDOM } from '../../helpers/createHTMLFromVDOM';
import { Label } from '../../types/';

export function createLabel(VDOM: VDOMTreeElement, coordinates: Coordinates3D): Label {
    const labelElements = createHTMLFromVDOM(VDOM);
    const label = labelElements.root as HTMLDivElement;
    
    const div = document.createElement('div');
    const divContainer = new CSS2DObject(div);
    divContainer.position.set(...coordinates);
    div.append(label)

    return {CSS2DContainer: divContainer, elements: labelElements, id: generateUUID()}
}