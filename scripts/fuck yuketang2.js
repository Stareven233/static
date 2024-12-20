// ==UserScript==
// @name         fuck yuketang
// @name:en      fuck yuketang
// @namespace    xxx
// @version      0.0.1
// @description  按期望定制页面显示效果
// @author       Noe
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @icon         https://blog-static.cnblogs.com/files/Stareven233/kuro.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const doneMark = 'xxx'
  const waitForOne = (selector, callback, interval=500, times=10, disableMark=false) => {
    let target = null
    const loop = setInterval(() => {
      target = document.querySelector(selector)
      if(target !== null && (disableMark || !target.hasAttribute(doneMark))) {
        callback(target)
        target.setAttribute(doneMark, '')
        clearInterval(loop)
      }
    }, interval)
    if(typeof times !== 'number') {
      return
    }
    setTimeout(() => {
      clearInterval(loop)
    }, interval*times)
  }

  const url = new URL(document.URL)
  switch(url.hostname) {
    case 'fzuyjsy.yuketang.cn': {
      const next = () => {
        const [_, root, path] = /(.*?)\/(\d+)$/.exec(window.location.href)
        window.location.href = `${root}/${parseInt(path) + 1}`
      }
      waitForOne('#video-box > div > xt-wrap > video', v => {
        const volumeBtn = v.parentElement.querySelector('xt-controls > xt-inner > xt-volumebutton > xt-icon')
        volumeBtn.click()
        v.play()
        setTimeout(next, (v.duration + 5)*1000)
      }, 2000, 5)
    }
    default:
      break
  }
})()
