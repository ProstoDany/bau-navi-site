
import * as THREE from 'three';
import { ShapeCirclePoint, ShapePoint, ShapeStraightPoint } from '../../types/three/points';
import { CircleFloor, FloorSeparator, StraightShape } from '../../types/three/separator';

abstract class AbstractFloorSeparatorCreator {
  points: ShapePoint[];
  height: number;
  straightPoints: ShapeStraightPoint[];
  circlePoints: ShapeCirclePoint[];

  constructor(points: ShapePoint[], height: number) {
    this.points = points;
    this.height = height;
    this.straightPoints = points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
    this.circlePoints = points.filter(point => point.type === 'circle') as ShapeCirclePoint[];
  }

  public abstract createGround(): FloorSeparator;
  public abstract createCeiling(): FloorSeparator;
  protected abstract createSeparator(): FloorSeparator;
  protected abstract createCircleFloor(point: ShapeCirclePoint): CircleFloor;
  protected abstract createStraightShape(): StraightShape;
}

export class FloorSeparatorCreator extends AbstractFloorSeparatorCreator {
  points: ShapePoint[];
  height: number;
  straightPoints: ShapeStraightPoint[]; 
  circlePoints: ShapeCirclePoint[];

  constructor(points: ShapePoint[], height: number) {
    super(points, height);
    this.points = points;
    this.height = height;
    this.straightPoints = points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
    this.circlePoints = points.filter(point => point.type === 'circle') as ShapeCirclePoint[];
  }

  public createCeiling(): FloorSeparator {
    const ceiling = this.createSeparator();
    ceiling.position.y = this.height;
    ceiling.name = 'ceiling'

    return ceiling
  }

  public createGround(): FloorSeparator {
    const ground = this.createSeparator();
    ground.name = 'ground'

    return ground
  }

  protected createSeparator(): FloorSeparator {
    const separator = new THREE.Group();
    separator.rotation.x = -0.5 * Math.PI;

    const circles: CircleFloor[] = [];
    const straightShape = this.createStraightShape();
    separator.add(straightShape)

    // creating rounded ground
    this.circlePoints.forEach((point) => {
      const circle = this.createCircleFloor(point)
      circles.push(circle)
      separator.add(circle);
    });
  
    return separator;
  }

  protected createStraightShape(): StraightShape {
    const verticies = this.straightPoints.map((point) => new THREE.Vector2(point.coordinate[0], point.coordinate[1] * -1));
    // ^^^ multiplicate second coordinate by -1 because shape of floor ceiling is reversed by z axis

    const groundShape = new THREE.Shape(verticies);
    const groundGeometry = new THREE.ShapeGeometry(groundShape);
    const groundMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);

    return ground
  }

  protected createCircleFloor(point: ShapeCirclePoint): CircleFloor {
    const circleGeometry = new THREE.CircleGeometry(point.radius, 50);
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true
    });

    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(point.coordinate[0], point.coordinate[1] * -1, 0);

    return circle
  }
}