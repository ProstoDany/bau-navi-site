import { ShapePoint } from './../../../types/three/points';
import { WallObject } from './../../../types/three/walls';
import * as THREE from 'three';
import { ModelObject } from '../Index';

export interface IWall {
    color?: string;
    height: number;
    width: number;
    point: ShapePoint;
    nextPoint: ShapePoint;
}

export abstract class Wall extends ModelObject<WallObject> implements IWall {
    height: number;
    width: number;
    point: ShapePoint;
    nextPoint: ShapePoint;
    protected material: THREE.MeshBasicMaterial;

    constructor (height: number, width: number, point: ShapePoint, nextPoint: ShapePoint) {
        super();

        this.point = point
        this.nextPoint = nextPoint
        this.height = height
        this.width = width;
        this.material = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, side: THREE.DoubleSide});
    } 
}