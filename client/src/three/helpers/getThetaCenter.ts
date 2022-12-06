import { getDistance } from '../../helpers/getDistance';
import { Coordinates2D } from './../../types/index';

// formula P3 = P1 + a/distance * (P2 - P1)
// P1 StartCoords, P2 EndCoords, P3 CenterCoords
export function getThetaCenter(currentCoordinates: Coordinates2D, nextCoordinates: Coordinates2D, radius1: number, radius2: number, isConvex: boolean): Coordinates2D {
    const xCenter = (currentCoordinates[0] + nextCoordinates[0]) / 2
    const yCenter = (currentCoordinates[1] + nextCoordinates[1]) / 2

    const distance = getDistance(currentCoordinates, nextCoordinates);
    const a = (Math.pow(radius1, 2) - Math.pow(radius2, 2) + Math.pow(distance, 2)) / (2 * distance);
    const P1 = currentCoordinates
    const P2 = nextCoordinates;
    const centerPoints = [xCenter, yCenter];

    const height = Math.sqrt(Math.pow(radius1, 2) - Math.pow(a, 2));
    
    let x: number, y: number;

    if (!isConvex) {
        x = centerPoints[0] - height / distance * (P2[1] - P1[1])
        y = centerPoints[1] + height / distance * (P2[0] - P1[0])
    } else {
        x = centerPoints[0] + height / distance * (P2[1] - P1[1])
        y = centerPoints[1] - height / distance * (P2[0] - P1[0])
    }
    // sets arc center beneath
    
    
    return [x, y];
}