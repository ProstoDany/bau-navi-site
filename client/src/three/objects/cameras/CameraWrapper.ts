import { Coordinates3D } from "../../../types";

export interface CameraWrapper {
    goTo: (coordinates: Coordinates3D, duration: number, onUpdate?: () => void, onEnd?: () => void) => void;
    goToStartPosition: (duration: number, onUpdate?: () => void, onEnd?: () => void) => void;
    entity: THREE.Camera
}