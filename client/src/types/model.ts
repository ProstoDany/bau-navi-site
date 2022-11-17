import { IDType, Coordinates2D } from './index';

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

export type ShapePoint = ShapeCirclePoint | ShapeStraightPoint

export interface ShapeCirclePoint {
    type: 'circle',
    coordinate: Coordinates2D,
    radius: number;
}

export interface ShapeStraightPoint {
    type: 'straight',
    coordinate: Coordinates2D,
}