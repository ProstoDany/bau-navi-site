import { generateUUID } from 'three/src/math/MathUtils';
import { Intersection, Object3D, Event } from "three";
import { RaycasterHandler } from "../types/three";
import * as THREE from 'three';
import { IDType } from "../types";


interface IRaycaster {
    addListener: (eventName: keyof WindowEventMap , handler: RaycasterHandler) => any;
    removeListener: (eventName: keyof WindowEventMap , id: IDType) => any;
    clearListeners: () => any;
    intersects: THREE.Intersection[];
    mousePosition: THREE.Vector3;
    raycaster: THREE.Raycaster;
}

export class Raycaster implements IRaycaster {
    intersects: Intersection<Object3D<Event>>[];
    raycaster: THREE.Raycaster;
    mousePosition: THREE.Vector3;
    private _camera: THREE.Camera;
    private _intersectedObjects: THREE.Object3D[];
    private _activeHandlers: {
        id: IDType; 
        eventName: keyof WindowEventMap;
        handler: (e: any) => any
    }[] ;

    constructor (camera: THREE.Camera, intersectedObjects: THREE.Object3D[], sceneWidth: number, sceneHeight: number) {
        this.intersects = [];  
        this.mousePosition = new THREE.Vector3();
        this.raycaster= new THREE.Raycaster();
        
        this._camera = camera;
        this._intersectedObjects = intersectedObjects
        this._activeHandlers = [];

        window.addEventListener('mousemove', (event) => {
            this.mousePosition.x = ( event.clientX / sceneWidth ) * 2 - 1;
            this.mousePosition.y = - ( event.clientY / sceneHeight ) * 2 + 1;
        })
    }

    addListener(eventName: keyof WindowEventMap, handler: RaycasterHandler): IDType {
        const rootHandler = () => {
            this.raycaster.setFromCamera(this.mousePosition, this._camera);
            this.intersects = this.raycaster.intersectObjects(this._intersectedObjects);
            handler(this.intersects);
        }
        
        const id = generateUUID();

        this._activeHandlers.push({
            id, 
            handler: rootHandler,
            eventName
        })

        window.addEventListener(eventName, rootHandler);

        return id
    }

    removeListener(eventName: keyof WindowEventMap, id: IDType) {
        const activeHandler = this._activeHandlers.find(handler => handler.id === id);
        
        if (!activeHandler) return;

        this._activeHandlers = this._activeHandlers.filter(handler => handler.id !== id);
        window.removeEventListener(eventName, activeHandler.handler);
    }

    clearListeners() {
        this._activeHandlers.forEach(({eventName, id}) => {
            this.removeListener(eventName, id);
        })
    }
}