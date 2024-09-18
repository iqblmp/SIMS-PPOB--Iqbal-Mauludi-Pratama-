import { configureStore } from "@reduxjs/toolkit"

//slice
import informationSlice from "./informationSlice"
import sessionReducer from "./sessionSlice"

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    information: informationSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
