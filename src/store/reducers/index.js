import { combineReducers } from 'redux';
import userInfoReducers from '../../modules/home/reducers/index';

export default combineReducers({
  ...userInfoReducers
});
