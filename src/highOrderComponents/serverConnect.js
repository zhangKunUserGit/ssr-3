import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getCurrentSite, getSiteInfo } from '../utils/site';

// 公共部分，在Node环境中无window document navigator 等对象
if (typeof window === 'undefined') {
  global.window = {};
  global.document = {};
}

export default function serverConnect(...params) {
  // 无参数
  if (params.length === 1 && typeof params[0] !== 'function') {
    return <div>1111</div>;
  }
  const mapStateToProps = params[0];
  const mapStateToDispatch = params[1];
  return WrappedComponent => {
    let currentSite = getCurrentSite();
    let siteInfo = getSiteInfo();
    class App extends Component {
      static serverBootstrapper(store, match, browserData) {
        const methods = mapStateToDispatch(store.dispatch);
        currentSite = browserData.currentSite;
        siteInfo = browserData.siteInfo;
        return WrappedComponent.serverBootstrapper(methods, match, browserData);
      }

      render() {
        return <WrappedComponent {...this.props} currentSite={currentSite} siteInfo={siteInfo} />;
      }
    }
    return connect(
      mapStateToProps,
      mapStateToDispatch
    )(App);
  };
}
