/**
 * 根据 当前时间组装版本号，”年月日时“的形式
 * @returns {string}
 */
function getCurrentVersion() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  return `${year}${getCompleteVal(month)}${getCompleteVal(day)}${getCompleteVal(hour)}`;
}

/**
 * 补全小于10的数字，例如： 9 =》 09
 * @param val
 * @returns {string}
 */
function getCompleteVal(val) {
  return val < 10 ? `0${val}` : val;
}

module.exports = getCurrentVersion;
