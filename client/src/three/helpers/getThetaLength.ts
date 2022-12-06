import { Coordinates2D } from '../../types/index';
import { Radian } from "../../types";
import { getDistance } from '../../helpers/getDistance';

export function getThetaLength(A: Coordinates2D, B: Coordinates2D, radius: number): Radian {
    const distance = getDistance(A, B);

    if (distance > radius * 2) {
        throw new Error(`The maximum distance is diameter. \n Distance: ${distance}\n Radius: ${radius}`)
    }

    // theta is sinus of half of the needed angle
    const theta = (distance / 2) / radius; 
    const thetaAngle = Math.asin(theta) * 2;
    
    return thetaAngle;
}