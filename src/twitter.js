/**
 * ツイートを検索
 * @param {String} token ベアラートークン
 * @param {Array<String>} keywords キーワードの配列
 * @returns {Array} 検索結果の配列
 */
function fetchSearchResults(token, keywords) {
  const ignoreUserIds = getIgnoreUserIds()

  const params = keywords.map((e) => {
    const query = encodeURIComponent(`${e} -filter:retweets`)

    return {
      url: `https://api.twitter.com/1.1/search/tweets.json?q=${query}&count=10&result_type=recent&tweet_mode=extended`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const res = UrlFetchApp.fetchAll(params)

  const results = res.map((e, i) => {
    const json = JSON.parse(e.getContentText())

    // 該当ユーザーのツイートを除外
    const statuses = json.statuses.filter(
      (e) => !ignoreUserIds.includes(e.user.screen_name)
    )

    console.log(`${keywords[i]} : ${statuses.length}`)

    return {
      keyword: keywords[i],
      oembedHtmls: fetchOembedHTMLs(token, statuses),
      statuses
    }
  })

  return results
}

/**
 * 埋め込み用HTMLを取得
 * @param {String} token ベアラートークン
 * @param {Array} tweets ツイートの配列
 * @returns {Array} HTML要素の配列
 */
function fetchOembedHTMLs(token, tweets) {
  const params = tweets.map((e) => {
    const url = encodeURIComponent(
      `https://twitter.com/${e.user.screen_name}/status/${e.id_str}`
    )

    return {
      url: `https://publish.twitter.com/oembed?url=${url}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })

  const res = UrlFetchApp.fetchAll(params)
  return res.map((e) => JSON.parse(e.getContentText()).html)
}

/**
 * テンプレートに埋め込むデータを作成
 * @param {Array} searchResults 検索結果の配列
 * @returns {Arrays} 埋め込み用データ
 */
function createOembedItems(searchResults) {
  let results = []

  for (const { keyword, oembedHtmls, statuses } of searchResults) {
    const tmp = statuses.map((e, i) => {
      const id = e.id_str
      const screenName = e.user.screen_name

      const title = `【${keyword}】${truncate(e.full_text, 20)}`
      const url = `https://twitter.com/${screenName}/status/${id}`

      // 投稿日時をRSS用のフォーマットに直す
      const createdAt = Utilities.formatDate(
        new Date(e.created_at),
        'Asia/Tokyo',
        'E, d MMM YYYY HH:mm:ss Z'
      )

      // 添付画像がなければプロフィール画像を指定
      const imageUrl = e.entities.media
        ? e.entities.media[0].media_url_https
        : e.user.profile_image_url_https.replace('_normal', '_bigger')

      // 画像の拡張子を抽出（3, 4文字を想定）
      const imageExt = imageUrl.match(/\.([A-Za-z]{3,4}$)/)[1]

      return {
        id,
        userName: e.user.name,
        screenName,
        title,
        text: e.full_text,
        date: createdAt,
        url,
        imageUrl,
        imageExt,
        oembedHTML: oembedHtmls[i]
      }
    })

    results.push(tmp)
  }

  return new Array().concat(...results)
}
