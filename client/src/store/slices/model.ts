import { BuildingModel, IDType } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelInitialState {
    model: BuildingModel;
    selectedFloor: IDType;

}

const initialState: ModelInitialState = {
    model: {
        floorHeight: 3,
        floors: [
            {workers: []},
            {workers: []},
            {workers: []},
            {workers: []},
        ],
        shape: [[-3, 3], [3, 3], [3, -3], [-3, -3]]
    },
    selectedFloor: ''
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
        }
    }
})