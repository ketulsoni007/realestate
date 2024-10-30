import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import {store,persistor} from "./store"
import { AnimatePresence } from "framer-motion";
import { PersistGate } from "redux-persist/integration/react";
import 'react-toastify/dist/ReactToastify.css';
import CustomToast from "./components/CustomToast/CustomToast";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AnimatePresence>
          <App />
          <CustomToast />
        </AnimatePresence>
        </PersistGate>
      </Provider>
    </Router>
  </React.StrictMode>
);
