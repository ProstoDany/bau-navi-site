export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];
export type IDType = string;


// export type BuildingShape = Coordinates2D[]

export interface BuildingModel {
    shape: BuildingShape;
    floors: Floor[];
    floorHeight: number;
}

export interface Floor {
    id: IDType;
    //? floorHeight: number; 
}

export interface Worker {
    id: IDType;
    coordinates: Coordinates2D; // tile is an area where worker stands
    floor: number;
}

export interface BuildingShape {
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