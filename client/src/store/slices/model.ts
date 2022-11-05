import { BuildingModel } from './../../types/index';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModelInitialState {
    model: BuildingModel;
}

const initialState: ModelInitialState = {
    model: {
        floorHeight: 3,
        floorsNumber: 3,
        shape: [[-3, 3], [3, 3], [3, -3], [5, -7], [-3, -3]]
    }
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
                floorsNumber: 0,
                shape: []
            }
        }
    }
})