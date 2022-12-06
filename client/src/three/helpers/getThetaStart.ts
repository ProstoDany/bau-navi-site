import { Coordinates2D, Radian } from './../../types/index';
import { getDistance } from '../../helpers/getDistance';
import { getThetaLength } from './getThetaLength';

export function getThetaStart(A: Coordinates2D, B: Coordinates2D, radius: number, isConvex: boolean): Radian {
    // arc angle
    const thetaLength = getThetaLength(A, B, radius);
    // difference between chord angle (PI) and arc angle  
    const deltaAngle = Math.PI - thetaLength;

    // total distance of the chord
    const distance = getDistance(A, B);

    /* 
        to know the angle between Y axis and chord we will find the farrest point from Y axis. This point is one of imagine arc points.
        arc radius is distance between A and B
        than the closer point to Y axis will be center of this arc. And from that point we go up by Y axis on A and B distance (radius).
        so second arc point has the same coordinates by x but y coordinates are greter by arc radius (A and B distance)
     */
    let imagineArcPoint: Coordinates2D;
    let farrestFromYPoint: Coordinates2D;
    let period: Radian = 0;

    if (isConvex) {
        period += Math.PI
    }

    if (A[0] > B[0]) {
        farrestFromYPoint = A;
        imagineArcPoint = [B[0], B[1] + distance]
        period += Math.PI
    } else{
        farrestFromYPoint = B;
        imagineArcPoint = [A[0], A[1] + distance]
    }

    // finding imagine arc angle
    let circleAngle = getThetaLength(farrestFromYPoint, imagineArcPoint, distance) + period

    // devide deltaAngle by 2 because we need to get arc angle centered. 
    return circleAngle + deltaAngle / 2;
}

