import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { threeInit } from '../three';
import FloorButton from '../components/FloorButton';
import { modelSlice } from '../store/slices/model';
import gsap from 'gsap'
import { createFloor } from '../three/helpers/createFloor';
import { changeGroupOpacity } from '../gsap/changeGroupOpacity';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer'
import { createTileLabel } from '../three/helpers/createTileLabel';
import { IDType, TileUserData } from '../types';
import { generateUUID } from 'three/src/math/MathUtils';
import { getFloorYPosition } from '../three/helpers/getFloorYPosition';


const floorGroups: THREE.Group[] = [];
const tileLabels: {label: HTMLDivElement, divContainer: CSS2DObject, id: IDType}[] = [];
const tiles: THREE.Object3D[] = [];


const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const [globalCamera, setGlobalCamera] = useState<THREE.Camera>();
  const dispatch = useTypedDispatch()
  
  useEffect(() => {
    if(!modelRef.current) return; 

    let intersects: THREE.Intersection[] = [];
    const {camera, renderer, scene} = threeInit(modelRef.current.clientWidth, modelRef.current.clientHeight)
    const raycaster = new THREE.Raycaster()
    const mousePosition = new THREE.Vector2();
    
    setGlobalCamera(camera);
    // ground creation
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: '#777777', side: THREE.DoubleSide })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -0.1
    scene.add(ground)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(modelRef.current.clientWidth, modelRef.current.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none'
    modelRef.current.appendChild(labelRenderer.domElement);

    // creating floors
    model.floors.forEach((floor, floorIndex) => {
      const yPosition = getFloorYPosition(floorIndex, model.floors);
      const floorWorkers = workers.filter(worker => worker.floor === floorIndex + 1);
      const {floorObject, tiles: floorTiles} = createFloor(floor, floorWorkers, yPosition, floorIndex);
      tiles.push(...floorTiles)

      floorGroups.push(floorObject)
      scene.add(floorObject)
    });

    tiles.forEach(tile => {
      const labelId = generateUUID()
      const {worker, x, z} = tile.userData as TileUserData;
      const {divContainer, label} = createTileLabel(worker, [x, getFloorYPosition(worker.floor - 1, model.floors) + 1.5, z * -1]);

      tile.userData.labelId = labelId
      scene.add(divContainer)
      tileLabels.push({divContainer, label, id: labelId});
    })
  

    window.addEventListener('mousemove', (event) => {
      if (!modelRef.current) return;
      
      mousePosition.x = ( event.clientX / modelRef.current.clientWidth ) * 2 - 1;
      mousePosition.y = - ( event.clientY / modelRef.current.clientHeight ) * 2 + 1;
    })

    window.addEventListener('click', () => {
      camera.updateMatrixWorld();
      raycaster.setFromCamera(mousePosition, camera)
      intersects = raycaster.intersectObjects( scene.children )

      if (intersects.length) {
        intersects.forEach(intersect => {
          if (intersect.object.name === 'tile') {
            const {labelId} = intersect.object.userData as TileUserData;
            const {label} = tileLabels.find(tileLabel => tileLabel.id === labelId)!
            label.classList.toggle('show')
          }
        })
      }
    })
    
    function animate() {
      window.requestAnimationFrame(animate)
      
     
      labelRenderer.render(scene, camera);
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
                const currentFloorGroup = floorGroups.find(floorGroup => floorGroup.userData.floorIndex === currentFloor);
                if (!currentFloorGroup) return;

                currentFloorGroup.children.forEach(floorChild => {
                  let opacity: number = 0;

                  switch (floorChild.name) {
                    case 'ground':
                      opacity = 1
                      break
                  }
                  
                  changeGroupOpacity(floorChild, opacity)
                })

                // hide all other elements
                floorGroups.forEach((floorGroup) => {
                  if (floorGroup.userData.floorIndex === currentFloorGroup.userData.floorIndex) return;
                  changeGroupOpacity(floorGroup, 0)
                })

                if (!globalCamera) return;
                gsap.to(globalCamera.position, {
                  y: 10 * (currentFloor + 1) + 20,
                  z: floor.shape.shapeCenterPoint[1],
                  x: floor.shape.shapeCenterPoint[0],
                  duration: .4,
                  onStart() {
                    globalCamera.lookAt(10, -500, 10)
                    globalCamera.updateMatrixWorld()
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
            floorGroups.forEach(floorGroup => {
              floorGroup.children.forEach(floorChild => {
                let opacity: number = 0;

                floorChild.visible = true;
                switch (floorChild.name) {
                  case 'ground':
                    opacity = 1
                    break
                  case 'wall':
                    opacity = .4
                    break
                  case 'ceiling': 
                    opacity = 1
                    break
                  }

                  changeGroupOpacity(floorChild, opacity)
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