import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTypedSelector } from '../hooks/redux';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'
import { Coordinates2D, Coordinates3D } from '../types';
import { camera, renderer, scene } from '../three';

const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {floorHeight, floors, shape} = useTypedSelector(state => state.buildingModel.model)

  useEffect(() => {
    if(!modelRef.current || modelRef.current.children.length >= 1) return; 
    
    // array of floors with walls
    const walls: (THREE.Object3D[])[] = [];

    const raycaster = new THREE.Raycaster()
    const mousePosition = new THREE.Vector2();

    // ground creation
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: THREE.DoubleSide })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -0.1
    scene.add(ground)
    
    for (let floorNumber = 0; floorNumber < floors.length; floorNumber++) {
      const floor = createFloor(floorNumber);
      
      scene.add(floor)
    }
    
    function createFloor(floorNumber: number) {
      const floor = new THREE.Group(); 
      
      floor.position.y = floorNumber * floorHeight;
      
      for (let wallNumber = 1; wallNumber <= shape.length; wallNumber++) {
        const wall = createWall(wallNumber, floorNumber);
        
        floor.add(wall)
      }
      
      
      if (floorNumber === floors.length - 1) {
        const ceiling = createFloorGround(floorNumber, false);
        ceiling.position.y = floorHeight
        floor.add(ceiling)
      } 
      
      const floorGround = createFloorGround(floorNumber, true)
      floor.add(floorGround)
      floor.name = 'floor'
      
      return floor;
    }

    window.addEventListener('mousemove', (event) => {
      mousePosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mousePosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    })
    
    function createFloorGround(floorNumber: number, createGrid: boolean) {
      const verticies = shape.map(coordinates => {
        // multiplicate second coordinate by -1 because shape of floor ceiling is reversed by z axis
        return new THREE.Vector2(coordinates[0] , coordinates[1] * -1)
      })
      
      const groundShape = new THREE.Shape(verticies)
      const groundGeometry = new THREE.ShapeGeometry(groundShape)
      const groundMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide })
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      
      if (createGrid) {
        
      }
      
      ground.name = 'floorGround ' + floorNumber
      ground.rotation.x = -0.5 * Math.PI
      return ground
    }
    
    function createWall(wallNumber: number, floorNumber: number) {  
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
      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: .5 })
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.name = `floorWall ${floorNumber}`
      if (!walls[floorNumber]) {
        walls[floorNumber] = [wall]
      } else {
        walls[floorNumber].push(wall)
      }
      return wall
    }
    
    
    function animate() {
      window.requestAnimationFrame(animate)
      
      raycaster.setFromCamera(mousePosition, camera)
      // reverse intersects array it is sorted from farrest to nearest,
      // so loop ends in farrest object. If reverse intersects then loop ends in nearest object.
      
      const intersects = raycaster.intersectObjects( scene.children ).reverse();
      
      for ( let i = 0; i < intersects.length; i ++ ) {
        // if some floor is hovered
        if (intersects[i].object.name.includes('floor')) {
          // index of hovered floor
          const activeFloorIndex = +intersects[i].object.name.split(' ')[1];

          walls.forEach((floorWalls, floorIndex) => {
              floorWalls.forEach(wall => {
                // if hovered floor
                if (activeFloorIndex === floorIndex) {
                  // @ts-ignore
                  wall.material.color.set( 0xff0000 );
                } else {
                  // @ts-ignore
                  wall.material.color.set( 0xcccccc );
                }
              })
          })
        } else {
          // run through all walls and set their color to default color
          walls.forEach(floorWalls => {
            floorWalls.forEach(wall => {
              // @ts-ignore
              wall.material.color.set( 0xcccccc );
            })
          })
        }
      }

      renderer.render(scene, camera);
    }

    animate()
    // renderer.setAnimationLoop(animate);
    modelRef.current.appendChild(renderer.domElement)
  }, [])
  
  return (
    <div>
      {/* three js canvas */}
      <div className="model" ref={modelRef}></div>
    </div>
  )
}

export default ModelPage