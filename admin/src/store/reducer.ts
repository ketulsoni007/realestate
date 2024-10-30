import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./Slices/authSlice";
import propertyReducer from "./Slices/propertySlice";
import countryReducer from "./Slices/countrySlice";
import stateReducer from "./Slices/stateSlice";
import cityReducer from "./Slices/citySlice";
import areaReducer from "./Slices/areaSlice";
import moduleReducer from "./Slices/moduleSlice";
import subModuleReducer from "./Slices/subModuleSlice";
import commonReducer from "./Slices/commonSlice";
import permissionReducer from "./Slices/permissionSlice";

const reducer = combineReducers({
  auth: persistReducer(
    {
      key: "auth",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: ['isLoggedIn','user','isToken'],
      timeout: 20000,
    },
    authReducer
  ),
  common: persistReducer(
    {
      key: "common",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: ['isSideBarList','isPermissionList'],
      timeout: 20000,
    },
    commonReducer
  ),
  property: persistReducer(
    {
      key: "property",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    propertyReducer
  ),
  country: persistReducer(
    {
      key: "country",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    countryReducer
  ),
  state: persistReducer(
    {
      key: "state",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    stateReducer
  ),
  city: persistReducer(
    {
      key: "city",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    cityReducer
  ),
  area: persistReducer(
    {
      key: "area",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    areaReducer
  ),
  module: persistReducer(
    {
      key: "module",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    moduleReducer
  ),
  subModule: persistReducer(
    {
      key: "subModule",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    subModuleReducer
  ),
  permission: persistReducer(
    {
      key: "permission",
      storage,
      keyPrefix: "estate-admin-",
      debug: false,
      whitelist: [],
      timeout: 20000,
    },
    permissionReducer
  ),
});

export default reducer;
