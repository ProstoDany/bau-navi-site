import { IDType } from './../../types/index';
import { FloorOptions, Worker } from "../../types/three";
import { FloorSeparator } from "./floorSeparator/FloorSeparator";
import { Tile } from "./Tile";
import { Wall } from "./wall/Wall";
import * as THREE from 'three';
import { WallObject } from "../../types/three/walls";
import { FloorSeparatorObject } from "../../types/three/separator";
import { Ground } from "./floorSeparator/Ground";
import { ShapeCirclePoint, ShapeStraightPoint } from "../../types/three/points";
import { StraightWall } from "./wall/StraightWall";
import { RoundedWall } from "./wall/RoundedWall";
import { Ceiling } from "./floorSeparator/Ceiling";
import { TileLabel } from '../components/tileLabel';
import { ModelObject } from './Index';

interface IFloor {
    addWorker: (worker: Worker) => void;
    removeWorker: (id: IDType) => void;
    focus: (duration: number) => void;
    walls: Wall[];
    tiles: Tile[];
    floorSeparators: FloorSeparator[];
    object: THREE.Group;
    floorOptions: FloorOptions;
    yPosition: number
}

export class Floor extends ModelObject<THREE.Group> implements IFloor {
    walls: Wall[];
    tiles: Tile[];
    children: ModelObject<THREE.Object3D>[];
    floorSeparators: FloorSeparator[];
    object: THREE.Group;
    floorOptions: FloorOptions;
    yPosition: number;

    constructor (floorOptions: FloorOptions, yPosition: number) {
        super();

        this.floorOptions = floorOptions;
        this.yPosition = yPosition;

        this.children = [];
        this.walls = [];
        this.tiles = [];
        this.floorSeparators = [];
        this.object = this.build();
    }

    hide(duration: number): void {
        this.children.forEach(child => child.hide(duration))
    }

    show(duration: number): void {
        this.children.forEach(child => child.show(duration))
    }

    highlight(color: string): void {

    }
    
    focus(duration: number) {
        this.children.forEach(child => {
            child instanceof Ground || child instanceof Tile 
            ? child.show(duration)
            : child.hide(duration);
        })
    };
    
    addWorker(worker: Worker) {
        const tile = new Tile(worker);
        tile.addLabel(TileLabel(worker));

        
        this.children.push(tile);
        this.tiles.push(tile);
        this.object.add(tile.object);
    }

    removeWorker(workerId: IDType) {
        const tile = this.tiles.find(tile => tile.worker.id === workerId);
        
        if (!tile) return;

        this.children = this.children.filter(child => child !== tile);
        this.object.remove(tile.object);
        this.tiles = this.tiles.filter(filterTile => filterTile.worker.id !== tile.worker.id);
    }

    protected build(): THREE.Group {
        this.object = new THREE.Group();

        this.object.position.y = this.yPosition;
        const wallObjects = this._buildWalls();
        const separators = this._buildSeparators();
        
        [...wallObjects, ...separators].forEach(element => this.object.add(element));

        return this.object;
    }
    
    private _buildWalls(): WallObject[] {
        const straightPoints = this.floorOptions.shape.points.filter(point => point.type === 'straight') as ShapeStraightPoint[];
        const circlePoints = this.floorOptions.shape.points.filter(point => point.type === 'circle') as ShapeCirclePoint[];
        const wallObjects: WallObject[] = []; 

        straightPoints.forEach((point, pointIndex) => {
            const nextPoint = pointIndex === straightPoints.length - 1 ? straightPoints[0] : straightPoints[pointIndex + 1];
            const straightWall = new StraightWall(this.floorOptions.height, 0, point.coordinate, nextPoint.coordinate);

            this.children.push(straightWall);
            this.walls.push(straightWall);
            wallObjects.push(straightWall.object)
        })

        circlePoints.forEach(point => {
            const roundedWall = new RoundedWall(this.floorOptions.height, 0,  point.radius, point.coordinate)

            this.children.push(roundedWall);
            this.walls.push(roundedWall);
            wallObjects.push(roundedWall.object);
        })

        return wallObjects;
    }

    private _buildSeparators(): FloorSeparatorObject[] {
        const ground = new Ground(this.floorOptions.shape.points)
        const ceiling = new Ceiling(this.floorOptions.shape.points, this.floorOptions.height)
    
        this.children.push(ground, ceiling);

        return [ground.object, ceiling.object];
    }
}