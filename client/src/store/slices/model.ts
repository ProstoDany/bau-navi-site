import { IDType, Worker } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuildingModel } from '../../types/model';

interface ModelInitialState {
    model: BuildingModel;
    selectedFloor: number | null;
    workers: Worker[]
}

const initialState: ModelInitialState = {
    model: {
        floors: [
            {id: '1', height: 10, shape: {
                shapeCenterPoint: [5, 5],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 7]},
                    {type: 'straight', coordinate: [7, 7]},
                    {type: 'circle', coordinate: [7, 7], radius: 6},
                    {type: 'straight', coordinate: [7, 0]},
                ]
            }},
            {id: '2', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [7, 7], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
            {id: '3', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [7, 7], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
             {id: '4', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [7, 7], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
            {id: '5', height: 4, shape: {
                shapeCenterPoint: [5, 5],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 7]},
                    {type: 'straight', coordinate: [7, 7]},
                    {type: 'circle', coordinate: [7, 7], radius: 6},
                    {type: 'straight', coordinate: [7, 0]},
                ]
            }},
        ],
    },
    selectedFloor: null,
    workers: [
        {id: '2', coordinates: [19, 19], floor: 2, tile: {color: 'blue'}, name: 'Anton', age: 17},
        {id: '3', coordinates: [0, 0], floor: 3, tile: {color: 'red'}, name: 'Oleh', age: 38},
    ]
};

export const modelSlice = createSlice({
    initialState,
    name: 'model',
    reducers: {
        setModel(state, action: PayloadAction<BuildingModel>) {
            state.model = action.payload
        },
        
        deleteModel(state) {
            state.model = {
                floors: [],
            }
            state.selectedFloor = null;
            state.workers = [];
        },

        addWorker(state, action: PayloadAction<Worker>) {
            state.workers.push(action.payload);
        },

        removeWorker(state, action: PayloadAction<IDType>) {
            state.workers = state.workers.filter(worker => worker.id !== action.payload)
        },

        selectFloor(state, action: PayloadAction<number>) {
            state.selectedFloor = action.payload
        },

        removeSelection(state) {
            state.selectedFloor = null;
        }
    }
})