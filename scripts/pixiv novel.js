// ==UserScript==
// @name         pixiv novel
// @namespace    http://noe.cc/
// @version      2025-3-20
// @description  try to take over the world!
// @author       You
// @match        https://www.pixiv.net/novel/show.php?id=*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict'

  const novelID = /\?id=(\d+)$/.exec(window.location.href)[1]
  const contentSelector = '#root .charcoal-token main > section .charcoal-token main'
  const contentReg = new RegExp(`<meta name="preload-data" id="meta-preload-data" content='(\{.+\})'>`)

  const waitForOne = (source, selector, callback, interval = 500, times = 20) => {
    let target = null
    const loop = setInterval(() => {
      target = source.querySelector(selector)
      if(target !== null) {
        callback(target)
        console.log(`waitForOne: call ${callback} at 1 ${selector}`)
        clearInterval(loop)
      }
    }, interval)
    if(typeof times !== 'number') {
      return
    }
    // times不是次数就当做要无限查找
    setTimeout(() => {
      clearInterval(loop)
    }, interval * times)
  }

  const saveAsText = (name, text) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    const objectURL = URL.createObjectURL(blob)
    const aTag = document.createElement('a')
    aTag.href = objectURL
    aTag.download = `${name}.txt`
    aTag.click()
    URL.revokeObjectURL(objectURL)
  }

  setTimeout(
    () => { document.querySelectorAll('iframe').forEach(e => e.remove())},
    6000
  )

  const parsePage = e => {
    // 无法处理需要翻页的情况
    const series = document.querySelector('#root > .charcoal-token main > section > div > div > div > div > a')
    const title = document.querySelector('#root > .charcoal-token main > section div h1')
    const author = document.querySelector('#root .charcoal-token aside > section h2 > div > div > a > div')
    const meta = title.parentElement.innerText
    const seriesName = series ? series.innerText.replaceAll(' ', '') : ''
    const filename = `${seriesName} ${title.innerText}@${author.innerText}`
    const content = `${window.location.href}\n\n${meta}\n\n---\n${e.innerText}`
    // let nextBtn = document.querySelector('#root > div.charcoal-token main > section .gtm-novel-work-footer-pager-next')
    title.addEventListener('click', () => {saveAsText(filename, content)})
    title.style.cursor = 'pointer'
    title.style.color = '#1bb01a'
  }

  const parseRequested = () => {
    // 直接请求本页面，拿到所有文本
    const title = document.querySelector('#root > .charcoal-token main > section div h1')
    // <meta name="preload-data" id="meta-preload-data" content='
    const parseDate = t => {
      const utcDate = new Date(t)
      return utcDate.toLocaleString()
    }
    const parseTags = tags => {
      return tags.map(t => `#${t.tag}`).join('\t')
    }
    const parseDesc = desc => {
      return desc.replaceAll('&lt;br /&gt;', '\n').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    }
    const parseContentJSON = c => {
      const j = JSON.parse(c)
      const o = j.novel[novelID]
      let series = ''
      // /[a-z](?=\d)/g：此正则表达式匹配任意小写字母，不过前提是该字母后面紧跟着一个数字。 
      // (?=\d)：这就是前向肯定断言，它表明匹配的字母后面必须是一个数字，但数字本身不会被包含在匹配结果中。
      let meta = `
        ${o.title}\n
        ${o.characterCount}字    共${o.pageCount}页    ${o.readingTime}秒\n
        ${parseDesc(o.description)}\n
        ${parseTags(o.tags.tags)}\n
        点赞${o.likeCount}    收藏${o.bookmarkCount}    观看${o.viewCount}    评论${o.commentCount}
        创建: ${parseDate(o.createDate)}    更新: ${parseDate(o.uploadDate)}
      `.replaceAll(/\n +/g, '\n').trim('\n')
      if (o.seriesNavData !== null) {
        series = `${o.seriesNavData.title}#${o.seriesNavData.order} `
        meta = `${o.seriesNavData.title}\n${meta}`
      }
      const filename = `${series}${o.title}@${o.userName}`
      const content = `${window.location.href}\n\n${meta}\n---\n\n${o.content}`
      return [filename, content]
    }
    // 使用 GM_xmlhttpRequest 进行请求
    GM_xmlhttpRequest({
      method: 'GET',
      url: window.location.href,
      onload: resp => {
        if (resp.status === 200) {
          // <meta name="preload-data" id="meta-preload-data" content='{"timestamp":"2025-03-20T17:39:40+09:00"}'>
          const ret = contentReg.exec(resp.responseText)[1]
          const [n, c] = parseContentJSON(ret)
          title.addEventListener('click', () => {saveAsText(n, c)})
          title.style.cursor = 'pointer'
          title.style.color = '#ffb061'
        } else {
          title.style.color = '#ffa7d1'
          console.error('请求失败:', resp.response)
        }
      },
      onerror: function(error) {
        title.style.color = '#ff6161'
        console.error('请求发生错误:', error)
      }
    })
  }

  waitForOne(document, contentSelector, parseRequested)
})()
