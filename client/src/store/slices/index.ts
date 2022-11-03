import { modelSlice } from './model';
import { combineReducers } from '@reduxjs/toolkit'

export const rootReducer = combineReducers({
    buildingModel: modelSlice.reducer
});