import { ShapeCirclePoint, ShapePoint } from './../../../types/three/points';
import { IWall, Wall } from "./Wall";
import * as THREE from 'three';
import { WallObject } from '../../../types/three/walls';
import { changeObjectOpacity } from '../../../gsap/changeObjectOpacity';
import { getThetaLength } from '../../helpers/getThetaLength';
import { getThetaCenter } from '../../helpers/getThetaCenter';
import { getThetaStart } from '../../helpers/getThetaStart';

interface IRoundedWall extends IWall {
    point: ShapeCirclePoint;
}

export class RoundedWall extends Wall implements IRoundedWall {
    object: WallObject;
    point: ShapeCirclePoint;
    private _opacity: number;

    constructor (height: number, width: number, radius: number, point: ShapeCirclePoint, nextPoint: ShapePoint) {
        super(height, width, point, nextPoint)

        this.point = point
        this._opacity = .7;
        this.material.opacity = this._opacity
        this.object = this.build()
    }

    protected build() {
        const thetaLength = getThetaLength(this.point.coordinates, this.nextPoint.coordinates, this.point.radius);
        const thetaStart = getThetaStart(this.point.coordinates, this.nextPoint.coordinates, this.point.radius, this.point.isConvex);
        const thetaCenter = getThetaCenter(this.point.coordinates, this.nextPoint.coordinates, this.point.radius, this.point.radius, this.point.isConvex);
        
        const cylinderGeometry = new THREE.CylinderGeometry(this.point.radius, this.point.radius, this.height, 50, 5, true, thetaStart, thetaLength);
        const cylinder = new THREE.Mesh(cylinderGeometry, this.material);

        cylinder.position.set(thetaCenter[0], this.height / 2, thetaCenter[1]);
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