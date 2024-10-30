import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist/es/constants";
import reducer from "./reducer"; // Adjust import as necessary

// Define the store with typed reducer and custom middleware configuration
const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persistence-related actions
      },
    }),
});

// Create the persistor to persist store state
const persistor = persistStore(store);

// Export the store and persistor for use in the application
export { store, persistor };

// Export RootState and AppDispatch for typed usage throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed versions of useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
