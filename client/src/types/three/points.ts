import { Coordinates2D } from './../index';

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
