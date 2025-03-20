// ==UserScript==
// @name         pageViewImproved
// @name:en      pageViewImproved
// @namespace    http://noe.cc/
// @version      0.6.3
// @description  按期望定制页面显示效果
// @author       Noe
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @icon         https://blog-static.cnblogs.com/files/Stareven233/kuro.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  const use_remove_anything = true
  const doneMark = 'noed'
  const waitForOne = (selector, callback, interval=500, times=20, disableMark=false) => {
    let target = null
    const loop = setInterval(() => {
      target = document.querySelector(selector)
      if(target !== null && (disableMark || !target.hasAttribute(doneMark))) {
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

  function removeAnything () {
    let isFrozen = true
    const button = document.createElement('button')
    button.textContent = 'Unfreeze'
    const styles = {
      textAlign: 'left',
      position: 'fixed',
      height: '2rem',
      width: '5rem',
      borderRadius: '0.4rem',
      padding: '0.2rem 0.3rem',
      right: '-4.2rem',
      bottom: '60%',
      transition: 'right 0.15s ease-in-out',
      border: '1px solid #ff563f',
      cursor: 'pointer',
      zIndex: 60000, // 确保按钮在其他元素上方
    }
    Object.assign(button.style, styles)
    document.body.appendChild(button)

    let lastTarget = null
    let lastListener = null
    let lastEvent = { timeStamp: 0 }

    function highlightAndDelete(event) {
      if (isFrozen || event.timeStamp - lastEvent.timeStamp < 100) {
        return
      }
      lastEvent = event
      // 通过坐标找到当前鼠标所在的元素
      const target = document.elementFromPoint(event.clientX, event.clientY)

      if (!target || target === button || target === lastTarget) {
        return
      }

      if (target && target !== lastTarget) {
        if (lastTarget) {
          lastTarget.style.outline = '' // 移除之前的高亮
        }
        lastTarget = target
        lastTarget.style.outline = '4px solid #ff6644' // 高亮当前元素

        // 绑定点击事件以删除目标元素
        const removeClickListener = e => {
          if (e.target === button) {  // 确保不是在按钮上点击
            return
          }
          e.preventDefault()
          lastTarget.remove()
        }
        lastListener = removeClickListener
        document.addEventListener('click', removeClickListener, { once: true, capture: true })
      }
    }

    button.addEventListener('click', () => {
      isFrozen = !isFrozen
      button.textContent = isFrozen ? 'Unfreeze' : 'Freeze'
      if (!isFrozen) {
        // 每次解冻时重新开始监听
        document.addEventListener('mousemove', highlightAndDelete)
        return
      }
      // 冻结时移除事件监听
      document.removeEventListener('mousemove', highlightAndDelete)
      // 移除之前绑定的删除点击事件，以防止按钮被误删
      if (!lastListener) {
        return
      }
      document.removeEventListener('click', lastListener, { once: true, capture: true })
      lastTarget.style.outline = ''
      lastTarget = null
      lastListener = null
    })

    button.addEventListener('mouseover', function() {
      // 当鼠标移到上面时，将整个矩形显示出来
      button.style.right = '0px'
    })
    // 添加鼠标移开事件监听器
    button.addEventListener('mouseout', function() {
      // 当鼠标离开时，恢复初始状态（只露出三分之一）
      button.style.right = '-70px'
    })
  }
  if (use_remove_anything) {
    removeAnything()
  }

  waitForAll('.adsbygoogle', e => e.remove())

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

    case 'www.baicaimanhua.com': {
      if (!url.pathname.startsWith('/mhread.php')) {
        break
      }
      // 白菜漫画
      const mainStyles = {
        'display': 'flex',
        'flex-direction': 'row',
        'flex-wrap': 'wrap',
        'gap': '1%',
        'width': '60%',
        'margin-left': '20%',
      }
      waitForOne('#content > div > .comicpage', t => {
        Object.assign(t.style, mainStyles)
        for (const c of t.children) {
          if (!c.tagName === 'img') {
            continue
          }
          c.style.width = '49%'
          c.style.border = '1px solid #ff8833'
        }
      }, 2000, 10)
      waitForOne('body > div.header', t => t.remove())
      break
    }

    case 'www.icourse163.org': {
      // 方便作业互评：自动打分、填写评语并勾选答题者不可见
      if (!url.pathname.startsWith('/learn/')) {
        break
      }
      const btn = document.createElement('a')
      btn.className = 'u-btn'
      btn.addEventListener('click', event => {
        const grade = Math.ceil(Math.random() * 3 + 1)
        waitForOne('#courseLearn-inner-box .j-homework-box .j-answer.answer', elem => {
          elem.querySelector('.j-content > div.j-list.list .detail > .s').children[grade].children[0].checked = true
          elem.querySelector('.j-comment.comment .answerVisible.f-fl > .j-acb').checked=false
          elem.querySelector('.j-comment.comment .j-commentRichOrText.detail .j-textarea.inputtxt').value='乌拉'
        }, 500, 2, true)
      })
      btn.innerText = 'FUCK'
      btn.style.backgroundImage = '-webkit-gradient(linear, left top, left bottom, from(#fcadd3), to(#f7738b))'
      btn.style.border = 'none'
      btn.style.color = 'white'
      waitForOne('#courseLearn-inner-box .j-homework-box .bottombtnwrap.f-cb.j-btnwrap', e => e.appendChild(btn))
    }

    case 'console.volcengine.com': {
      // 登录记住用户名密码
      if (!url.pathname.startsWith('/auth/login')) {
        break
      }
      // localStorage.setItem('login-username', 'n?')
      waitForOne('#Identity_input', e => e.value = localStorage.getItem('login-username'))
    }

    case 'space.bilibili.com': {
      // 自动跳页
      if (!url.pathname.startsWith('/118938280/search')) {
        break
      }
      const page = localStorage.getItem('227')
      // localStorage.setItem('227', 13)
      if (!page) {
        waitForOne('#app > main > .space-search > .search-content .video-header > .video-header__top > .title', e => e.innerText += '\t还未设定跳转页数！先执行：localStorage.setItem(`227`, pageID)')
        return
      }
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true
      })
      waitForOne('#app > main > .space-search > .search-content .video-footer .vui_pagenation-go input.vui_input__input', e => {
        e.value = page
        e.dispatchEvent(enterEvent)
      })
    }

    default:
      break
  }
})()
