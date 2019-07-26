let siteInfo = null;
let currentSite = null;

export function setCurrentSite(value) {
  currentSite = value;
}

export function getCurrentSite() {
  return currentSite || process.env.CURRENT_SITE;
}

export function setSiteInfo(value) {
  siteInfo = value;
}

export function getSiteInfo() {
  return siteInfo || process.env.SITE_INFO;
}
