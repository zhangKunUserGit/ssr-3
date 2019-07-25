import { REMOVE_USER_INFO, SET_USER_INFO, EDIT_USER_INFO } from '../constants/actionTypes';

export default function userInfo(state = {}, action) {
  switch (action.type) {
    case SET_USER_INFO:
      return { ...state, ...action.value, status: 'add' };
    case EDIT_USER_INFO:
      return { ...state, ...action.value, status: 'edit' };
    case REMOVE_USER_INFO:
      return { status: 'remove' };
    default:
      return state;
  }
}
