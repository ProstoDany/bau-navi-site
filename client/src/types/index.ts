export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];
export type IDType = string;

export interface BuildingModel {
    floors: Floor[];
}

export interface Floor {
    id: IDType;
    height: number; 
    shape: Shape;
}

export interface Worker {
    id: IDType;
    coordinates: Coordinates2D; // tile is an area where worker stands
    floor: number;
    color: string;  
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