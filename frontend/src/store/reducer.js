import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./Slices/authSlice";
import uiReducer from "./Slices/uiSlice";
import dataReducer from "./Slices/dataSlice";
import propertyReducer from "./Slices/propertySlice";

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage,
      keyPrefix: "estate-client-",
      debug: false,
      whitelist: ['isLoggedIn','user','isToken'],
      timeout: 20000,
    },
    authReducer
  ),
  ui: persistReducer(
    {
      key: "ui",
      storage,
      keyPrefix: "estate-client-",
      debug: false,
      whitelist: ['darkMode'],
      timeout: 20000,
    },
    uiReducer
  ),
  data: persistReducer(
    {
      key: "data",
      storage,
      keyPrefix: "estate-client-",
      debug: false,
      timeout: 20000,
    },
    dataReducer
  ),
  property: persistReducer(
    {
      key: "property",
      storage,
      keyPrefix: "estate-client-",
      debug: false,
      timeout: 20000,
    },
    propertyReducer
  ),
});

export default reducer;
