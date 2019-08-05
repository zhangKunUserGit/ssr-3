import React from 'react';
import { bindActionCreators } from 'redux';
import serverConnect from '../../../highOrderComponents/serverConnect';
import withStyles from '../../../highOrderComponents/withStyles';
import { userLogin } from '../actions/userActions';
import { PrimeHeader } from 'autobest-frontend-common';
import 'autobest-frontend-common/lib/index.css';
import '../styles/home.scss';
import s from '../styles/home.module.scss';

function getAssetUrl(value) {
  return `https://online-assets.test.autobestdevops.com/online/images//GPP${value}`;
}

@serverConnect(
  state => {
    return {
      userInfo: state.userInfo
    };
  },
  dispatch => bindActionCreators({ userLogin }, dispatch)
)
@withStyles(s)
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

  onLogout = () => {
    console.log('logout');
  };

  onSearch = () => {
    console.log('onSearch');
  };

  render() {
    const { siteInfo, currentSite } = this.props;
    return (
      <div>
        <PrimeHeader
          currentSite={currentSite}
          getAssetUrl={getAssetUrl}
          isLogined={false}
          isMobile={false}
          shoppingCount={3}
          siteInfo={siteInfo}
          onLogout={this.onLogout}
          onSearch={this.onSearch}
          containerClassName="container"
        />
        <button onClick={this.addUserInfo} className="btn">
          Add User Info
        </button>
        <span className={s.text}>11122111</span>
        Home page1
      </div>
    );
  }
}
