import { TileUserData } from './../../types/index';
import { Worker } from '../../types/index';
import * as THREE from 'three';
import { ShapeStraightPoint, ShapeCirclePoint, } from '../../types/model';


export function createRoundedGround(point: ShapeCirclePoint): THREE.Object3D {
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

export function createShapeGround(points: ShapeStraightPoint[]) {
  const verticies = points.map((point) => new THREE.Vector2(point.coordinate[0], point.coordinate[1] * -1));
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

export function createGround() {
  const ground = new THREE.Group();
  ground.rotation.x = -0.5 * Math.PI

  return ground
}

export function createTile(worker: Worker) {
  const tileGeometry = new THREE.PlaneGeometry(0.5, 0.5, 10);
  const tileMaterial = new THREE.MeshBasicMaterial({
    color: worker.tile.color,
    opacity: 0,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const tile = new THREE.Mesh(tileGeometry, tileMaterial);
  const x = worker.coordinates[0] / 2 + 0.25;
  const y = (worker.coordinates[1] / 2 + 0.25) * -1;

  tile.position.x = x
  tile.position.y = y
  tile.position.z = 0.05

  tile.material.opacity = 0.6;
  tile.name = 'tile'
  tile.userData = {
    x, 
    z: y, 
    worker, 
    labelId: ''
  } as TileUserData
  return tile;
}
