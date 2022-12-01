import { Coordinates2D, IDType } from './../index';
import { FloorSeparatorObject } from './separator';
import { ShapePoint } from './points';
import { TileOptions, TileObject } from './tile';
import { WallObject } from './walls';

export interface Worker {
    id: IDType;
    coordinates: Coordinates2D;
    tile: TileOptions;
    floor: number;
    name: string;
    age: number;
}

export interface BuildingModel {
    floors: FloorOptions[];
    centerPoint: Coordinates2D;
}

export interface FloorOptions {
    id: IDType;
    height: number; 
    shape: Shape;
}

export interface Shape {
    shapeCenterPoint: Coordinates2D;
    points: ShapePoint[];
} 

export interface FloorObjects {
    floor: THREE.Group;
    ground: FloorSeparatorObject;
    ceiling: FloorSeparatorObject;
    walls: WallObject[];
    tiles: TileObject[];
}

export type RaycasterHandler = (intersects: THREE.Intersection[]) => any;