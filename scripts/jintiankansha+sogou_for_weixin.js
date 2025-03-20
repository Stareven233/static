// ==UserScript==
// @name         merge jintiankansha+sogou
// @namespace    http://noe.cc/
// @version      2024-12-18
// @description  try to take over the world!
// @author       You
// @match        http://www.jintiankansha.me/column/*
// @match        https://www.jintiankansha.me/column/*
// @icon         https://www.jintiankansha.me/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  const doneMark = 'noed'
  const waitForAll = (selector, callback, waitTime = 10) => {
    let targets = null
    let count = 0
    const tackleOne = (t) => {
      // 若有标记，说明处理过，跳过
      if(t.hasAttribute(doneMark)) {
        return
      }
      callback(t)
      t.setAttribute(doneMark, '')
      count++
    }

    const loop = setInterval(() => {
      targets = document.querySelectorAll(selector)
      targets.forEach(tackleOne)
      if(count === 0) {
        return
      }
      console.log(`waitForAll: call ${callback} at ${count} ${selector}`)
      count = 0
    }, 500)

    setTimeout(() => {
      clearInterval(loop)
    }, waitTime * 1000)
  }

  const sogou_weixin_baseurl = 'https://weixin.sogou.com/weixin?type=2&query='
  waitForAll('#Main .entries table span.item_title', e => {
    let link = e.firstElementChild
    if (e.firstElementChild.className === 'hide-content') {
      link = document.createElement('a')
      link.innerText = e.firstElementChild.innerText
      link.target = '_blank'
    }
    link.href = sogou_weixin_baseurl + link.innerText
    e.innerHTML = link.outerHTML
  })
  waitForAll('iframe', e => e.remove())
})();
