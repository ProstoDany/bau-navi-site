import * as THREE from 'three';

export abstract class ModelObject<ObjectType> {
    object: ObjectType;

    constructor () {
        this.object = new THREE.Group() as ObjectType;
    }

    protected abstract build(): ObjectType;
    abstract hide(duration: number): void;
    abstract show(duration: number): void;
    abstract highlight(color: string): void;
}
