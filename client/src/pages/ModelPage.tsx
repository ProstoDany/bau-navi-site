import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTypedDispatch, useTypedSelector } from '../hooks/redux';
import { threeInit } from '../three';
import FloorButton from '../components/FloorButton';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { modelSlice } from '../store/slices/model';
import gsap from 'gsap'
import { createFloor } from '../three/helpers/createFloor';
import { changeGroupOpacity } from '../gsap/changeGroupOpacity';

const floorGroups: THREE.Group[] = [];

let camera: THREE.Camera;
let scene: THREE.Scene;
let renderer: THREE.Renderer;

const ModelPage = () => {
  const modelRef = useRef<HTMLDivElement>(null);
  const {model, selectedFloor, workers} = useTypedSelector(state => state.buildingModel)
  const dispatch = useTypedDispatch()

  useEffect(() => {
    if(!modelRef.current) return; 
    // console.log(first)
    const threeInitValues = threeInit(modelRef.current.clientWidth, modelRef.current.clientHeight)

    camera = threeInitValues.camera;
    scene = threeInitValues.scene;
    renderer = threeInitValues.renderer;

    const raycaster = new THREE.Raycaster()
    const mousePosition = new THREE.Vector2();

    // ground creation
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: '#777777', side: THREE.DoubleSide })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -0.5 * Math.PI
    ground.position.y = -0.1
    scene.add(ground)

    model.floors.forEach((floor, floorIndex) => {
      const yPosition = model.floors.reduce((acc, floor, reduceIndex) => {
        return floorIndex > reduceIndex ? acc += floor.height : acc += 0
      }, 0)
      const floorWorkers = workers.filter(worker => worker.floor === floorIndex + 1);
      const floorObject = createFloor(floor, floorWorkers, yPosition, floorIndex);

      floorGroups.push(floorObject)
      scene.add(floorObject)
    })
  
    window.addEventListener('mousemove', (event) => {
      if (!modelRef.current) return;
      
      mousePosition.x = ( event.clientX / modelRef.current.clientWidth ) * 2 - 1;
      mousePosition.y = - ( event.clientY / modelRef.current.clientHeight ) * 2 + 1;
    })
    
    function animate() {
      window.requestAnimationFrame(animate)
      
      raycaster.setFromCamera(mousePosition, camera)
      // reverse intersects array it is sorted from farrest to nearest,
      // so loop ends in farrest object. If reverse intersects then loop ends in nearest object.
      const intersects = raycaster.intersectObjects( scene.children ).reverse();
      
      // for ( let i = 0; i < intersects.length; i ++ ) {
      //   // if some floor is hovered
      //   if (intersects[i].object.name.includes('floorWall')) {
      //     // index of hovered floor
      //     const activeFloorIndex = +intersects[i].object.name.split(' ')[1];
      //     walls.forEach((floorWalls, floorIndex) => {
      //         floorWalls.forEach(wall => {
      //           // if hovered floor
      //           if (activeFloorIndex === floorIndex) {
      //             // @ts-ignore
      //             wall.material.color.set( 0xff0000 );
      //           } else {
      //             // @ts-ignore
      //             wall.material.color.set( 0xcccccc );
      //           }
      //         })
      //     })
      //   } else {
      //     // run through all walls and set their color to default color
      //     walls.forEach(floorWalls => {
      //       floorWalls.forEach(wall => {
      //         // @ts-ignore
      //         wall.material.color.set( 0xcccccc );
      //       })
      //     })
      //   }
      // }

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
              
                gsap.to(camera.position, {
                  y: 10 * (currentFloor + 1) + 20,
                  z: floor.shape.shapeCenterPoint[1],
                  x: floor.shape.shapeCenterPoint[0],
                  duration: .4,
                  onStart: function() {
                    camera.lookAt(10, -1000, 10)
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