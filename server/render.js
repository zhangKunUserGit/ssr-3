const serialize = require('serialize-javascript');const { getCookie } = require('./utils/get');const { getCurrentSite } = require('./utils/site');const { getSiteInfo } = require('./constants/sites/index');const ejs = require('ejs');module.exports = async function(ctx, serverBundle, template) {  try {    const css = new Set();    const insertCss = (...styles) => {      styles.forEach(style => css.add(style._getCss()));    };    const currentSite = getCurrentSite(ctx.headers.host);    const siteInfo = getSiteInfo(currentSite);    const app = await serverBundle(      ctx,      {        currentSite,        siteInfo: getSiteInfo(currentSite),        cookie: getCookie(ctx.headers.cookie)      },      insertCss    );    ctx.body = ejs.render(template, {      initialStore: serialize(ctx.store.getState()),      currentSite: serialize(currentSite),      siteInfo: serialize(siteInfo),      appString: app.appString,      bundlesScript: app.scriptMarkups || '',      style: [...css].join('')      // title: seo.title ? `<title>${seo.title}</title>` : '',      // meta: seo.description ? `<meta name="description" content="${seo.description}">` : ''    });    // const body = render({    //   html,    //   store: `<script>window.__STORE__ = ${JSON.stringify(ctx.store.getState())}</script>`    // });    // ctx.body = body;    ctx.type = 'text/html';  } catch (err) {    console.error(err.message);    ctx.body = err.message;    ctx.type = 'text/html';  }};