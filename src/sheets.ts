const ss = SpreadsheetApp.getActiveSheet()
const lastRow = ss.getLastRow() - 1

/**
 * スプレッドシートから検索ワードを取得
 *
 * @return 検索ワード
 */
export const getSearchWords = (): string[] => {
  const values = ss.getRange(2, 1, lastRow, 1).getValues()
  const results: string[] = values.map((e) => e[0])

  return results
}
