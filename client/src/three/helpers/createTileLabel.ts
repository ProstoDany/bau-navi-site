import { Coordinates3D } from '../../types/index';
import { Worker } from "../../types";
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

interface LabelChildInterface {
    className: string;
    key: keyof Worker;
}

export function createTileLabel(worker: Worker, coordinates: Coordinates3D) {
    const elements: LabelChildInterface[] = [
        {key: 'name', className: 'model__label-name'},
        {key: 'age', className: 'model__label-age'},
    ]
    const label = document.createElement('div');
    label.classList.add('model__label')

    const div = document.createElement('div');
    const divContainer = new CSS2DObject(div);
    divContainer.position.set(...coordinates);
    
    elements.forEach(element => {
        const node = document.createElement('div');
        node.classList.add(element.className);
        node.textContent = worker[element.key].toString();

        label.appendChild(node)
    })
    div.appendChild(label)

    return {divContainer, label}
}