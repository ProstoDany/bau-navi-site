import { Coordinates2D } from './../../types/index';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'
import * as THREE from 'three'

export function createRoundedWall(coordinate: Coordinates2D, radius: number, wallHeight: number) {
    const tubeGeometry = new THREE.CylinderGeometry(radius, radius, wallHeight, 50, 5, true);
    const tubeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, transparent: true, opacity: .4, depthWrite: false});
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

    tube.position.set(coordinate[0], wallHeight / 2, coordinate[1]);
    return tube;
  }

export function createStraightWall(startCoordinate: Coordinates2D, endCoordinate: Coordinates2D, wallHeight: number) {
    const verticies: THREE.Vector3[] = [];

    // 4 is number of wall corners
    for (let wallCornerIndex = 0; wallCornerIndex < 4; wallCornerIndex++) {
      const verticy = new THREE.Vector3();

      switch (wallCornerIndex) {
        case 0: 
          verticy.set(startCoordinate[0], 0, startCoordinate[1]); 
          break;

        case 1: 
          verticy.set(startCoordinate[0], wallHeight, startCoordinate[1]); 
          break;

        case 2: 
          verticy.set(endCoordinate[0], wallHeight, endCoordinate[1]); 
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