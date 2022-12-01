import { Coordinates3D } from '../../../types/index';
import gsap from 'gsap'
import * as THREE from 'three';
import { CameraWrapper } from './CameraWrapper';

export class PerspectiveCameraWrapper extends THREE.PerspectiveCamera implements CameraWrapper {
    private _startPosition: Coordinates3D;
    entity: THREE.PerspectiveCamera;

    constructor (fov: number, aspect: number, near: number, far: number, startPosition: Coordinates3D) {
        super(fov, aspect, near, far);

        this._startPosition = startPosition;
        this.entity = this._init(fov, aspect, near, far);
        this.entity.position.set(...startPosition);
    }

    goTo(coordinates: Coordinates3D, duration: number, onUpdate?: () => void, onEnd?: () => void) {
        const [x, y, z] = coordinates;
        // console.log(x, y, z)
        gsap.to(this.entity.position, {
            x, y, z,
            duration: duration,
            onUpdate
        }).then(onEnd)
    }

    goToStartPosition(duration: number, onUpdate?: () => void, onEnd?: () => void) {
        this.goTo(this._startPosition, duration, onUpdate, onEnd);
    }

    private _init(fov: number, aspect: number, near: number, far: number): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

        return camera
    }
}