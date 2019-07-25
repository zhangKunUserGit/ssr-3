import React, { Component } from 'react';
import { connect } from 'react-redux';

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
    class App extends Component {
      static serverBootstrapper(store, match, browserData) {
        const methods = mapStateToDispatch(store.dispatch);
        return WrappedComponent.serverBootstrapper(methods, match, browserData);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    return connect(
      mapStateToProps,
      mapStateToDispatch
    )(App);
  };
}
