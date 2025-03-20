// ==UserScript==
// @name         removeAnything
// @name:en      removeAnything
// @namespace    http://noe.cc/
// @version      0.1.0
// @description  remove anything
// @author       Noe
// @match        http://*/*
// @match        https://*/*
// @run-at       document-end
// @icon         https://blog-static.cnblogs.com/files/Stareven233/kuro.ico
// @grant        none
// ==/UserScript==

(function () {
  let isFrozen = true
  const button = document.createElement('button')
  button.textContent = 'Unfreeze'
  button.style.textAlign = 'left'
  button.style.position = 'fixed'
  button.style.width = '88px'
  button.style.borderRadius = '3px'
  button.style.padding = '2px 3px'
  button.style.bottom = '230px'
  button.style.right = '-70px'
  button.style.transition = 'right 0.5s ease-in-out'
  button.style.zIndex = 10000 // 确保按钮在其他元素上方
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
      lastTarget.style.outline = '2.5px solid #ff6644' // 高亮当前元素

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
})()
