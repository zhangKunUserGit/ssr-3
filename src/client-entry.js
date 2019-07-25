import ReactDom from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import React from 'react';
import { Provider } from 'react-redux';
import 'normalize.css';
import './global.less';
import createApp from './createApp';

const { router, store } = createApp(window.__INITIAL_STORE__);

if (process.env.NODE_ENV === 'production') {
  Loadable.preloadAll().then(() => {
    ReactDom.hydrate(
      <Provider store={store}>
        <BrowserRouter>{router}</BrowserRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
} else {
  ReactDom.hydrate(
    <Provider store={store}>
      <BrowserRouter>{router}</BrowserRouter>
    </Provider>,
    document.getElementById('root')
  );
}
