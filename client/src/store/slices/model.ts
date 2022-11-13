import { BuildingModel, IDType, Worker } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [8, 8], radius: 6},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
            {id: '2', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [8, 8], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
            {id: '3', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [8, 8], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
             {id: '4', height: 5, shape: {
                shapeCenterPoint: [3, 3],
                points: [
                    {type: 'straight', coordinate: [0, 0]},
                    {type: 'straight', coordinate: [0, 6]},
                    {type: 'straight', coordinate: [6, 6]},
                    {type: 'circle', coordinate: [8, 8], radius: 5},
                    {type: 'straight', coordinate: [6, 0]},
                ]
            }},
        ],
    },
    selectedFloor: null,
    workers: [
        {id: '1', coordinates: [20, 20], floor: 4},
        {id: '2', coordinates: [0, 0], floor: 2}
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