import { BuildingModel, IDType, Worker } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelInitialState {
    model: BuildingModel;
    selectedFloor: number | null;
    workers: Worker[]
}

const initialState: ModelInitialState = {
    model: {
        floorHeight: 3,
        floors: [
            {},
            {},
            {},
            {},
        ],
        shape: [[-3, 3], [3, 3], [3, -3], [-3, -3]]
    },
    selectedFloor: null,
    workers: []
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
                floorHeight: 0,
                floors: [],
                shape: []
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