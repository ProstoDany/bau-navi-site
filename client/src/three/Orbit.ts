import { Coordinates3D } from './../types/index';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';

export class Orbit {
    controls: OrbitControls;
    private _defaultTarget: Coordinates3D;
    private _camera: THREE.Camera;
    private _renderer: THREE.WebGLRenderer;

    constructor(defaultTarget: Coordinates3D, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        this._defaultTarget = defaultTarget;
        this._camera = camera;
        this._renderer = renderer;

        this.controls = this._init();
    }

    focus(coordinates: Coordinates3D) {
        this.controls.target = new THREE.Vector3(...coordinates);
    }

    unfocus() {
        this.controls.target = new THREE.Vector3(...this._defaultTarget)
    }

    private _init(): OrbitControls {
        const orbit = new OrbitControls(this._camera, this._renderer.domElement);
        orbit.maxPolarAngle = Math.PI / 2.15

        orbit.target = new THREE.Vector3(...this._defaultTarget);

        orbit.update();

        return orbit;
    }
}
// this.model.centerPoint[0], 
// getFloorYPosition(this.model.floors.length - 1, this.model.floors.map(({height}) => height)) / 2, 
// this.model.centerPoint[1]