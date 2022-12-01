import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { modelSlice } from '../store/slices/model';
import FloorButton from '../components/FloorButton';
import { RaycasterHandler } from '../types/three';
import { Raycaster } from '../three/Raycaster';
import { ViewEnvironment } from '../three/environment/ViewEnviromentl';
import { PerspectiveCameraWrapper } from '../three/objects/cameras/PerspectiveCameraWrapper';


const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const [env, setEnv] = useState<ViewEnvironment>();
  const dispatch = useTypedDispatch()
  
  useEffect(() => {
    if(!modelRef.current) return; 
    const sceneWidth = modelRef.current.offsetWidth;
    const sceneHeight = modelRef.current.offsetHeight;

    const camera = new PerspectiveCameraWrapper(
      50,
      sceneWidth / sceneHeight,
      0.1,
      1000,
      [30, 20, 30]
    );

    const env = new ViewEnvironment(modelRef.current, camera, model, workers); 
    env.run();
    setEnv(env);

    const raycaster = new Raycaster(env.three.camera.entity, env.three.scene.children, sceneWidth, sceneHeight);

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
        {model.floors.map((floorOptions, floorIndex) => (
          <React.Fragment key={floorOptions.id}>
            <FloorButton 
              floorIndex={floorIndex} 
              animationHandler={() => {
                if (!env) return;
                
                env.focusOnFloor(floorIndex)
              }}
            />
          </React.Fragment>
        ))}
        <button
          className='model__sidebar-btn'
          onClick={() => {
            dispatch(modelSlice.actions.removeSelection())
            if (!env) return;

            env.focusOnFloor(-1)          
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