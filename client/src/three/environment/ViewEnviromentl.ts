import { Orbit } from './../Orbit';
import { BuildingModel, Worker } from "../../types/three";
import { Environment } from "./Environment";
import * as THREE from 'three';
import { getFloorYPosition } from "../helpers/getFloorYPosition";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Floor } from "../objects/Floor";
import gsap from 'gsap'
import { CameraWrapper } from '../objects/cameras/CameraWrapper';


interface THREEViewEnvEntities {
    camera: CameraWrapper;
    scene: THREE.Scene;
    css2DRenderer: CSS2DRenderer;
    renderer: THREE.WebGLRenderer;
    orbit: Orbit;
}


interface IViewEnvironment {
    model: BuildingModel;
    workers: Worker[];
    three: THREEViewEnvEntities;
    run: () => void;
}

export class ViewEnvironment extends Environment implements IViewEnvironment {
    model: BuildingModel;
    workers: Worker[];
    three: THREEViewEnvEntities;
    floors: Floor[];

    constructor (element: HTMLDivElement, camera: CameraWrapper, model: BuildingModel, workers: Worker[]) {
        super(element, camera);
        this.model = model;
        this.workers = workers;
        
        this.three = this.init();
        this.floors = this.build();

        const animate = () => {
            window.requestAnimationFrame(animate)

            this.three.css2DRenderer.render(this.three.scene, this.three.camera.entity);
            this.three.renderer.render(this.three.scene, this.three.camera.entity);
        }
        animate();
    }

    run() {
        this.floors.forEach((floor, index) => {
            this.three.scene.add(floor.object);
            floor.object.userData = {floorIndex: index}
        })
    }

    focusOnFloor(floorIndex: number): void {
        const focusDuration = 1;

        if (this.model.floors[floorIndex]) {
            const floor = this.model.floors[floorIndex];
            const yPosition = getFloorYPosition(
                floorIndex, 
                this.model.floors.map(floor => floor.height
            ));
            const [x, y, z] = [floor.shape.shapeCenterPoint[0], 10 * (floorIndex + 1) + 20, floor.shape.shapeCenterPoint[1]];

           
            setTimeout(() => {
                this.floors.forEach((floor, index) => {
                    if (index === floorIndex) {
                      floor.focus(focusDuration)
                    } else {
                      floor.hide(focusDuration)
                    }
                })
            }, (focusDuration * 1000) / 2)
              
            this.three.camera.goTo(
                [x, y, z], 
                focusDuration,
                () => this.three.orbit.controls.update(),
                () =>  {
                    this.three.orbit.focus([x, yPosition, z])
                    this.three.orbit.controls.update()
                }
            )

        } else {
            this.floors.forEach(floor => {
                floor.show(focusDuration);
            })

            this.three.camera.goToStartPosition(
                focusDuration, 
                () => this.three.orbit.controls.update(),
                () =>  {
                    this.three.orbit.unfocus()
                    this.three.orbit.controls.update()
                }
            )

            setTimeout(() => {
                this.three.orbit.unfocus()
                this.three.orbit.controls.update()
            }, focusDuration * 1000)
        }
    }

    protected build(): Floor[] {
        const floors = this.model.floors.map((floorOptions, index) => {
            const floor = new Floor(
                floorOptions,
                getFloorYPosition(index, this.model.floors.map(floor => floor.height))
            );

            const floorWorkers = this.workers.filter(worker => worker.floor === index + 1);

            floorWorkers.forEach(worker => {
                floor.addWorker(worker);
            })

            return floor;
        })

        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: '#777777', side: THREE.DoubleSide })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -0.5 * Math.PI
        ground.position.y = -0.1
        this.three.scene.add(ground)

        return floors;
    }
    
    protected init() {
        const {camera, renderer, scene} = super.init();
        
        const orbit = new Orbit([
            this.model.centerPoint[0], 
            getFloorYPosition(this.model.floors.length - 1, this.model.floors.map(({height}) => height)) / 2, 
            this.model.centerPoint[1]
        ], camera.entity, renderer);

        const axesHelper = new THREE.AxesHelper(15);
        scene.add(axesHelper);

        const css2DRenderer = this.initCssRenderer();

        this.element.appendChild( renderer.domElement )

        return {
            camera,
            scene, 
            renderer,
            css2DRenderer,
            orbit
        }
    }
}