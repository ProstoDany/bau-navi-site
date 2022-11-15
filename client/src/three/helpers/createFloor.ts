import { Floor, Worker, Coordinate } from './../../types/index';
import * as THREE from 'three'
import { handleCreateWalls } from '../handlers/handleCreateWalls';
import { handleCreateFloorGround } from '../handlers/handleCreateFloorGround';

export function createFloor(floor: Floor, workers: Worker[], yPosition: Coordinate, floorIndex: number) {
    const floorObject = new THREE.Group(); 
    floorObject.position.y = yPosition
    floorObject.name = 'floor'
    floorObject.userData = {
        floorIndex
    }
    
    const walls = handleCreateWalls(floor);
    floorObject.add(walls)

    
    const ceiling = handleCreateFloorGround([], floor.shape);
    ceiling.position.y = floor.height - 0.05
    ceiling.userData = {
        floorIndex
    }
    ceiling.name = 'ceiling'

    const floorGround = handleCreateFloorGround(workers, floor.shape)  
    floorGround.userData = {
        floorIndex
    }
    floorGround.name = 'ground'

    floorObject.add(ceiling)
    floorObject.add(floorGround)

    return floorObject;
}