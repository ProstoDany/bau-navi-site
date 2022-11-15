import { ShapeCirclePoint, ShapeStraightPoint, Floor } from '../../types/index';
import { createRoundedWall, createStraightWall } from "../helpers/wallCreators";
import {Group} from 'three'

export function handleCreateWalls(floor: Floor): THREE.Group {
    const wallGroup = new Group();
    wallGroup.name = 'wall'
    const straightPoints = floor.shape.points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
    const circlePoints = floor.shape.points.filter(point => point.type === 'circle') as ShapeCirclePoint[];


    straightPoints.forEach((point, pointIndex) => {
        const nextPoint = pointIndex === straightPoints.length - 1 ? straightPoints[0] : straightPoints[pointIndex + 1];
        const straightWall = createStraightWall(point.coordinate, nextPoint.coordinate, floor.height)
        straightWall.name = 'wall/straight'

        if (!straightWall) return;
        wallGroup.add(straightWall)
    })

    circlePoints.forEach(point => {
        const roundedWall = createRoundedWall(point.coordinate, point.radius, floor.height)
        roundedWall.name = 'wall/rounded'
        if (!roundedWall) return;
        wallGroup.add(roundedWall)
    })

    return wallGroup
}