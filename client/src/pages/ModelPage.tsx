import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTypedSelector } from '../hooks/redux';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'
import { Coordinates2D, Coordinates3D } from '../types';
import { getDistance } from '../helpers/getDistance';
import { camera, renderer, scene } from '../three';

const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {floorHeight, floors, shape} = useTypedSelector(state => state.buildingModel.model)
  
  useEffect(() => {
    if(!modelRef.current) return; 
    modelRef.current.appendChild(renderer.domElement)

    let shapePointsDistancesFromCenter: number[] = shape.map(point => getDistance([0, 0], point));
    
    // ground creation
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: THREE.DoubleSide })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -0.001
    scene.add(ground)
    
    
    for (let floorNumber = 0; floorNumber < floors.length; floorNumber++) {
      const floor = createFloor(floorNumber);
      
      scene.add(floor)
    }
    
    function createFloor(floorNumber: number) {
      const floor = new THREE.Object3D(); 
      
      floor.position.y = floorNumber * floorHeight;
      
      for (let wallNumber = 1; wallNumber <= shape.length; wallNumber++) {
        const wall = createWall(wallNumber);
        
        floor.add(wall)
      }
      
      const floorSeparatorGeometry = new THREE.TorusGeometry(Math.max(...shapePointsDistancesFromCenter) + 1, 0.1, 20, 40)
      const floorSeparatorMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 });
      const floorSeparator = new THREE.Mesh(floorSeparatorGeometry, floorSeparatorMaterial);
      
      floorSeparator.position.y = floorHeight / 3;
      floorSeparator.rotation.x = -0.5 * Math.PI

      floor.add(floorSeparator)

      if (floorNumber === 0) {
        const ground = createCeiling();
        floor.add(ground)
      } 
      
      const ceiling = createCeiling()
      ceiling.position.y = floorHeight
      floor.add(ceiling)

      return floor;
    }

    function createCeiling() {
      const verticies = shape.map(coordinates => {
        // multiplicate second coordinate by -1 because shape of floor ceiling is reversed by z axis
        return new THREE.Vector2(coordinates[0] , coordinates[1] * -1)
      })

      const ceilingShape = new THREE.Shape(verticies)
      const ceilingGeometry = new THREE.ShapeGeometry(ceilingShape)
      const ceilingMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
      const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

      ceiling.rotation.x = -0.5 * Math.PI
      return ceiling
    }
    
    function createWall(wallNumber: number) {  
      let verticies = []
      
      // wall seems to be a rectangle
      // 4 represents corners of wall
      for (let wallCorner = 0; wallCorner < 4; wallCorner++) {
        let coordinates: Coordinates3D;
        // first coordin
        let wallXZPlanePoints: [Coordinates2D, Coordinates2D];

        if (shape.length === wallNumber) {
          wallXZPlanePoints = [shape[wallNumber - 1], shape[0]]
        } else {
          wallXZPlanePoints = [shape[wallNumber - 1], shape[wallNumber]]
        }
        // bottom left corner
        if (wallCorner === 0) {
          coordinates = [wallXZPlanePoints[0][0], 0, wallXZPlanePoints[0][1]]
        }
        // top left corner
        else if (wallCorner === 1) {
          coordinates = [wallXZPlanePoints[0][0], floorHeight, wallXZPlanePoints[0][1]]
        }

        // top right corner
        else if (wallCorner === 2) {
          coordinates = [wallXZPlanePoints[1][0], floorHeight, wallXZPlanePoints[1][1]]
        }

        // bottom right corner
        else if (wallCorner === 3) {
          coordinates = [wallXZPlanePoints[1][0], 0, wallXZPlanePoints[1][1]]
        } 

        else {
          coordinates = [0, 0, 0]
        }
        verticies.push(new THREE.Vector3(...coordinates))
      }

      const wallGeometry = new ConvexGeometry(verticies)
      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide})
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);

      return wall
    }

    function animate() {
      renderer.render(scene, camera);
    }
    
    renderer.setAnimationLoop(animate);
  }, [])

  return (
    <div>
      {/* three js canvas */}
      <div className="model" ref={modelRef}></div>
    </div>
  )
}

export default ModelPage