import { Object3D } from 'three';
export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];
export type IDType = string;


export type BuildingShape = Coordinates2D[]

export interface BuildingModel {
    shape: BuildingShape;
    floors: Floor[];
    floorHeight: number;
}

export interface Floor {
    workers: Worker[];
}

export interface Worker {
    id: IDType;
    tile: Object3D // tile is an area where worker stands
}