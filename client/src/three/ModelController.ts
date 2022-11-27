
import { FloorObjects, BuildingModel, Worker, RaycasterHandler } from '../types/three/index';
import { Floor } from "../types/three";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { FloorCreator } from './helpers/floorCreator';
import { getFloorYPosition } from './helpers/getFloorYPosition';

interface IModelController {
    model: BuildingModel;
    floors: FloorObjects[];
    workers: Worker[];
}

interface ModelControllerOptions {
    sceneWidth: number;
    sceneHeight: number;
    fov: number;
}

interface THREEEntities {
    camera: THREE.Camera;
    scene: THREE.Scene;
    css2DRenderer: CSS2DRenderer;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
}

abstract class AbstractModelController implements IModelController {
    public workers: Worker[];
    public floors: FloorObjects[];
    public model: BuildingModel;
    protected options: ModelControllerOptions;
    protected ref: React.RefObject<HTMLDivElement>;
    public three: THREEEntities;
    

    constructor(model: BuildingModel, workers: Worker[], ref: React.RefObject<HTMLDivElement>, options: ModelControllerOptions) {
        this.model = model;
        this.options = options;
        this.workers = workers
        this.ref = ref;
        this.floors = [];
        this.three = this._init();
    }

    protected abstract render(): void;
    // protected abstract animate(): void;
    // creates floor
    public abstract buildFloor(floor: Floor, yPosition: number): FloorObjects;
    // adds floor created floor to the scene
    public abstract addFloor(floor: THREE.Group): void;
    // sets orbit target on computed point
    public abstract changeTargetFloor(floorNumber: number): void;

    private _initCssRenderer() {
        const labelRenderer = new CSS2DRenderer()
        labelRenderer.setSize(this.options.sceneWidth, this.options.sceneHeight)
        labelRenderer.domElement.style.position = 'absolute'
        labelRenderer.domElement.style.top = '0px'
        labelRenderer.domElement.style.pointerEvents = 'none'
        this.ref.current?.appendChild(labelRenderer.domElement);

        return labelRenderer
    }

    private _init() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.options.sceneWidth, this.options.sceneHeight);
        renderer.setPixelRatio(devicePixelRatio)
        renderer.setClearColor('lightblue');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            this.options.fov,
            this.options.sceneWidth / this.options.sceneHeight,
            0.1,
            1000
        );
        camera.position.set(30, 20, 30);
        
        const orbit = new OrbitControls(camera, renderer.domElement);
        orbit.maxPolarAngle = Math.PI / 2.15
        orbit.target = new THREE.Vector3(
            0, 
            getFloorYPosition(this.model.floors.length - 1, this.model.floors.map(({height}) => height)) / 2, 
            0)
        orbit.update();

        const axesHelper = new THREE.AxesHelper(15);
        scene.add(axesHelper);

        const css2DRenderer = this._initCssRenderer();
        
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: '#777777', side: THREE.DoubleSide })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -0.5 * Math.PI
        ground.position.y = -0.1
        scene.add(ground)

        return {
            camera,
            scene, 
            renderer,
            orbit,
            css2DRenderer
        }
    }
}

export class ModelController extends AbstractModelController {
    constructor (model: BuildingModel, workers: Worker[], ref: React.RefObject<HTMLDivElement>, options: ModelControllerOptions) {
        super(model, workers, ref, options);

        this.render();
        this.ref.current?.appendChild(this.three.renderer.domElement);

        const animate = () => {
            window.requestAnimationFrame(animate)

            this.three.css2DRenderer.render(this.three.scene, this.three.camera);
            this.three.renderer.render(this.three.scene, this.three.camera);
        }
        animate();
    }

    

    protected render(): void {
        const floorHeights = this.model.floors.map(floor => floor.height);
        
        this.model.floors.forEach((floor, index) => {
            const yPosition = getFloorYPosition(index, floorHeights);
            const {floor: floorGroup} = this.buildFloor(floor, yPosition);
            this.addFloor(floorGroup);
        })
    }

    public buildFloor(floor: Floor, yPosition: number): FloorObjects {
        const floorIndex = this.model.floors.findIndex(currentFloor => currentFloor === floor);

        const floorCreator = new FloorCreator({
            floor,
            yPosition,
            index: floorIndex,
            workers: this.workers.filter(worker => worker.floor - 1 === floorIndex)
        });
        const floorGroup = floorCreator.create();

        this.floors.push(floorGroup)
        return floorGroup
    }

    public addFloor(floor: THREE.Group): void {
        this.three.scene.add(floor);
    }

    public changeTargetFloor(floorIndex: number): void {
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
}