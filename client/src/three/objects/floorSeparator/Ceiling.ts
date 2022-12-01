import { FloorSeparator, IFloorSeparator } from './FloorSeparator';
import { ShapePoint } from '../../../types/three/points';
import { FloorSeparatorObject } from '../../../types/three/separator';

export class Ceiling extends FloorSeparator implements IFloorSeparator {
    floorHeight: number;
    object: FloorSeparatorObject;

    constructor (points: ShapePoint[], floorHeight: number) {
        super(points);
        this.floorHeight = floorHeight;

        this.object = this.build()
    }

    protected build() {
        const object = super.build();

        object.name = 'ceiling';
        object.position.y = this.floorHeight;

        return object;
    }
}