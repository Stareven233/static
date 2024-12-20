// ==UserScript==
// @name         pixiv novel
// @namespace    http://noe.cc/
// @version      2024-12-18
// @description  try to take over the world!
// @author       You
// @match        https://www.pixiv.net/novel/show.php?id=*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

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

  const saveAsText = (text, name) => {
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

  // const content = document.querySelector("#root .charcoal-token main > section .charcoal-token main")
  waitForOne(document, "#root .charcoal-token main > section .charcoal-token main", e => {
    const title = document.querySelector("#root > div.charcoal-token main > section h1")
    const author = document.querySelector("#root .charcoal-token aside > section h2 > div > div > a > div")
    const meta = title.parentElement.innerText
    const content = `${window.location.href}\n\n${meta}\n\n---\n${e.innerText}`
    const filename = `${title.innerText}@${author.innerText}`
    title.addEventListener('click', () => {saveAsText(content, filename)})
    title.style.cursor = 'pointer'
    title.style.color = '#1bb01a'
  })
})()
