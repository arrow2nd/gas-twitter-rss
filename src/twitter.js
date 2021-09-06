/**
 * 文字列を省略
 *
 * @param {string} str 文字列
 * @param {number} len 文字列長
 * @returns 省略した文字列
 */
function truncate(str, len) {
  return str.length > len ? `${str.substr(0, len)}...` : str
}

/**
 * ツイートを検索
 *
 * @param {string} token ベアラートークン
 * @param {array} keywords キーワードの配列
 * @returns 検索結果の配列
 */
function fetchSearchResults(token, keywords) {
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
    const statuses = JSON.parse(e.getContentText()).statuses

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
 *
 * @param {string} token ベアラートークン
 * @param {array} tweets ツイートの配列
 * @returns HTML要素の配列
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
  const results = res.map((e) => JSON.parse(e.getContentText()).html)

  return results
}

/**
 * テンプレートに埋め込むデータを作成
 *
 * @param {array} searchResults 検索結果の配列
 * @returns 埋め込み用データ
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
