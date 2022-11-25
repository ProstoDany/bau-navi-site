import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { modelSlice } from '../store/slices/model';
import FloorButton from '../components/FloorButton';
import gsap from 'gsap'
import { changeGroupOpacity } from '../gsap/changeGroupOpacity';
import { ModelController } from '../three/ModelController';
import { TileUserData } from '../types/three/tile';


const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const [modelController, setModelController] = useState<ModelController>();
  const [globalCamera, setGlobalCamera] = useState<THREE.Camera>();
  const dispatch = useTypedDispatch()
  
  useEffect(() => {
    if(!modelRef.current) return; 

    const controller = new ModelController(model, workers, modelRef, {
      fov: 40,
      sceneHeight: modelRef.current.clientHeight,
      sceneWidth: modelRef.current.clientWidth,
    }) 

    if (!modelController) return setModelController(controller);

    
    modelController.render();
    // Getting tile labels from floors object
    const tileLabels = modelController.floors
      .map(floor => floor.tiles
      .map(tile => tile.userData.label))
      .flat()

    let intersects: THREE.Intersection[] = [];
    const raycaster = new THREE.Raycaster()
    const mousePosition = new THREE.Vector2();
    
    setGlobalCamera(modelController.camera);


    window.addEventListener('mousemove', (event) => {
      if (!modelRef.current) return;
      
      mousePosition.x = ( event.clientX / modelRef.current.clientWidth ) * 2 - 1;
      mousePosition.y = - ( event.clientY / modelRef.current.clientHeight ) * 2 + 1;
    })

    window.addEventListener('click', () => {
      modelController.camera.updateMatrixWorld();
      raycaster.setFromCamera(mousePosition, modelController.camera)
      intersects = raycaster.intersectObjects( modelController.scene.children )

      if (intersects.length) {
        intersects.forEach(intersect => {
          if (intersect.object.name === 'tile') {
            // Getting tile label from intersect userData.
            const {label: currentTileLabel} = intersect.object.userData as TileUserData;
            // Getting root label element.
            const {elements: {root}} = tileLabels.find(tileLabel => tileLabel?.id === currentTileLabel?.id)!
            
            root.classList.toggle('show')
          }
        })
      }
    })
    
    const animate = () => {
      window.requestAnimationFrame(animate)
      
      modelController.css2Drenderer.render(modelController.scene, modelController.camera);
      modelController.renderer.render(modelController.scene, modelController.camera);
    }

    animate()
    
    modelRef.current.appendChild(modelController.renderer.domElement)
  }, [modelController])
  
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
                if (!modelController) return;
                
                const currentFloorGroup = modelController.floors.find(({floor}) => floor.userData.floorIndex === currentFloor);
                if (!currentFloorGroup) return;

                currentFloorGroup.floor.children.forEach((floorChild) => {
                  let opacity: number = 0;

                  switch (floorChild.name) {
                    case 'ground':
                      opacity = 1
                      break
                  }
                  
                  changeGroupOpacity(floorChild, opacity)
                })

                // hide all other elements
                modelController.floors.forEach((floorGroup) => {
                  if (floorGroup.floor.userData.floorIndex === currentFloorGroup.floor.userData.floorIndex) return;
                  
                  const tiles = floorGroup.floor.children
                    .map(groupChild => {
                      if (groupChild.name !== 'ground') return null;
                      return groupChild.children.filter(groundChild => groundChild.name === 'tile')
                    })
                    .filter(tile => tile)
                    .flat()

                  tiles.forEach(tile => {
                    if (!tile) return;
                    

                    const tileLabels = modelController.floors
                      .map(floor => floor.tiles
                      .map(tile => tile.userData.label))
                      .flat()

                    const userData = tile.userData as TileUserData;
                    const labelObject = tileLabels.find(label => label?.id === userData.label?.id)

                    if (labelObject) {
                      labelObject.elements.root.classList.remove('show')
                    }
                  })

                  changeGroupOpacity(floorGroup.floor, 0)
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
            if (!modelController) return;
            // go to default material values
            modelController.floors.forEach(floorGroup => {
              floorGroup.floor.children.forEach(floorChild => {
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