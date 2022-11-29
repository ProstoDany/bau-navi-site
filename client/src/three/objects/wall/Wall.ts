import { WallObject } from './../../../types/three/walls';
import * as THREE from 'three';

export interface IWall {
    color?: string;
    height: number;
    width: number;
}

export abstract class Wall implements IWall {
    height: number;
    width: number;
    protected material: THREE.MeshBasicMaterial;

    constructor (height: number, width: number) {
        this.height = height
        this.width = width;
        this.material = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: .4, depthWrite: false});
    }

    protected abstract build(): WallObject;
}