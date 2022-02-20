/**
 * 文字列を省略
 * @param {String} str 文字列
 * @param {Number} len 文字列長
 * @return {String} 省略した文字列
 */
function truncate(str, len) {
  return str.length > len ? `${str.slice(0, len)}...` : str
}

/**
 * URLパラメータを作成
 * @param {Object} params パラメータ
 * @return {String} URLパラメータ
 */
function createUrlParam(params) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}
