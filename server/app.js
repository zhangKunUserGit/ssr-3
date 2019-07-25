const Koa = require('koa');
const router = require('./router');
const path = require('path');
const render = require('./render');
const fs = require('fs');

const resolve = file => path.resolve(__dirname, file);
const app = new Koa();
const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const isPro = process.env.NODE_ENV === 'production';

let serverBundle;
let template;
let readyPromise;

if (isPro) {
  serverBundle = require('../build/server-bundle').default;
  template = fs.readFileSync(resolve('../build/server.template.ejs'), 'utf-8');
} else {
  readyPromise = require('../config/dev-server')(app, resolve('../src/server.template.ejs'));
}

router.get('*', async (ctx, next) => {
  if (isPro) {
    await render(ctx, serverBundle, template);
  } else {
    const { bundle, clientHtml } = await readyPromise;
    await render(ctx, bundle, clientHtml);
  }
  next();
});

app.use(require('koa-static')(path.join(__dirname, '../build')));
app.use(router.routes(), router.allowedMethods());

app.listen(config.port, () => {
  console.log(`node服务已启动，服务地址为：localhost:${config.port}`);
});
