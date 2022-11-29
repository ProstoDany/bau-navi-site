import { LabelData } from "../../types";
import { TileObject, TileUserData } from '../../types/three/tile';
import * as THREE from 'three';
import { Worker } from '../../types/three';

interface ITile {
    object: THREE.Mesh<THREE.PlaneGeometry>;
    worker: Worker;
    addLabel: (label: LabelData) => LabelData;
}

export class Tile implements ITile {
    object: THREE.Mesh<THREE.PlaneGeometry>;
    worker: Worker;
    private _label: LabelData | null;
    
    constructor (worker: Worker) {
        this.worker = worker;
        
        this._label = null;
        this.object = this.build();
    }

    addLabel(label: LabelData): LabelData {
        if (!this._label) {
            this._label = label;
            
            if (this.object) {
                this.object.userData = {
                    ...this.object.userData,
                    label
                } as TileUserData

                this.object.add(label.CSS2DContainer);
            }

        }

        return this._label;
    }

    protected build(): TileObject {
        const tileGeometry = new THREE.PlaneGeometry(0.5, 0.5, 10);
        const tileMaterial = new THREE.MeshBasicMaterial({
            color: this.worker.tile.color,
            opacity: .8,
            transparent: true,
            side: THREE.DoubleSide,
        });
        
        const tile = new THREE.Mesh(tileGeometry, tileMaterial);
        const x = this.worker.coordinates[0] / 2 + 0.25;
        const y = this.worker.coordinates[1] / 2 + 0.25;

        tile.position.x = x
        tile.position.y = 0.05
        tile.position.z = y
        tile.rotation.x = Math.PI / 2;  

        tile.name = 'tile'
        tile.userData = {
            coordinates: [x, y],
            worker: this.worker
        } as TileUserData

        return tile;
    }
}