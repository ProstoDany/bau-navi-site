import { Coordinates2D, Label } from './../index';
import {Worker} from './'

export interface TileUserData {
    coordinates: Coordinates2D
    worker: Worker;
    label?: Label
}

export interface TileOptions {
    color: string;
}

export type Tile = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;


