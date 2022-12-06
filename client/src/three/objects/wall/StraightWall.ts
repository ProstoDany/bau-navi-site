import { ShapePoint } from './../../../types/three/points';
import { IWall, Wall } from "./Wall";
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { WallObject } from '../../../types/three/walls';
import { changeObjectOpacity } from '../../../gsap/changeObjectOpacity';

interface IStraightWall extends IWall {
    object: WallObject;
}

export class StraightWall extends Wall implements IStraightWall {
    object: WallObject;
    private _opacity: number;


    constructor (height: number, width: number, point: ShapePoint, nextPoint: ShapePoint) {
        super(height, width, point, nextPoint)
        this._opacity = .4
        this.material.opacity = this._opacity
        this.object = this.build();
    }

    protected build() {
        const verticies: THREE.Vector3[] = [];

        // 4 is number of wall corners
        for (let wallCornerIndex = 0; wallCornerIndex < 4; wallCornerIndex++) {
            const verticy = new THREE.Vector3();
            // console.log(this)
            switch (wallCornerIndex) {
                case 0: 
                    verticy.set(this.point.coordinates[0], 0, this.point.coordinates[1]); 
                    break;

                case 1: 
                    verticy.set(this.point.coordinates[0], this.height, this.point.coordinates[1]); 
                    break;

                case 2: 
                    verticy.set(this.nextPoint.coordinates[0], this.height, this.nextPoint.coordinates[1]); 
                    break;

                case 3: 
                    verticy.set(this.nextPoint.coordinates[0], 0, this.nextPoint.coordinates[1]); 
                    break;
            }

            verticies.push(verticy)
        }

        const wallGeometry = new ConvexGeometry(verticies)
        const wall = new THREE.Mesh(wallGeometry, this.material);

        return wall;
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