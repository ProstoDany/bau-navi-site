import { Coordinates2D } from './../types/index';
import { Coordinates3D } from "../types";

export function getDistance(
    fromPoint: Coordinates3D | Coordinates2D, 
    toPoint: Coordinates3D | Coordinates2D
): number {
    let underRootValue = 0;
    for (let i = 0; i < fromPoint.length; i++) {
        let diff = toPoint[i] - fromPoint[i];
        
        underRootValue += diff ** 2
    }

    return Math.sqrt(underRootValue);
}