const React = require('react');
// import ReactDOM from 'react-dom/client'; // Correct import for React 18 and higher
const App = require('./client/App.jsx'); // Make sure the path and casing are correct
// const ReactDOM = require('react-dom/client')
const { createRoot } = require('react-dom/client');
require('./client/styles.css');
const { GoogleOAuthProvider } = require('@react-oauth/google');
const { store } = require('./client/store.js');
const { Provider } = require('react-redux');

// RE: Redux --- unsure of Provider should wrap around App and be inside GoogleOAuthProvider, or outside of OAuth & App
const container = document.getElementById('root'); // Get the root element
// console.log(container);
const root = createRoot(container); // Create a root
root.render(
  <GoogleOAuthProvider clientId='232840471473-ahk4ppges7oqaklig8ql1cuqtn9fkgmn.apps.googleusercontent.com'>
      {/* <Provider store={store}> */}
        <App />
      {/* </Provider> */}
    </GoogleOAuthProvider>
); // Render your App inside the root
