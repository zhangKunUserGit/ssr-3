module.exports.getSiteInfo = function getSiteInfo(site) {
  return require(`./${site}.js`);
};
