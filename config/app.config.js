const getCurrentVersion = require('./appVersion');

const localConfig = {
  ApiServiceUrl: 'http://127.0.0.1:8080',
  AssetServiceUrl: 'https://assets.test.autobestdevops.com', // 静态资源路径
  ToolsUrl: 'http://198.2.36.100:8125',
  OldToolsUrl: 'http://198.2.36.100:8125',
  OldBackendUrl: 'http://admin.gpg.com',
  AppInsightsKey: '8ac082ed-a7cc-4aef-a587-f80188db22e8'
};

const devConfig = {
  ApiServiceUrl: 'https://apw.dev.autobestdevops.com/checkoutapi',
  // ApiServiceUrl: 'http://192.168.7.45:8090/',
  AssetServiceUrl: 'https://online-assets.dev.autobestdevops.com/online/images/', // 静态资源路径
  ToolsUrl: 'http://198.2.36.100:8125',
  OldToolsUrl: 'http://198.2.36.100:8125',
  OldBackendUrl: 'http://admin.gpg.com',
  AppInsightsKey: '8ac082ed-a7cc-4aef-a587-f80188db22e8'
};

const testConfig = {
  ApiServiceUrl: 'https://gpgbkapi.test.autobestdevops.com',
  AssetServiceUrl: 'https://assets.test.autobestdevops.com', // 静态资源路径
  ToolsUrl: 'https://autobesttool.test.autobestdevops.com',
  OldToolsUrl: 'https://autobesttool.test.autobestdevops.com',
  OldBackendUrl: 'http://173.82.21.4:55248',
  AppInsightsKey: '4be26000-2c97-4fc8-bc6a-35bba89a79ef'
};

// 迁移环境配置，后期可删除
const moveConfig = {
  ApiServiceUrl: 'https://movegpgbkapi.test.autobestdevops.com',
  AssetServiceUrl: 'https://assets.test.autobestdevops.com', // 静态资源路径
  OldToolsUrl: 'http://173.82.21.4:55398',
  ToolsUrl: 'https://moveautobesttool.test.autobestdevops.com',
  OldBackendUrl: 'http://173.82.21.4:55248',
  AppInsightsKey: '4be26000-2c97-4fc8-bc6a-35bba89a79ef'
};

const prodConfig = {
  ApiServiceUrl: 'https://adminapi.genuinepartsgiant.com',
  AssetServiceUrl: 'https://assets.genuinepartsgiant.com', // 静态资源路径
  ToolsUrl: 'https://autobesttool.genuinepartsgiant.com',
  OldToolsUrl: 'http://216.240.149.31',
  OldBackendUrl: 'https://admin.genuinepartsgroup.com',
  AppInsightsKey: '61c9558e-e35e-44eb-bcc1-c425d0b768f3'
};

module.exports = function() {
  let config = {};
  const env = process.env.REACT_APP_ENV || 'dev';
  switch (env.trim()) {
    default:
    case 'local':
      config = localConfig;
      break;
    case 'dev':
      config = devConfig;
      break;
    case 'test':
      config = testConfig;
      break;
    case 'prod':
      config = prodConfig;
      break;
    case 'move':
      config = moveConfig;
      break;
  }
  // 环境变量的版本号, debug没有版本号
  if (process.env.NODE_ENV === 'production') {
    config.CurrentVersion = getCurrentVersion();
  }
  return config;
};
