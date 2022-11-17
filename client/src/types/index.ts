export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];
export type IDType = string;

export interface TileUserData {
    x: Coordinate;
    z: Coordinate;
    worker: Worker;
    labelId?: string;
}

export interface Tile {
    color: string;
}

export interface Worker {
    id: IDType;
    coordinates: Coordinates2D;
    tile: Tile;
    floor: number;
    name: string;
    age: number;
}



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