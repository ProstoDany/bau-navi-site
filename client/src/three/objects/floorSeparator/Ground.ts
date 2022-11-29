import { ShapePoint } from '../../../types/three/points';
import { FloorSeparatorObject } from '../../../types/three/separator';
import { FloorSeparator, IFloorSeparator } from './FloorSeparator';

export class Ground extends FloorSeparator implements IFloorSeparator {
    object: FloorSeparatorObject;

    constructor (points: ShapePoint[]) {
        super(points);

        this.object = this.build();
    }


    protected build() {
        const object = super.build();

        object.name = 'ground';

        return object;
    }
}