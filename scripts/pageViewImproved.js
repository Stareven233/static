// ==UserScript==
// @name         pageViewImproved
// @name:en      pageViewImproved
// @namespace    noetu
// @version      0.5.1
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

  const doneMark = 'noed'
  const waitForOne = (selector, callback, interval=500, times=20) => {
    let target = null
    const loop = setInterval(() => {
      target = document.querySelector(selector)
      if(target !== null && !target.hasAttribute(doneMark)) {
        callback(target)
        console.log(`waitForOne: call ${callback} at 1 ${selector}`)
        target.setAttribute(doneMark, '')
      }
    }, interval)
    if(typeof times !== 'number') {
      return
    }
    // times不是次数就当做要无限查找
    setTimeout(() => {
      clearInterval(loop)
    }, interval*times)
  }

  const waitForAll = (selector, callback, waitTime=10) => {
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
    }, waitTime*1000)
  }

  const url = new URL(document.URL)
  switch(url.hostname) {
    case 'mangarawjp.com': {
      waitForAll("iframe", t => t.remove())
      break
    }

    case 'zh-v2.d2l.ai': {
      // 某一本深度学习的书

      if(!url.pathname.startsWith('/chapter_')) {
        break
      }
      const ejectArea = document.createElement("a")
      const ejectIcon = document.createElement("i")
      ejectIcon.className = 'material-icons'
      ejectIcon.innerHTML = 'eject'
      ejectArea.appendChild(ejectIcon)
      document.querySelector('#button-show-source').parentElement.appendChild(ejectArea)
      ejectArea.className = 'mdl-button mdl-js-button mdl-button--icon'
      ejectArea.addEventListener('click', e => {
        document.querySelector('.mdl-layout__header.mdl-layout__header').remove()
        document.querySelectorAll('.mdl-layout__drawer').forEach(x => {
          x.remove()
        })
        const pageStyle = document.createElement("style")
        pageStyle.innerHTML = `
                    .mdl-layout__container > .mdl-layout.mdl-js-layout.mdl-layout--fixed-header > .mdl-layout__content {
                        margin-left: 0px;
                    }
                    .document > .page-content > .section p {
                        font-size: 1.4rem;
                    }
                `
        document.head.append(pageStyle)
      })
      break;
    }

    case 'zhuanlan.zhihu.com':
    case 'www.zhihu.com': {
      // 知乎

      // const start_time = Date.now()
      // let modals = null, flag = false, btn
      // const loop = setInterval(function () {
      //   modals = document.querySelectorAll('.Modal-wrapper')
      //   modals.forEach(m => {
      //     btn = m.querySelector('.Modal-closeButton')
      //     flag = Boolean(btn)
      //     btn.click()
      //   })
      //   if(flag || Date.now() - start_time >= 10000) {
      //     clearInterval(loop)
      //   }
      // }, 200)
      // .Post-RichTextContainer Catalog
      break
    }

    case 'www.iot2ai.top':{
      if(!url.pathname.startsWith('/cgi-bin/intel/syosetu.html')) {
        break
      }
      const pageStyle = document.createElement("style")
      pageStyle.innerHTML = `
        #novel_color {
            margin: 0 10%;
            font-family: Microsoft YaHei;
        }
        #novel_honbun {
            font-size: 20px;
        }
        #novel_a {
            font-size: 18px;
            border-top: 1px solid #f19d63;
        }
        .novel_subtitle {
            font-size: 30px;
            text-align: center;
        }
        .novel_bn {
            display: flex;
            justify-content: space-around;
        }
      `
      document.head.append(pageStyle)
      console.log(pageStyle)
      break
    }

    case 'mp.weixin.qq.com': {
      // 微信公众号文章页面

      if(!url.pathname.startsWith('/s')) {
        return
      }

      document.querySelector("#page-content > div").style.maxWidth = "1000px"
      waitForOne("#js_pc_qr_code", t => t.remove())
  
      const placeholderStyle = document.createElement('style')
      placeholderStyle.innerText = `
        .js_img_placeholder {
          display: none !important;
        }
      `
      document.head.appendChild(placeholderStyle)

      // waitForAll(".rich_pages.wxw-img, .js_img_placeholder", img => {
      waitForAll(".js_img_placeholder.wx_img_placeholder", img => {
        // if(img.tagName !== 'IMG') {
        //   const i = document.createElement('img')
        //   i.src = img.dataset.src
        //   img.parentElement.appendChild(i)
        //   img.remove()
        //   // nt微信会把一些图片放在span中
        // }
        img.src = img.dataset.src
        img.style.display = 'inline-block'
        img.classList.remove('js_img_placeholder')
        img.classList.remove('wx_img_placeholder')
      })

      const textTagName = new Set(['SPAN', 'P', 'SECTION'])
      waitForAll("#js_content *", s => {
        const origin_size = parseInt(s.style.fontSize)
        if (!textTagName.has(s.tagName) || isNaN(origin_size)) {
          return
        }
        s.style.fontFamily = "Microsoft YaHei"
        // s.style.color = "#000000"
        s.style.fontSize = `${origin_size + 3}px`
      })
      break
    }

    case 'www.manmanju.com': {
      // 漫漫聚，看漫画的

      waitForOne('#fix_bottom_dom', t => t.remove())
      break;
    }
  
    case 'pc.xuexi.cn': {
      if (!url.pathname.startsWith('/points/exam-paper-detail.html')) {
        break
      }
      // 学习强国-专项答题
      waitForOne('#app .layout-body .detail-body > div.question .tips', t => {
        const antPopover = document.querySelector('#body-body .ant-popover')
        if (antPopover === null || antPopover.classList.contains('ant-popover-hidden')) {
          t.click()
        }
        setTimeout(() => {
          console.log('t :>> ', t)
          t.removeAttribute(doneMark)
          console.log('t :>> ', t)
        }, 500)
      }, 2000, 'inf')
      // waitForOne('#body-body .ant-popover.ant-popover-hidden', t => {
      //   // t.style.display = 'block'
      // }
      waitForOne('#body-body .ant-popover .ant-popover-inner .line-feed', t => t.style.userSelect = 'text')
      // const clickTips = () => document.querySelector('#app .detail-body .action-row > button').click()
      // waitForOne('#app .detail-body .action-row > button', t => t.addEventListener('click', setTimeout(clickTips, 500)))
      break
    }

    case 'www.icourse163.org': {
      // 方便作业互评：自动打分、填写评语并勾选答题者不可见
      if (!url.pathname.startsWith('/learn/')) {
        break
      }
      const btn = document.createElement('a')
      btn.className = 'u-btn f-fl'
      btn.addEventListener('click', event => {
        waitForOne('#courseLearn-inner-box .j-homework-box .j-answer.answer .j-content > div.j-list.list .detail > .s', e => e.children[4].children[0].checked=true, 500, 2)
        waitForOne('#courseLearn-inner-box .j-homework-box .j-answer.answer .j-comment.comment .answerVisible.f-fl > .j-acb', e => e.checked=false, 500, 2)
        waitForOne('#courseLearn-inner-box .j-homework-box .j-answer.answer .j-comment.comment .j-commentRichOrText.detail .j-textarea.inputtxt', e => e.value='乌拉', 500, 2)
      })
      btn.innerText = 'FUCK'
      btn.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(#fcadd3), to(#f7738b))'
      btn.style.border = 'none'
      btn.style.color = 'white'
      waitForOne('#courseLearn-inner-box .j-homework-box .bottombtnwrap.f-cb.j-btnwrap', e => e.appendChild(btn))
    }
    default:
      break
  }
})()
