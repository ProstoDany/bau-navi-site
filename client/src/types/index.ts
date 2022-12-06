import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];
export type IDType = string;
export type Radian = number;

export interface VDOMTreeElement {
    elementName: string;
    name: string;
    className?: string;
    children?: VDOMTreeElement[];
    value?: string
    HTMLid?: string;
    type?: string;
    src?: string;
    alt?: string;
}

export type VDOMElements = Record<string, HTMLElement> & {root: HTMLElement};

export interface LabelData {
    elements: VDOMElements, 
    CSS2DContainer: CSS2DObject, 
    id: IDType
}