export type Coordinate = number;
export type Coordinates2D = [Coordinate, Coordinate];
export type Coordinates3D = [Coordinate, Coordinate, Coordinate];


export type BuildingShape = Coordinates2D[]

export interface BuildingModel {
    shape: BuildingShape;
    floorsNumber: number;
    floorHeight: number;
}