const reactTreeWalker = require('react-tree-walker');

const defaultContext = {
  reactAsyncBootstrapperRunning: true
};

// TODO:: 这个暂时不使用
/**
 * 在react中使用bootstrap函数，
 * 在服务端运行时，先执行bootstrap并把执行后的值返回
 * 最后在渲染页面
 * @param app
 * @param options
 * @param context
 * @returns {Promise<*>}
 */
module.exports = async function asyncBootstrapper(app, options, context = {}) {
  let value = null;
  const visitor = (element, instance) => {
    if (instance && typeof instance.bootstrap === 'function') {
      return instance.bootstrap().then(data => {
        value = data;
      });
    }
    return undefined;
  };

  await reactTreeWalker(app, visitor, Object.assign({}, context, defaultContext), options);
  return value;
};
