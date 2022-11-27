import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { modelSlice } from '../store/slices/model';
import FloorButton from '../components/FloorButton';
import gsap from 'gsap'
import { changeGroupOpacity } from '../gsap/changeGroupOpacity';
import { ModelController } from '../three/ModelController';
import { TileUserData } from '../types/three/tile';
import { Label } from '../types';
import { RaycasterHandler } from '../types/three';
import { Raycaster } from '../three/Raycaster';


const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const [modelController, setModelController] = useState<ModelController>();
  const dispatch = useTypedDispatch()
  
  useEffect(() => {
    if(!modelRef.current) return; 
    const sceneWidth = modelRef.current.clientWidth;
    const sceneHeight = modelRef.current.clientHeight;

    const controller = new ModelController(model, workers, modelRef, {
      fov: 40,
      sceneHeight,
      sceneWidth
    }) 

    if (!modelController) return setModelController(controller);

    const raycaster = new Raycaster(modelController.three.camera, modelController.three.scene.children, sceneWidth, sceneHeight);

    
    const handleTileClick: RaycasterHandler = (intersects: THREE.Intersection[]) => {
      console.log(intersects)
      if (intersects.length) {
        // Getting tile labels from floors object
        const tileLabels: Label[] = modelController.floors
            .map(floor => floor.tiles
            .map(tile => tile.userData.label))
            .flat()

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
    }
    raycaster.addListener('click', handleTileClick)

    return () => {
      raycaster.clearListeners();
    }
  }, [modelController])
  
  return (
    <div className='model'>
      {/* three js canvas */}
      <div className="model__content" ref={modelRef}></div>
      <div className='model__sidebar'>
        {model.floors.map((floor, floorIndex) => (
          <React.Fragment key={floor.id}>
            <FloorButton 
              floorIndex={floorIndex} 
              animationHandler={() => {
                if (!modelController) return;
                
                const currentFloorGroup = modelController.floors.find(({floor}) => floor.userData.floorIndex === floorIndex);
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

                gsap.to(modelController.three.camera.position, {
                  y: 10 * (floorIndex + 1) + 20,
                  z: floor.shape.shapeCenterPoint[1],
                  x: floor.shape.shapeCenterPoint[0],
                  duration: .4,
                  onStart() {
                    console.log(1)
                    modelController.three.camera.lookAt(10, -500, 10)
                    modelController.three.camera.updateMatrixWorld()
                  }
                  
                }).then(() => modelController.changeTargetFloor(floorIndex))
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
                  modelController.changeTargetFloor(-1);
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