import { Coordinates2D } from './../../../types/index';
import { IWall, Wall } from "./Wall";
import * as THREE from 'three';
import { WallObject } from '../../../types/three/walls';
import { changeObjectOpacity } from '../../../gsap/changeObjectOpacity';

interface IRoundedWall extends IWall {
    centerCoordinates: Coordinates2D;
    object: WallObject;
    radius: number;
}

export class RoundedWall extends Wall implements IRoundedWall {
    centerCoordinates: Coordinates2D;
    radius: number;
    object: WallObject;
    private _opacity: number;

    constructor (height: number, width: number, radius: number, centerCoordinates: Coordinates2D) {
        super(height, width)

        this.radius = radius;
        this.centerCoordinates = centerCoordinates;

        this._opacity = .7;
        this.material.opacity = this._opacity
        this.object = this.build()
    }

    protected build() {
        const cylinderGeometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, 50, 5, true);
        const cylinder = new THREE.Mesh(cylinderGeometry, this.material);

        cylinder.position.set(this.centerCoordinates[0], this.height / 2, this.centerCoordinates[1]);
        cylinder.name = 'wall';

        return cylinder;
    }

    hide(duration: number): void {
        changeObjectOpacity(this.object, 0, duration)
    }

    show(duration: number): void {
        changeObjectOpacity(this.object, this._opacity, duration)
    }

    highlight(color: string): void {
        
    }
}