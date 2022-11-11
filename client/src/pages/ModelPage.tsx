import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import {ConvexGeometry} from 'three/examples/jsm/geometries/ConvexGeometry'
import { Coordinates2D, Coordinates3D, Worker } from '../types';
import { threeInit } from '../three';
import FloorButton from '../components/FloorButton';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { modelSlice } from '../store/slices/model';
import gsap from 'gsap'

const walls: (THREE.Object3D[])[] = [];
const floorGroups: THREE.Group[] = [];
const shapeCenterPoint = [3, 3];


let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.Renderer;
let floorHeight: number;
let orbit: OrbitControls;

const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const dispatch = useTypedDispatch()

  useEffect(() => {
    if(!modelRef.current) return; 
    // console.log(first)
    const threeInitValues = threeInit(modelRef.current.clientWidth, modelRef.current.clientHeight)

    floorHeight = model.floorHeight
    camera = threeInitValues.camera;
    scene = threeInitValues.scene;
    renderer = threeInitValues.renderer;
    orbit = threeInitValues.orbit

    // array of floors with walls

    const raycaster = new THREE.Raycaster()
    const mousePosition = new THREE.Vector2();

    // ground creation
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 'gray', side: THREE.DoubleSide })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -0.1
    scene.add(ground)

    const tileGeometry = new THREE.PlaneGeometry(0.5, 0.5, 10);
    const tileMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0, transparent: true, side: THREE.DoubleSide })
    const tile = new THREE.Mesh(tileGeometry, tileMaterial);
    
    for (let floorNumber = 0; floorNumber < model.floors.length; floorNumber++) {
      const floor = createFloor(floorNumber);
      
      scene.add(floor)
    }
  
    window.addEventListener('mousemove', (event) => {
      if (!modelRef.current) return;
      
      mousePosition.x = ( event.clientX / modelRef.current.clientWidth ) * 2 - 1;
      mousePosition.y = - ( event.clientY / modelRef.current.clientHeight ) * 2 + 1;
    })

    function createActiveTile(activeCoordinates: Coordinates2D) {
      const activeTile = tile.clone();
      activeTile.position.x = activeCoordinates[0] / 2 + 0.25  
      activeTile.position.y = (activeCoordinates[1] / 2 + 0.25 ) * -1
      activeTile.position.z = 0.05

      activeTile.material.opacity = .6
      return activeTile
    }
    
    function createFloor(floorNumber: number) {
      const floor = new THREE.Group(); 
      
      floor.position.y = floorNumber * floorHeight;
      
      for (let wallNumber = 1; wallNumber <= model.shape.length; wallNumber++) {
        const wall = createWall(wallNumber, floorNumber);
        
        floor.add(wall)
      }
      
      
      if (floorNumber === model.floors.length - 1) {
        const ceiling = createFloorGround([]);
        ceiling.position.y = floorHeight
        ceiling.name = 'floorCeiling ' + floorNumber

        floor.add(ceiling)
      } 

      const floorGround = createFloorGround(workers.filter(worker => worker.floor === floorNumber + 1))  
      floorGround.name = 'floorGround ' + floorNumber
      floor.name = 'floor'
      
      floor.add(floorGround)
      floorGroups.push(floor)

      return floor;
    }
 
    function createFloorGround(workers: Worker[]) {
      const verticies = model.shape.map(coordinates => {
        // multiplicate second coordinate by -1 because shape of floor ceiling is reversed by z axis
        return new THREE.Vector2(coordinates[0] , coordinates[1] * -1)
      })
      const groundShape = new THREE.Shape(verticies)
      const groundGeometry = new THREE.ShapeGeometry(groundShape)
      const groundMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);

      workers.forEach(worker => {
        const activeTile = createActiveTile(worker.coordinates);

        ground.add(activeTile)
      })

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
        
        if (model.shape.length === wallNumber) {
          wallXZPlanePoints = [model.shape[wallNumber - 1], model.shape[0]]
        } else {
          wallXZPlanePoints = [model.shape[wallNumber - 1], model.shape[wallNumber]]
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
      const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: .5, depthWrite: false })
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
        if (intersects[i].object.name.includes('floorWall')) {
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
    
    modelRef.current.appendChild(renderer.domElement)
  }, [])
  
  return (
    <div className='model'>
      {/* three js canvas */}
      <div className="model__content" ref={modelRef}></div>
      <div className='model__sidebar'>
        {model.floors.map((floor, currentFloor) => (
          <React.Fragment key={floor.id}>
            <FloorButton 
              floorIndex={currentFloor} 
              animationHandler={() => {
                floorGroups.forEach((floor, index) => {
                  // go trough all floor elements
                  floor.children.forEach(child => {
                    // @ts-ignore
                    const {material} = child;
                    if (index === currentFloor) {
                      if (child.name.includes('floorGround')) {
                        material.transparent = false
                        child.visible = true
                        gsap.to(material, {
                          duration: 1,
                          opacity: 1
                        })

                      // any other objects make invisible
                      } else {
                        material.transparent = true
                        child.visible = false
                        gsap.to(material, {
                          duration: 0,
                          opacity: 0
                        })
                      }

                    } else {
                      // go trough all objects in floor
                      material.transparent = true
                      
                      gsap.to(material, {
                        opacity: 0,
                        duration: 1
                      }).then(() => child.visible = false)
                    }
                  })
                  })
                  
                gsap.to(camera.position, {
                  y: floorHeight * (currentFloor + 1) + 15,
                  z: shapeCenterPoint[1],
                  x: shapeCenterPoint[0],
                  duration: .5,
                  onStart: function() {
                    if (
                      !selectedFloor || 
                      camera.position.z < shapeCenterPoint[1] || 
                      camera.position.x < shapeCenterPoint[0] || 
                      camera.position.y > floorHeight * floorGroups.length + 15  || 
                      camera.position.y < floorHeight * (currentFloor + 1)
                    ) {
                      camera.lookAt(shapeCenterPoint[0], floorHeight * (currentFloor - 1000), shapeCenterPoint[1])
                    }
                  }
                })
              }}
            />
          </React.Fragment>
        ))}
        <button
          className='model__sidebar-btn'
          onClick={() => {
            dispatch(modelSlice.actions.removeSelection())
            // go to default material values
            floorGroups.forEach(floor => {
              floor.children.forEach(child => {
                // @ts-ignore
                const {material} = child;
                child.visible = true
                if (child.name.includes('floorWall') || !child.name) {
                  material.transparent = true
                  gsap.to(material, {
                    duration: 1,
                    opacity: .5
                  })
                // if
                } else {
                  child.visible = true
                  
                  gsap.to(material, {
                    duration: 1,
                    opacity: 1
                  }).then(() => {
                    material.transparent = false
                  })
                }
              })
            })
          }}
        >
          Show all
        </button>

        {typeof selectedFloor === 'number' && (
          <div>
            Selected floor: {selectedFloor + 1}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelPage