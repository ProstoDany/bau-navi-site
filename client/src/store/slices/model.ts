import { IDType } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuildingModel, FloorOptions, Worker } from '../../types/three';
import workers from '../../json/workers.json';
import floors from '../../json/floors.json';


interface ModelInitialState {
    model: BuildingModel;
    selectedFloor: number | null;
    workers: Worker[]
}
const initialState: ModelInitialState = {
    model: {
        floors: floors as FloorOptions[],
    },
    selectedFloor: null,
    workers: workers as Worker[],
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