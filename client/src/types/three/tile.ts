import { Coordinates2D, LabelData } from './../index';
import {Worker} from './'

export interface TileUserData {
    coordinates: Coordinates2D
    worker?: Worker;
    label?: LabelData
}

export interface TileOptions {
    color: string;
}

export type TileObject = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;


