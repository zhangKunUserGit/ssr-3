import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';

export default function serverConnect(...params) {
  const styles = params[0];
  return WrappedComponent => {
    class App extends Component {
      static serverBootstrapper(store, match, browserData) {
        return WrappedComponent.serverBootstrapper(store, match, browserData);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    if (process.env.NODE_ENV === 'production') {
      return withStyles(styles)(App);
    }
    return App;
  };
}
