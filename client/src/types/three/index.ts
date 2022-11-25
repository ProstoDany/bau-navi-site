import { Coordinates2D, IDType } from './../index';
import { FloorSeparator } from './separator';
import { ShapePoint } from './points';
import { Walls } from './walls';
import { TileOptions, Tile } from './tile';

export interface Worker {
    id: IDType;
    coordinates: Coordinates2D;
    tile: TileOptions;
    floor: number;
    name: string;
    age: number;
}

export interface BuildingModel {
    floors: Floor[];
}

export interface Floor {
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
    ground: FloorSeparator;
    ceiling: FloorSeparator;
    walls: Walls;
    tiles: Tile[];
}
