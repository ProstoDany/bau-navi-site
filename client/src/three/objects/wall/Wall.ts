import { WallObject } from './../../../types/three/walls';
import * as THREE from 'three';
import { ModelObject } from '../Index';

export interface IWall {
    color?: string;
    height: number;
    width: number;
}

export abstract class Wall extends ModelObject<WallObject> implements IWall {
    height: number;
    width: number;
    protected material: THREE.MeshBasicMaterial;

    constructor (height: number, width: number) {
        super();

        this.height = height
        this.width = width;
        this.material = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, depthWrite: false});
    } 
}