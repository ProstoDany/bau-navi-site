export type Coordinate = number;
export type Coordinates = [Coordinate, Coordinate];


export type BuildingShape = Coordinates[]

export interface BuildingModel {
    shape: BuildingShape;
    floorsNumber: number;
    floorHeight: number;
}