// ==UserScript==
// @name         pageViewImproved
// @name:en      pageViewImproved
// @namespace    noetu
// @version      0.3.1
// @description  try to take over the world!
// @author       Noe
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @icon         https://blog-static.cnblogs.com/files/Stareven233/kuro.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  
  const waitRemoveOne = (selector, waitTime=10) => {
    let target = null;
    const loop = setInterval(() => {
      target = document.querySelector(selector)
      if(target !== null) {
        target.remove()
        console.log(`remove ${selector}`)
        clearInterval(loop)
      }
    }, 200)
    setTimeout(() => {
      clearInterval(loop)
    }, waitTime*1000)
  }

  const waitRemoveAll = (selector, waitTime=10) => {
    let targets = null;
    const loop = setInterval(() => {
      targets = document.querySelectorAll(selector)
      if(targets !== null) {
        targets.forEach(t => t.remove())
        console.log(`remove ${selector}`)
    }
    }, 200)
    setTimeout(() => {
      clearInterval(loop)
    }, waitTime*1000)
  }

  const url = new URL(document.URL)
  switch(url.hostname) {
    case 'mangarawjp.com': {
      waitRemoveAll("iframe")
      break;
    }

    case 'zh-v2.d2l.ai': {
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

    case 'doki1001.com': {
      const start_time = Date.now();
      let modal = null, flag = false;
      const loop = setInterval(function () {
        modal = document.querySelector("body > ._4KjPzfFqnPyBgIgiXkX")
        if(modal) {
          modal.remove();
          document.querySelector("body > .ipprtcnt").remove();
          flag = true;
        }
        if(flag || Date.now() - start_time >= 10000) {
          clearInterval(loop);
        }
      }, 200)
      break;
    }
    case 'mp.weixin.qq.com': {
      if(!url.pathname.startsWith('/s')) {
        return
      }
      const sec = document.querySelector("#js_content > section");
      sec.style.fontFamily = "Microsoft YaHei";
      sec.style.color = "#000000";
      const d = document.querySelector("#page-content > div");
      d.style.maxWidth = "900px";
      setTimeout(() => document.getElementById("js_pc_qr_code").remove(), 5000)
      break;
    }
    case 'www.manmanju.com': {
      setTimeout(() => {
        document.getElementById('fix_bottom_dom').remove()
      }, 1000);
      break;
    }
    default:
      break;
  }
})();
