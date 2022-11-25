import { Walls, RoundedWall, StraightWall } from './../../types/three/walls';
import { ShapePoint, ShapeStraightPoint, ShapeCirclePoint } from '../../types/three/points';
import { Coordinates2D } from '../../types/index';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'
import * as THREE from 'three'


abstract class AbstractWallCreator {
  points: ShapePoint[];
  height: number;
  protected straightPoints: ShapeStraightPoint[];
  protected circlePoints: ShapeCirclePoint[];

  constructor (points: ShapePoint[], height: number) {
    this.points = points;
    this.height = height;

    this.straightPoints = points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
    this.circlePoints = points.filter(point => point.type === 'circle') as ShapeCirclePoint[];
  }

  public abstract createWalls(): Walls;
  protected abstract createRoundedWall (center: Coordinates2D, radius: number): RoundedWall;
  protected abstract createStraightWall (startCoordinate: Coordinates2D, endCoordinate: Coordinates2D): StraightWall;
}



export class WallCreator extends AbstractWallCreator {
  points: ShapePoint[];
  height: number;
  
  constructor (points: ShapePoint[], height: number) {
    super(points, height);
    this.points = points;
    this.height = height
  }

  protected createStraightWall(startCoordinate: Coordinates2D, endCoordinate: Coordinates2D): StraightWall {
    const verticies: THREE.Vector3[] = [];

    // 4 is number of wall corners
    for (let wallCornerIndex = 0; wallCornerIndex < 4; wallCornerIndex++) {
      const verticy = new THREE.Vector3();

      switch (wallCornerIndex) {
        case 0: 
          verticy.set(startCoordinate[0], 0, startCoordinate[1]); 
          break;

        case 1: 
          verticy.set(startCoordinate[0], this.height, startCoordinate[1]); 
          break;

        case 2: 
          verticy.set(endCoordinate[0], this.height, endCoordinate[1]); 
          break;

        case 3: 
          verticy.set(endCoordinate[0], 0, endCoordinate[1]); 
          break;
      }

      verticies.push(verticy)
    }

    const wallGeometry = new ConvexGeometry(verticies)
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: .4, depthWrite: false })
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    return wall;
  }

  protected createRoundedWall(center: Coordinates2D, radius: number): RoundedWall {
    const cylinderGeometry = new THREE.CylinderGeometry(radius, radius, this.height, 50, 5, true);
    const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: .4, depthWrite: false});
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    cylinder.position.set(center[0], this.height / 2, center[1]);
    return cylinder;
  }

  public createWalls(): Walls {
    const wallGroup = new THREE.Group();
    const walls: (RoundedWall | StraightWall)[] = [];
    wallGroup.name = 'wall'


    this.straightPoints.forEach((point, pointIndex) => {
        const nextPoint = pointIndex === this.straightPoints.length - 1 ? this.straightPoints[0] : this.straightPoints[pointIndex + 1];
        const straightWall = this.createStraightWall(point.coordinate, nextPoint.coordinate);
        
        straightWall.name = 'wall/straight'
        walls.push(straightWall);
        wallGroup.add(straightWall)
    })

    this.circlePoints.forEach(point => {
        const roundedWall = this.createRoundedWall(point.coordinate, point.radius)
        roundedWall.name = 'wall/rounded'

        wallGroup.add(roundedWall)
    })

    return wallGroup
  }
}
