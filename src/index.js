/* import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserProvider from './components/Context/UserContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
        <UserProvider>
          <App />
        </UserProvider>
    </Provider>
  // </React.StrictMode>
);


 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserProvider from './components/Context/UserContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Helmet, HelmetProvider } from 'react-helmet-async'; // ✅ استدعاء Helmet

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <HelmetProvider>
    {/* ✅ الميتا الثابتة اللي هتظهر في كل الصفحات */}
    <Helmet>
      <title>الموقع الرسمي لقداسة البابا شنوده الثالث</title>
      <meta
        name="description"
        content="Discover the official media archive of His Holiness Pope Shenouda III, featuring exclusive videos, audio speeches, official articles, books, Q&As, historical galleries, and daily events. A sacred digital archive preserving his spiritual legacy."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="الموقع الرسمي لقداسة البابا شنوده الثالث"
      />
      <meta
        property="og:description"
        content="Discover the official media archive of His Holiness Pope Shenouda III, featuring exclusive videos, audio speeches, official articles, books, Q&As, historical galleries, and daily events. A sacred digital archive preserving his spiritual legacy."
      />
      <meta
        property="og:image"
        content="https://www.popeshenouda.com/assets/default/Meta/og-cover.jpg"
      />
      <meta property="og:url" content="https://www.popeshenouda.com" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="الموقع الرسمي لقداسة البابا شنوده الثالث"
      />
      <meta
        name="twitter:description"
        content="Discover the official media archive of His Holiness Pope Shenouda III, featuring exclusive videos, audio speeches, official articles, books, Q&As, historical galleries, and daily events. A sacred digital archive preserving his spiritual legacy."
      />
      <meta
        name="twitter:image"
        content="https://www.popeshenouda.com/assets/default/Meta/og-cover.jpg"
      />

      {/* اللغة والاتجاه */}
      <html lang="en"  />
    </Helmet>

    {/* باقي التطبيق */}
    <Provider store={store}>
      <UserProvider>
        <App />
      </UserProvider>
    </Provider>
  </HelmetProvider>
  // </React.StrictMode>
);
