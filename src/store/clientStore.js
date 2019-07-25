import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers/index';

export default function configureStore(preloadState) {
  return createStore(rootReducer, preloadState, applyMiddleware(thunkMiddleware));
}
