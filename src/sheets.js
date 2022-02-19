/**
 * 検索ワードを取得
 * @return {String[]} 検索ワード
 */
function getSearchWords() {
  return getValuesFromSS(1)
}

/**
 * 除外するユーザーIDを取得
 * @return {String[]} ユーザーID
 */
function getIgnoreUserIds() {
  return getValuesFromSS(2)
}

/**
 * スプレッドシートから値を取得
 * @param {Number} col 列番号
 * @return {String[]} 範囲内の値
 */
function getValuesFromSS(col) {
  const ss = SpreadsheetApp.getActiveSheet()

  const lastRow =
    ss
      .getRange(1, col)
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow() - 1

  const values = ss.getRange(2, col, lastRow).getValues()
  return values.flat()
}
