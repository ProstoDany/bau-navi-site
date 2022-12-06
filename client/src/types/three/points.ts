import { Coordinates2D } from './../index';

export type ShapePoint = ShapeCirclePoint | ShapeStraightPoint

export interface ShapeCirclePoint {
    type: 'circle',
    coordinates: Coordinates2D;
    isConvex: boolean;
    radius: number;
}

export interface ShapeStraightPoint {
    type: 'straight',
    coordinates: Coordinates2D,
}
