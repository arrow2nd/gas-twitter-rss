
/**
 * スプレッドシートから検索ワードを取得
 *
 * @return 検索ワード
 */
function getSearchWords () {
    const ss = SpreadsheetApp.getActiveSheet()
    const lastRow = ss.getLastRow() - 1
    const values = ss.getRange(2, 1, lastRow, 1).getValues()
    return values.map((e) => e[0])
}
