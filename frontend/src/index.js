
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import ShopContextProvider from '../../frontend/src/context/shopcontext.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ShopContextProvider >
    <App />
  </ShopContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
