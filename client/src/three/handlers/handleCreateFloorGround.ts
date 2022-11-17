import { Worker } from '../../types/index';
import { Shape, ShapeStraightPoint } from '../../types/model';
import { createRoundedGround, createGround, createShapeGround } from "../helpers/floorGroundCreators";

export function handleCreateFloorGround(workers: Worker[], shape: Shape) {
    const straightPoints = shape.points
      .filter((point) => point.type === 'straight') as ShapeStraightPoint[];
  
    const ground = createGround()
    const shapeGround = createShapeGround(straightPoints);
    ground.add(shapeGround)

    // creating rounded ground
    shape.points.forEach((point) => {
      if (point.type === 'straight') return;
      const circle = createRoundedGround(point)
      
      ground.add(circle);
    });
  
    return ground;
}