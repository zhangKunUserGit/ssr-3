module.exports.getCookie = function(cookie) {
  const result = {};
  if (!cookie) {
    return result;
  }
  const list = cookie.split(';');
  for (let i = 0, l = list.length; i < l; i++) {
    const pair = list[i].split('=');
    result[pair[0].trim()] = pair[1];
  }
  return result;
};
