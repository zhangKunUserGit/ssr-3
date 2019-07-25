import { SET_USER_INFO } from '../constants/actionTypes';

export function setUserInfo(value) {
  return {
    type: SET_USER_INFO,
    value
  };
}

export function userLogin(value) {
  return async dispatch => {
    console.log(111111);
    const info = await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'zhang',
          address: 'shanghai',
          ...value
        });
      }, 1000);
    });
    dispatch(setUserInfo(info));
    return info;
  };
}
