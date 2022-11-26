import { WallCreator } from './wallCreator';
import * as THREE from 'three'
import { Floor, FloorObjects, Worker } from '../../types/three';
import { Tile, TileUserData } from '../../types/three/tile';
import { FloorSeparatorCreator } from './floorSeparatorCreator';
import { TileCreator } from './tileCreator';

interface FloorCreatorOptions {
    floor: Floor;
    yPosition: number;
    index: number;
    workers: Worker[],
    withTiles?: boolean;
    withTileLabels?: boolean; 
}

const defaultOptions: Pick<FloorCreatorOptions, 'withTiles' | 'withTileLabels'> = {
    withTileLabels: true,
    withTiles: true
}

abstract class AbstractFloorCreator {
    protected options: FloorCreatorOptions;
    protected floor: THREE.Group;
    protected wallCreator: WallCreator;
    protected separatorCreator: FloorSeparatorCreator;

    constructor(options: FloorCreatorOptions) {
        this.options = this._getDefaultOptions(options);
        this.floor = new THREE.Group();
        this.wallCreator = new WallCreator(
            options.floor.shape.points, 
            options.floor.height
        )
        this.separatorCreator = new FloorSeparatorCreator(
            options.floor.shape.points, 
            options.floor.height
        );
    }

    public abstract create(): FloorObjects;
    // Creates tile objects and if withTileLabels is equal to true also creates labels (but do not add them to the scene).
    protected abstract createTiles(): Tile[];

    private _getDefaultOptions(options: FloorCreatorOptions) {    
        return {
            ...options,
            withTileLabels: options.withTileLabels ?? defaultOptions.withTileLabels,
            withTiles: options.withTiles ?? defaultOptions.withTiles,
        }
    }
}

export class FloorCreator extends AbstractFloorCreator {
    public create(): FloorObjects {
        const ground = this.separatorCreator.createGround();
        const ceiling = this.separatorCreator.createCeiling();
        const walls = this.wallCreator.createWalls();
        let tiles: Tile[] = [];

        // adding tiles to ground separator
        if (this.options.withTiles) {
            tiles = this.createTiles()

            tiles.forEach(tile => {
                ground.add(tile)
                if (tile.userData?.label) {
                    // adding label
                    ground.add(tile.userData.label.CSS2DContainer);
                }
            })
        }

        this.floor.position.y = this.options.yPosition;
        this.floor.name = 'floor';
        this.floor.userData = {
            floorIndex: this.options.index
        };
        
        [ground, ceiling, walls].forEach(element => this.floor.add(element));

        return {
            floor: this.floor,
            ceiling,
            ground,
            walls,
            tiles
        }
    }

    protected createTiles(): Tile[] {
        const tiles = this.options.workers.map(worker => {
            const tileCreator = new TileCreator(worker);

            const tile = tileCreator.createTile();
            if (this.options.withTileLabels) {
                const label = tileCreator.createWorkerLabel();

                tile.userData = {
                    ...tile.userData,
                    label
                } as TileUserData
            } 

            return tile;
        })

        return tiles;
    }
}
