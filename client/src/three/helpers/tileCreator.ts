import { Coordinate, Label } from './../../types/index';
import { Mesh, MeshBasicMaterial } from "three";
import { Worker } from "../../types/three"
import * as THREE from 'three'
import { TileUserData } from "../../types/three/tile";
import { createTileLabel } from "../components/tileLabel";

abstract class AbstractTileCreator {
    worker: Worker;

    constructor (worker: Worker) {
        this.worker = worker;
    }

    abstract createTile(withLabel: boolean): THREE.Mesh<THREE.PlaneGeometry, MeshBasicMaterial>;
    abstract createWorkerLabel(yPositon: Coordinate): Label;
}

export class TileCreator extends AbstractTileCreator {
    worker: Worker;

    constructor (worker: Worker) {
        super(worker);
        this.worker = worker;
    }

    createTile(): Mesh<THREE.PlaneGeometry, MeshBasicMaterial> {
        const tileGeometry = new THREE.PlaneGeometry(0.5, 0.5, 10);
        const tileMaterial = new THREE.MeshBasicMaterial({
            color: this.worker.tile.color,
            opacity: 0,
            transparent: true,
            side: THREE.DoubleSide,
        });
        
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        const x = this.worker.coordinates[0] / 2 + 0.25;
        const y = (this.worker.coordinates[1] / 2 + 0.25) * -1;

        tile.position.x = x
        tile.position.y = y
        tile.position.z = 0.05

        tile.material.opacity = 0.6;
        tile.name = 'tile'
        tile.userData = {
            coordinates: [x, y],
            worker: this.worker
        } as TileUserData
        // console.log(tile)
        return tile; 
    }

    createWorkerLabel() {
        return createTileLabel(this.worker);
    }
}