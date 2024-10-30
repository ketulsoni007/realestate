import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import { persistor, store } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-toastify/dist/ReactToastify.css';
import CustomToastAdmin from "./components/CustomToastAdmin/CustomToastAdmin";
import 'react-quill/dist/quill.snow.css';
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <StrictMode> */}
        <HelmetProvider>
          <BrowserRouter>
            <Suspense>
              <App />
              <CustomToastAdmin />
            </Suspense>
          </BrowserRouter>
        </HelmetProvider>
      {/* </StrictMode> */}
    </PersistGate>
  </Provider>
);
