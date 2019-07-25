import { StaticRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { renderToString } from 'react-dom/server';
import { getBundles } from 'react-loadable/webpack';
import React from 'react';
import { Provider } from 'react-redux';
import { matchRoutes } from 'react-router-config';
import createApp from './createApp';

const stats =
  process.env.NODE_ENV === 'production' ? require('../build/react-loadable.json') : null;

export default (ctx, browserData) => {
  return new Promise(async (resolve, reject) => {
    const { router, store, routerConfig } = createApp();
    const matchedRoutes = matchRoutes(routerConfig, ctx.path);
    // 如果没有匹配上路由则返回404
    if (matchedRoutes.length <= 0) {
      return reject({ code: 404, message: 'Not Page' });
    }
    let promises;
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');
    if (process.env.NODE_ENV === 'production') {
      // Step2: 匹配路由，获取需要加载的Route组件（包含Loadable组件）
      const matchedComponents = matchedRoutes.map(item => {
        if (!item.route.component.preload) {
          return item.route.component;
        } else {
          return item.route.component.preload().then(res => {
            if (res.default) {
              return res.default;
            } else {
              let result;
              for (let i in res) {
                if (res.hasOwnProperty(i)) {
                  result = res[i].default;
                }
              }
              return result;
            }
          });
        }
      });
      const loadedComponents = await Promise.all(matchedComponents);
      try {
        // 等所有数据请求回来之后在render, 注意这里不能用ctx上的路由信息，要使用前端的路由信息
        promises = loadedComponents
          .filter(component => component.serverBootstrapper)
          .map(component => component.serverBootstrapper(store, { query: ctx.query }, browserData));
      } catch (e) {
        console.log(e);
      }
      let modules = [];
      Promise.all(promises)
        .then(() => {
          ctx.store = store; // 挂载到ctx上，方便渲染到页面上
          const appString = renderToString(
            <Loadable.Capture report={moduleName => modules.push(moduleName)}>
              <Provider store={store}>
                <StaticRouter location={ctx.path} context={ctx}>
                  {router}
                </StaticRouter>
              </Provider>
            </Loadable.Capture>
          );
          let bundles = getBundles(stats, modules);
          let scripts = bundles.filter(bundle => bundle.file.endsWith('.js'));
          let scriptMarkups = scripts
            .map(bundle => {
              return `<script src="/js/${bundle.file}"></script>`;
            })
            .join('\n');
          resolve({
            appString,
            scriptMarkups
          });
        })
        .catch(reject);
    } else {
      try {
        // 等所有数据请求回来之后在render, 注意这里不能用ctx上的路由信息，要使用前端的路由信息
        promises = matchedRoutes
          .filter(item => item.route.component.serverBootstrapper)
          .map(item =>
            item.route.component.serverBootstrapper(store, { query: ctx.query }, browserData)
          );
      } catch (e) {
        console.log(e);
      }
      Promise.all(promises)
        .then(() => {
          ctx.store = store; // 挂载到ctx上，方便渲染到页面上
          const appString = renderToString(
            <Provider store={store}>
              <StaticRouter location={ctx.path} context={ctx}>
                {router}
              </StaticRouter>
            </Provider>
          );
          resolve({
            appString,
            scriptMarkups: ''
          });
        })
        .catch(reject);
    }
  });
};
