type searchResult = {
  id: string
  userName: string
  screenName: string
  title: string
  text: string
  date: string
  url: string
  imageUrl: string
  imageExt: string
}

/**
 * 文字列を省略
 *
 * @param str 文字列
 * @param len 文字列長
 * @returns 省略した文字列
 */
function truncate(str: string, len: number): string {
  return str.length > len ? `${str.substr(0, len)}...` : str
}

/**
 * ツイート検索
 *
 * @param token ベアラートークン
 * @param keyword キーワード
 * @returns 検索結果オブジェクト
 */
function searchTweets(token: string, keyword: string): any[] {
  // RTを除外
  let query = encodeURIComponent(`${keyword} -filter:retweets`)

  const params = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const res = UrlFetchApp.fetch(
    `https://api.twitter.com/1.1/search/tweets.json?q=${query}&count=10&result_type=recent&tweet_mode=extended`,
    params
  )

  const json = JSON.parse(res.getContentText())

  return json.statuses
}

/**
 * 検索結果を取得
 *
 * @param token ベアラートークン
 * @param search 検索情報
 * @returns 検索結果
 */
function fetchSearchResults(
  token: string,
  keyword: string
): searchResult[] | null {
  const tweets = searchTweets(token, keyword)

  // 検索結果が無い
  if (tweets.length <= 0) {
    return null
  }

  const results: searchResult[] = tweets.map((e) => {
    const id: string = e.id_str

    const title: string = `【${keyword}】${truncate(e.full_text, 20)}`
    const screenName: string = e.user.screen_name

    // 投稿日時のRSS用のフォーマットに直す
    const createdAt = Utilities.formatDate(
      new Date(e.created_at),
      'Asia/Tokyo',
      'E, d MMM YYYY HH:mm:ss Z'
    )

    // 添付画像がなければプロフィール画像を指定
    const imageUrl: string = e.entities.media
      ? e.entities.media[0].media_url_https
      : e.user.profile_image_url_https.replace('_normal', '_bigger')

    // 画像の拡張子を抽出（3, 4文字を想定）
    const imageExt = imageUrl.match(/\.([A-Za-z]{3,4}$)/)[1]

    return {
      id: id,
      userName: e.user.name,
      screenName: screenName,
      title: title,
      text: e.full_text,
      date: createdAt,
      url: `https://twitter.com/${screenName}/status/${id}`,
      imageUrl: imageUrl,
      imageExt: imageExt
    }
  })

  return results
}

export { searchResult, fetchSearchResults }
