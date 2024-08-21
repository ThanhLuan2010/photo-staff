// src/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import auth from "./slice/auth.slice.tsx";
import history from './slice/historyRequestCoupon.slice.tsx'
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth,
  history
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
