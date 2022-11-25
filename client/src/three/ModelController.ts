
import { FloorObjects, BuildingModel, Worker } from '../types/three/index';
import { Floor } from "../types/three";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { FloorCreator } from './helpers/floorCreator';
import { getFloorYPosition } from './helpers/getFloorYPosition';

interface IModelController {
    options: ModelControllerOptions;
    model: BuildingModel;
    ref: React.RefObject<HTMLDivElement>;
    workers: Worker[];
    floors: FloorObjects[];
    camera: THREE.Camera;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    css2Drenderer: CSS2DRenderer;
}

interface ModelControllerOptions {
    sceneWidth: number;
    sceneHeight: number;
    fov: number;
}

abstract class AbstractModelController implements IModelController {
    options: ModelControllerOptions;
    model: BuildingModel;
    ref: React.RefObject<HTMLDivElement>;
    workers: Worker[];
    floors: FloorObjects[];
    camera: THREE.Camera;
    scene: THREE.Scene;
    css2Drenderer: CSS2DRenderer;
    renderer: THREE.WebGLRenderer;

    constructor(model: BuildingModel, workers: Worker[], ref: React.RefObject<HTMLDivElement>, options: ModelControllerOptions) {
        this.model = model;
        this.options = options;
        this.workers = workers
        this.ref = ref;
        this.floors = [];

        const {camera, renderer, scene, css2DRenderer} = this._init();
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.css2Drenderer = css2DRenderer;
    }

    public abstract render(): void;
    // creates floor
    public abstract buildFloor(floor: Floor, yPosition: number): FloorObjects;
    // adds floor to the scene
    public abstract addFloor(floor: THREE.Group): void;
    protected _initCssRenderer() {
        const labelRenderer = new CSS2DRenderer()
        labelRenderer.setSize(this.options.sceneWidth, this.options.sceneHeight)
        labelRenderer.domElement.style.position = 'absolute'
        labelRenderer.domElement.style.top = '0px'
        labelRenderer.domElement.style.pointerEvents = 'none'
        this.ref.current?.appendChild(labelRenderer.domElement);

        return labelRenderer
    }

    protected _init() {
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
        orbit.maxPolarAngle = Math.PI / 2
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
    public render(): THREE.Group[] {
        const floorHeights = this.model.floors.map(floor => floor.height);
        
        return this.model.floors.map((floor, index) => {
            const yPosition = getFloorYPosition(index, floorHeights);
            const {floor: floorGroup} = this.buildFloor(floor, yPosition);

            this.addFloor(floorGroup);

            return floorGroup;
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
        this.scene.add(floor);
    }
}