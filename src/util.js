/**
 * 文字列を省略
 * @param {string} str 文字列
 * @param {number} len 文字列長
 * @return {string} 省略した文字列
 */
function truncate(str, len) {
  return str.length > len ? `${str.slice(0, len)}...` : str
}

/**
 * URLパラメータを作成
 * @param {any} params パラメータ
 * @return {string} URLパラメータ
 */
function createUrlParam(params) {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}
