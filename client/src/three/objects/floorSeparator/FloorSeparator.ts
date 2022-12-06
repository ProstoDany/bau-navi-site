import { ShapeCirclePoint } from './../../../types/three/points';
import { ShapePoint } from "../../../types/three/points";
import * as THREE from 'three';
import { CircleFloor, FloorSeparatorObject, StraightShape } from '../../../types/three/separator';
import { ModelObject } from '../Index';
import { changeGroupOpacity } from '../../../gsap/changeGroupOpacity';
import { getThetaCenter } from '../../helpers/getThetaCenter';
import { getThetaLength } from '../../helpers/getThetaLength';
import { getThetaStart } from '../../helpers/getThetaStart';
import { getDistance } from '../../../helpers/getDistance';

export interface IFloorSeparator {
    points: ShapePoint[];
}

export abstract class FloorSeparator extends ModelObject<FloorSeparatorObject> implements IFloorSeparator {
    points: ShapePoint[];
    
    constructor (points: ShapePoint[]) {
        super();

        this.points = points;

        this.object = this.build();
    }

    hide(duration: number): void {
        changeGroupOpacity(this.object, 0, duration)
    }

    show(duration: number): void {
        changeGroupOpacity(this.object, 1, duration)
    }

    highlight(color: string): void {
        
    } 

    protected build(): FloorSeparatorObject {
        const separator = new THREE.Group();
        separator.rotation.x = -0.5 * Math.PI;

        const circles: CircleFloor[] = [];
        const straightShape = this._createStraightShape();
        if (straightShape) {
            separator.add(straightShape)
        }

        // creating rounded ground
        this.points.forEach((point, index) => {
            if (point.type === 'circle') {
                const nextPoint = this.points[index + 1] || this.points[0];

                const circle = this._createCircleFloor(point, nextPoint);
                circles.push(circle)
                separator.add(circle);
            }
        });
        return separator;
    };

    private _createCircleFloor(point: ShapeCirclePoint, nextPoint: ShapePoint): CircleFloor {
        const thetaStart = getThetaStart(point.coordinates, nextPoint.coordinates, point.radius, point.isConvex);
        const thetaLength = getThetaLength(point.coordinates, nextPoint.coordinates, point.radius);
        const thetaCenter = getThetaCenter(point.coordinates, nextPoint.coordinates, point.radius, point.radius, point.isConvex);

        const hypotenuse = getDistance(point.coordinates, [0, 0])
        const angle = getThetaStart(point.coordinates, nextPoint.coordinates, point.radius, false) - getThetaStart([0, 0], nextPoint.coordinates, 8, false);
        // console.log(angle * 180 / Math.PI)
        const constant = Math.sin(Math.PI - angle) / hypotenuse

        const circleClipping = new THREE.Plane(new THREE.Vector3(
            (point.coordinates[1] + nextPoint.coordinates[1]), 
            0, 
            (point.coordinates[0] + nextPoint.coordinates[0]) * -1, 
        ), constant)

        const circleGeometry = new THREE.CircleGeometry(point.radius, 50, thetaStart + (Math.PI / 2 * -1), thetaLength);
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          clippingPlanes: [circleClipping]
        });

        
        
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(thetaCenter[0], thetaCenter[1] * -1, 0);
    
        return circle
    }

    private _createStraightShape(): StraightShape | void {
        const verticies = this.points
            .map((point) => new THREE.Vector2(point.coordinates[0], point.coordinates[1] * -1))
            // ^^^ multiplicate second coordinate by -1 because shape of floor separator is reversed by z axis

        if (!verticies.length) return;

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