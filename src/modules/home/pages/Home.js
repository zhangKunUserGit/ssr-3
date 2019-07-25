import React from 'react';
import { bindActionCreators } from 'redux';
import serverConnect from '../../../highOrderComponents/serverConnect';
import { userLogin } from '../actions/userActions';

@serverConnect(
  state => {
    return {
      userInfo: state.userInfo
    };
  },
  dispatch => bindActionCreators({ userLogin }, dispatch)
)
export default class Home extends React.Component {
  static serverBootstrapper(methods, match, browserData) {
    const { userLogin } = methods;
    return Promise.all([
      userLogin({
        country: 'china'
      }),
      userLogin({
        age: 20
      })
    ]);
  }

  addUserInfo = () => {
    this.props.userLogin({
      age: 18
    });
  };

  render() {
    console.log(this.props);
    console.log(process.env);
    return (
      <div>
        <button onClick={this.addUserInfo}>Add User Info</button>
        Home page1
      </div>
    );
  }
}
