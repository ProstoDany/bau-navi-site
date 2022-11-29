import { Coordinates2D } from './../../../types/index';
import { IWall, Wall } from "./Wall";
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { WallObject } from '../../../types/three/walls';

interface IStraightWall extends IWall {
    startCoordinate: Coordinates2D;
    endCoordinate: Coordinates2D;
    object: WallObject;
}

export class StraightWall extends Wall implements IStraightWall {
    startCoordinate: Coordinates2D;
    endCoordinate: Coordinates2D;
    object: WallObject;


    constructor (height: number, width: number, startCoordinate: Coordinates2D, endCoordinate: Coordinates2D) {
        super(height, width)
        this.startCoordinate = startCoordinate;
        this.endCoordinate = endCoordinate;

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
                    verticy.set(this.startCoordinate[0], 0, this.startCoordinate[1]); 
                    break;

                case 1: 
                    verticy.set(this.startCoordinate[0], this.height, this.startCoordinate[1]); 
                    break;

                case 2: 
                    verticy.set(this.endCoordinate[0], this.height, this.endCoordinate[1]); 
                    break;

                case 3: 
                    verticy.set(this.endCoordinate[0], 0, this.endCoordinate[1]); 
                    break;
            }

            verticies.push(verticy)
        }

        const wallGeometry = new ConvexGeometry(verticies)
        const wall = new THREE.Mesh(wallGeometry, this.material);

        return wall;
    }
}