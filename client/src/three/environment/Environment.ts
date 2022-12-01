import { CameraWrapper } from './../objects/cameras/CameraWrapper';
import { Camera } from "three";
import * as THREE from 'three';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";


interface IEnvironment {
    camera: CameraWrapper;
    element: HTMLDivElement;
}

export abstract class Environment implements IEnvironment {
    camera: CameraWrapper;
    element: HTMLDivElement;
    protected width: number;
    protected height: number;

    constructor (element: HTMLDivElement, camera: CameraWrapper) {
        this.camera = camera;
        this.element = element;

        this.width = element.clientWidth;
        this.height = element.clientHeight;
    }

    public abstract run(): any;
    protected abstract build(): any;

    protected init() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(this.width, this.height);
        renderer.setPixelRatio(devicePixelRatio)
        renderer.setClearColor('lightblue');

        const camera = this.camera;
        const scene = new THREE.Scene();

        return {
            camera,
            scene, 
            renderer,
        }
    }

    protected initCssRenderer() {
        const labelRenderer = new CSS2DRenderer()
        labelRenderer.setSize(this.width, this.height)
        this.element.appendChild(labelRenderer.domElement);

        labelRenderer.domElement.style.position = 'absolute'
        labelRenderer.domElement.style.top = '0px'
        labelRenderer.domElement.style.pointerEvents = 'none'

        return labelRenderer
    }
}