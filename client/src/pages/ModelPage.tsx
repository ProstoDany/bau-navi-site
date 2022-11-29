import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { modelSlice } from '../store/slices/model';
import FloorButton from '../components/FloorButton';
import { RaycasterHandler } from '../types/three';
import { Raycaster } from '../three/Raycaster';
import { ViewEnvironment } from '../three/environment/ViewEnviromentl';


const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const [env, setEnv] = useState<ViewEnvironment>();
  const dispatch = useTypedDispatch()
  
  useEffect(() => {
    if(!modelRef.current) return; 
    const sceneWidth = modelRef.current.offsetWidth;
    const sceneHeight = modelRef.current.offsetHeight;

    const camera = new THREE.PerspectiveCamera(
      50,
      sceneWidth / sceneHeight,
      0.1,
      1000
    );
    camera.position.set(30, 20, 30);

    const env = new ViewEnvironment(modelRef.current, camera, model, workers); 
    env.run();
    setEnv(env);

    const raycaster = new Raycaster(env.three.camera, env.three.scene.children, sceneWidth, sceneHeight);

    const handleTileClick: RaycasterHandler = (intersects: THREE.Intersection[]) => {
      if (intersects.length) {
        intersects.forEach(intersect => {
          if (intersect.object.name !== 'tile') return;
          // for every tile
          env.floors.map(floor => floor.tiles)
            .flat()
            .forEach(tile => {
              // checking if intersecting object is tile
              if (intersect.object === tile.object) {
                // picking hide or show label
                if (tile.label?.data.elements.root.classList.contains('show')) {
                  tile.label?.hide()
                } else {
                  tile.label?.show()
                }
              }
          })
        })
      }
    }
    raycaster.addListener('click', handleTileClick)

    return () => {
      raycaster.clearListeners();
    }
  }, [])
  
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
                if (!env) return;
                
                const currentFloorGroup = env.floors.find(({object}) => object.userData.floorIndex === floorIndex);
                if (!currentFloorGroup) return;

                currentFloorGroup.object.children.forEach((floorChild) => {
                  let opacity: number = 0;

                  switch (floorChild.name) {
                    case 'ground':
                      opacity = 1
                      break
                  }
                  
                  changeGroupOpacity(floorChild, opacity)
                })

                // hide all other elements
                env.floors.forEach((floorGroup) => {
                  if (floorGroup.object.userData.floorIndex === currentFloorGroup.object.userData.floorIndex) return;
                  
                  const tiles = floorGroup.object.children
                    .map(groupChild => {
                      if (groupChild.name !== 'ground') return null;
                      return groupChild.children.filter(groundChild => groundChild.name === 'tile')
                    })
                    .filter(tile => tile)
                    .flat()

                  tiles.forEach(tile => {
                    if (!tile) return;
                    

                    const tileLabels = env.floors
                      .map(floor => floor.tiles
                      .map(tile => tile.object.userData.label))
                      .flat()

                    const userData = tile.userData as TileUserData;
                    const labelObject = tileLabels.find(label => label?.id === userData.label?.id)

                    if (labelObject) {
                      labelObject.elements.root.classList.remove('show')
                    }
                  })

                  changeGroupOpacity(floorGroup.object, 0)
                })

                gsap.to(env.three.camera.position, {
                  y: 10 * (floorIndex + 1) + 20,
                  z: floor.shape.shapeCenterPoint[1],
                  x: floor.shape.shapeCenterPoint[0],
                  duration: .4,
                  onStart() {
                    console.log(1)
                    env.three.camera.lookAt(10, -500, 10)
                    env.three.camera.updateMatrixWorld()
                  }
                  
                }).then(() => env.changeTargetFloor(floorIndex))
              }}
            />
          </React.Fragment>
        ))}
        <button
          className='model__sidebar-btn'
          onClick={() => {
            dispatch(modelSlice.actions.removeSelection())
            if (!env) return;
            // go to default material values
            env.floors.forEach(floorGroup => {
              floorGroup.object.children.forEach(floorChild => {
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
                  env.changeTargetFloor(-1);
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