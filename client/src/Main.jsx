import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../src/index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './AppContextProvider';
import { UserContextProvider } from './UserContextProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
