import { ShapeCirclePoint, ShapeStraightPoint } from './../../../types/three/points';
import { ShapePoint } from "../../../types/three/points";
import * as THREE from 'three';
import { CircleFloor, FloorSeparatorObject, StraightShape } from '../../../types/three/separator';

export interface IFloorSeparator {
    points: ShapePoint[];
}

export class FloorSeparator implements IFloorSeparator {
    points: ShapePoint[];
    private _circlePoints: ShapeCirclePoint[];
    private _straightPoints: ShapeStraightPoint[];
    
    constructor (points: ShapePoint[]) {
        this.points = points;
        this._straightPoints = points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
        this._circlePoints = points.filter(point => point.type === 'circle') as ShapeCirclePoint[];
    }

    protected build(): FloorSeparatorObject {
        const separator = new THREE.Group();
        separator.rotation.x = -0.5 * Math.PI;

        const circles: CircleFloor[] = [];
        const straightShape = this._createStraightShape();
        separator.add(straightShape)

        // creating rounded ground
        this._circlePoints.forEach((point) => {
            const circle = this._createCircleFloor(point)
            circles.push(circle)
            separator.add(circle);
        });
        return separator;
    };

    private _createCircleFloor(point: ShapeCirclePoint): CircleFloor {
        const circleGeometry = new THREE.CircleGeometry(point.radius, 50);
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        });
    
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(point.coordinate[0], point.coordinate[1] * -1, 0);
    
        return circle
    }

    private _createStraightShape(): StraightShape {
        const verticies = this._straightPoints.map((point) => new THREE.Vector2(point.coordinate[0], point.coordinate[1] * -1));
        // ^^^ multiplicate second coordinate by -1 because shape of floor ceiling is reversed by z axis
    
        const groundShape = new THREE.Shape(verticies);
        const groundGeometry = new THREE.ShapeGeometry(groundShape);
        const groundMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    
        return ground
    }
}