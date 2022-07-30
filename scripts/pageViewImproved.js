// ==UserScript==
// @name         pageViewImproved
// @name:en      pageViewImproved
// @namespace    noetu
// @version      0.4.0
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

  const waitForOne = (selector, callback, waitTime=10) => {
    let target = null
    const loop = setInterval(() => {
      target = document.querySelector(selector)
      if(target !== null) {
        callback(target)
        console.log(`waitForOne: call ${callback} at oen ${selector}`)
        clearInterval(loop)
      }
    }, 200)
    setTimeout(() => {
      clearInterval(loop)
    }, waitTime*1000)
  }

  const waitForAll = (selector, callback, waitTime=10) => {
    let targets = null
    const loop = setInterval(() => {
      targets = document.querySelectorAll(selector)
      if(targets !== null) {
        targets.forEach(t => callback(t))
        console.log(`waitForAll: call ${callback} at all ${selector}`)
        clearInterval(loop)
      }
    }, 200)
    setTimeout(() => {
      clearInterval(loop)
    }, waitTime*1000)
  }

  const url = new URL(document.URL)
  switch(url.hostname) {
    case 'mangarawjp.com': {
      waitForAll("iframe", t => t.remove())
      break;
    }

    case 'zh-v2.d2l.ai': {
      // 某一本深度学习的书

      if(!url.pathname.startsWith('/chapter_')) {
        break;
      }
      const ejectArea = document.createElement("a");
      const ejectIcon = document.createElement("i");
      ejectIcon.className = 'material-icons'
      ejectIcon.innerHTML = 'eject';
      ejectArea.appendChild(ejectIcon);
      document.querySelector('#button-show-source').parentElement.appendChild(ejectArea);
      ejectArea.className = 'mdl-button mdl-js-button mdl-button--icon'
      ejectArea.addEventListener('click', e => {
        document.querySelector('.mdl-layout__header.mdl-layout__header').remove();
        document.querySelectorAll('.mdl-layout__drawer').forEach(x => {
          x.remove();
        });
        const pageStyle = document.createElement("style");
        pageStyle.innerHTML = `
                    .mdl-layout__container > .mdl-layout.mdl-js-layout.mdl-layout--fixed-header > .mdl-layout__content {
                        margin-left: 0px;
                    }
                    .document > .page-content > .section p {
                        font-size: 1.4rem;
                    }
                `;
        document.head.append(pageStyle);
      })
      break;
    }

    case 'zhuanlan.zhihu.com':
    case 'www.zhihu.com': {
      // 知乎

      const start_time = Date.now();
      let modals = null, flag = false, btn;
      const loop = setInterval(function () {
        modals = document.querySelectorAll('.Modal-wrapper');
        modals.forEach(m => {
          btn = m.querySelector('.Modal-closeButton');
          flag = Boolean(btn);
          btn.click();
        });
        if(flag || Date.now() - start_time >= 10000) {
          clearInterval(loop);
        }
      }, 200)
      break;
    }

    case 'www.iot2ai.top':{
      if(!url.pathname.startsWith('/cgi-bin/intel/syosetu.html')) {
        break;
      }
      const pageStyle = document.createElement("style");
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
      `;
      document.head.append(pageStyle);
      console.log(pageStyle);
      break;
    }

    case 'mp.weixin.qq.com': {
      // 微信公众号文章页面

      if(!url.pathname.startsWith('/s')) {
        return
      }
      const sec = document.querySelector("#js_content > section")
      sec.style.fontFamily = "Microsoft YaHei"
      sec.style.color = "#000000"
      const d = document.querySelector("#page-content > div")
      d.style.maxWidth = "900px"
      waitForOne("#js_pc_qr_code", t => t.remove())
      waitForAll(".rich_pages.wxw-img.img_loading", img => {img.src = img.dataset.src})
      break
    }

    case 'www.manmanju.com': {
      // 漫漫聚，看漫画的

      waitForOne('#fix_bottom_dom', t => t.remove())
      break;
    }

    default:
      break;
  }
})();
