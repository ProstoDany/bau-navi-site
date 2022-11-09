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
            {id: '1'},
            {id: '2'},
            {id: '3'},
            {id: '4'},
            {id: '5'},
            {id: '6'},
            {id: '7'},
            {id: '8'},
            {id: '9'},
            {id: '10'},
            {id: '11'},
            {id: '12'},
            {id: '13'},
        ],
        shape: [[0, 0], [0, 6], [6, 6], [6, 0]]
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