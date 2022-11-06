import { configureStore } from "@reduxjs/toolkit"
import { rootReducer } from "./slices"


export const setupStore = () => {
    return configureStore({ 
        reducer: rootReducer,
    })
}