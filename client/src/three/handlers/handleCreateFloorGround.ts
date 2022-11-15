import { Shape, ShapeStraightPoint, Worker } from '../../types/index';
import { createRoundedGround, createGround, createShapeGround, createTile } from "../helpers/floorGroundCreators";

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
  
    // adding worker tiles
    workers.forEach((worker) => {
      const tile = createTile(worker);
  
      ground.add(tile);
    });
  
    return ground;
}