import * as THREE from 'three';

export abstract class ModelObject<ObjectType> {
    object: THREE.Object3D;

    constructor () {
        this.object = new THREE.Group();
    }

    protected abstract build(): ObjectType;
    abstract hide(duration: number): void;
    abstract show(duration: number): void;
    abstract highlight(color: string): void;
}
