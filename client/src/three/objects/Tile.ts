import { TileObject, TileUserData } from '../../types/three/tile';
import * as THREE from 'three';
import { Worker } from '../../types/three';
import { ModelObject } from "./Index";
import { changeObjectOpacity } from '../../gsap/changeObjectOpacity';
import { Label } from "./Label";

interface ITile {
    object: THREE.Mesh<THREE.PlaneGeometry>;
    worker: Worker;
    addLabel: (label: Label) => void;
}

export class Tile extends ModelObject<TileObject> implements ITile {
    object: THREE.Mesh<THREE.PlaneGeometry>;
    worker: Worker;
    label?: Label;
    
    constructor (worker: Worker) {
        super();
        this.worker = worker;
        
        this.object = this.build();
    }

    hide(duration: number): void {
        changeObjectOpacity(this.object, 0, duration)
        this.label?.hide();
    }

    show(duration: number): void {
        changeObjectOpacity(this.object, 1, duration)
        this.label?.show();
    }

    highlight(color: string): void {
        
    }

    addLabel(label: Label): Label {
        if (!this.label) {
            this.label = label;
            
            if (this.object) {
                this.object.userData = {
                    ...this.object.userData,
                    label: label.data
                } as TileUserData

                this.object.add(label.data.CSS2DContainer);
            }

        }

        return label;
    }

    protected build(): TileObject {
        const tileGeometry = new THREE.PlaneGeometry(0.5, 0.5, 10);
        const tileMaterial = new THREE.MeshBasicMaterial({
            color: this.worker.tile.color,
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