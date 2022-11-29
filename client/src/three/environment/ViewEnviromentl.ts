import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BuildingModel, Worker } from "../../types/three";
import { Environment } from "./Environment";
import * as THREE from 'three';
import { getFloorYPosition } from "../helpers/getFloorYPosition";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Floor } from "../objects/Floor";


interface THREEViewEnvEntities {
    camera: THREE.Camera;
    scene: THREE.Scene;
    css2DRenderer: CSS2DRenderer;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
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

    constructor (element: HTMLDivElement, camera: THREE.Camera, model: BuildingModel, workers: Worker[]) {
        super(element, camera);
        this.model = model;
        this.workers = workers;
        
        this.three = this.init();
        this.floors = this.build();

        const animate = () => {
            window.requestAnimationFrame(animate)

            this.three.css2DRenderer.render(this.three.scene, this.three.camera);
            this.three.renderer.render(this.three.scene, this.three.camera);
        }
        animate();
    }

    run() {
        this.floors.forEach(floor => {
            this.three.scene.add(floor.object);
        })
    }

    changeTargetFloor(floorIndex: number): void {
        if (this.model.floors[floorIndex]) {
            const yPosition = getFloorYPosition(
                floorIndex, 
                this.model.floors.map(floor => floor.height
            ));
    
            const centerPoints = this.model.floors[floorIndex].shape.shapeCenterPoint;
                
            this.three.orbit.target = new THREE.Vector3(centerPoints[0], yPosition, centerPoints[1]);
        } else {
            this.three.orbit.target = new THREE.Vector3(0, 0, 0);
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
        
        const orbit = new OrbitControls(camera, renderer.domElement);
        orbit.maxPolarAngle = Math.PI / 2.15
        orbit.target = new THREE.Vector3(
            0, 
            getFloorYPosition(this.model.floors.length - 1, this.model.floors.map(({height}) => height)) / 2, 
            0
        );
        orbit.update();

        const axesHelper = new THREE.AxesHelper(15);
        scene.add(axesHelper);

        const css2DRenderer = this.initCssRenderer();

        this.element.appendChild( renderer.domElement )

        return {
            camera,
            scene, 
            renderer,
            orbit,
            css2DRenderer
        }
    }
}