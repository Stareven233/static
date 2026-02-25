// ==UserScript==
// @name          网页音量增强
// @namespace    https://github.com/Stareven233
// @version      1.6.2
// @description  Boost web video volume. Supports regex URL matching, custom video selectors, individual volume settings, and cross-origin iframes.
// @description  网页视频音量增强，支持正则表达式匹配网址，仅对匹配页面生效（初始不对任何网页起作用），支持每个网页单独设置video选择器、音量，支持 iframe 跨域视频
// @author       Noetu
// @license      CC BY-NC-SA-4.0
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  if(window._n_volumAmpInitialized) {
    return;
  }
  window._n_volumAmpInitialized = true;

  const TM_CONFIG_KEY = 'n_volumAmpTMConfig';
  const SETTINGS_STORAGE_KEY = 'n_volumAmpSiteSettings';
  const AMP_MAX_FACTOR = 6.66
  const AMP_STEP = 0.01

  // ============ Utility Functions ============
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  // ============ Configuration Management ============
  function getTMConfig() {
    return GM_getValue(TM_CONFIG_KEY, { rules: [], globalSwitch: true });
  }

  function saveTMConfig(config) {
    GM_setValue(TM_CONFIG_KEY, config);
  }

  function getSiteSettings() {
    return GM_getValue(SETTINGS_STORAGE_KEY, {});
  }

  function saveSiteSettings(settings) {
    GM_setValue(SETTINGS_STORAGE_KEY, settings);
  }

  // ============ Rule Matching ============
  function checkMatch() {
    const config = getTMConfig();
    if(!config.globalSwitch || !config.rules?.length) {
      return { matched: false };
    }

    const currentUrl = window.location.href;
    for(const pattern of config.rules) {
      try {
        if(new RegExp(pattern).test(currentUrl)) {
          return { matched: true, rule: pattern };
        }
      } catch(e) {
        if(currentUrl.includes(pattern)) {
          return { matched: true, rule: pattern };
        }
      }
    }
    return { matched: false };
  }

  function parseRules(ruleText) {
    let rules = ruleText.split('\n').map(s => s.trim()).filter(s => s !== '');
    // Limit regular expression length
    rules = rules.filter(s => s.length > 0 && s.length < 1000)
    // Validate if it's a valid regular expression
    rules = rules.filter(s => {
      try {
        new RegExp(s);
        return true;
      } catch {
        return false;
      }
    })
    return Array.from(new Set(rules));
  }

  // ============ Custom Management Modal ============
  function openRuleManager() {
    const config = getTMConfig();
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); z-index: 23333;
        display: flex; align-items: center; justify-content: center;
        backdrop-filter: blur(4px); font-family: sans-serif;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #1e1e2e; color: #cdd6f4; width: 90%; max-width: 500px;
        padding: 20px; border-radius: 12px; border: 1px solid #45475a;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    `;

    const locationPrefix = window.location.origin + window.location.pathname.replace(/\/[^\/]*\/?$/, '');
    modal.innerHTML = `
      <h3 style="margin: 0 0 10px 0; color: #89b4fa;">⚙️ 匹配规则管理</h3>
      <p style="font-size: 12px; color: #a6adc8; margin-bottom: 10px;">
          每行输入一个正则表达式。匹配成功则启用网页音量增强。<br>
          当前 URL: <code style="background: #313244; padding:2px 4px; word-break: break-all;">${escapeHTML(window.location.href)}</code> <br>
          匹配当前 URL 前缀示例: <code style="background: #313244; padding:2px 4px; word-break: break-all;">${escapeHTML(locationPrefix)}/?.*</code>
      </p>
      <textarea id="_rulesArea" style="
          width: 100%; height: 250px; background: #313244; color: #f5e0dc;
          border: 1px solid #45475a; klx: 4001; border-radius: 8px; padding: 10px;
          font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box;
      ">${config.rules.join('\n')}</textarea>
      <div style="margin-top: 15px; display: flex; justify-content: flex-end; gap: 10px;">
          <button id="_btnCancel" style="padding: 8px 16px; background: #45475a; color: #fff; border: none; border-radius: 6px; cursor: pointer;">取消</button>
          <button id="_btnSave" style="padding: 8px 16px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">保存并刷新</button>
      </div>
  `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    modal.querySelector('#_btnCancel').onclick = () => overlay.remove();
    modal.querySelector('#_btnSave').onclick = () => {
      config.rules = parseRules(modal.querySelector('#_rulesArea').value);
      saveTMConfig(config);
      location.reload();
    };
  }

  // ============ Menu Registration ============
  function registerMenu() {
    const { matched } = checkMatch();
    const currentUrl = window.location.href;

    // 1. Quick toggle switch
    const statusLabel = matched ? '✅ 本页已启用 (点击移除)' : '⚪ 本页未启用 (点击添加)';
    GM_registerMenuCommand(statusLabel, () => {
      const currentConfig = getTMConfig();
      if(matched) {
        currentConfig.rules = currentConfig.rules.filter(r => {
          try { return !(new RegExp(r).test(currentUrl)); } catch(e) { return r !== currentUrl; }
        });
      } else {
        const safeUrl = currentUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        currentConfig.rules.push(`^${safeUrl}$`);
      }
      saveTMConfig(currentConfig);
      location.reload();
    });

    // 2. Add regular expression rule
    GM_registerMenuCommand('🧪 管理匹配规则', openRuleManager);
  }

  // ============ Core Functionality ============
  let audioCtx, gainNode;

  function initAmplifier(video, volume) {
    try {
      if(video._n_volumAmpBound) {
        return true;
      }
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      gainNode = audioCtx.createGain();
      gainNode.gain.value = volume;
      source.connect(gainNode).connect(audioCtx.destination);
      video._n_volumAmpBound = true;

      const resume = () => { if(audioCtx.state === 'suspended') audioCtx.resume(); };
      window.addEventListener('mousedown', resume, { once: true });
      window.addEventListener('keydown', resume, { once: true });
      return true;
    } catch(e) {
      console.warn('音量增强初始化失败:', e);
      return false;
    }
  }

  function showUI(settings, rule) {
    if(document.getElementById('_n_volumAmpPanel')) {
      return;
    }

    const panel = document.createElement('div');
    panel.id = '_n_volumAmpPanel';
    panel.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 23333;
        background: rgba(30, 30, 46, 0.95); color: #cdd6f4; padding: 15px;
        border-radius: 12px; border: 1px solid #45475a; width: 200px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family: sans-serif;
    `;
    panel.innerHTML = `
        <h4 style="font-size:12px; color: #f9fff7; margin:0 0 8px 0; display:flex; justify-content:space-between; align-items:center;">
            <b id="ampStatusTitle">未找到视频</b> <span id="ampClose" style="cursor:pointer; font-size:18px; color:#f38ba8;">&times;</span>
        </h4>
        <input type="range" id="ampSlider" min="0" max="${AMP_MAX_FACTOR}" step="${AMP_STEP}" value="${settings.volume}" style="width:100%; cursor:pointer;">
        <div style="text-align:center; font-size:18px; margin:5px 0;"><span id="ampVal">${Math.round(settings.volume * 100)}</span>%</div>
        <div style="margin-bottom: 8px;">
          <input type="text" id="ampSelector" value="${settings.selector}" placeholder="视频选择器 (如 video)" 
            style="width:100%; background:#313244; border:1px solid #45475a; color:#fff; font-size:11px; padding:4px; border-radius:4px; box-sizing:border-box;">
        </div>
        <button id="ampSave" style="width:100%; background:#89b4fa; border:none; color:#1e1e2e; padding:6px; border-radius:4px; cursor:pointer; font-weight:bold;">保存配置</button>
    `;
    document.body.appendChild(panel);

    const slider = panel.querySelector('#ampSlider');
    const ampValText = panel.querySelector('#ampVal');

    const updateVolume = (v) => {
      ampValText.innerText = Math.round(v * 100);
      if(gainNode) gainNode.gain.value = v;
      // Broadcast to iframe
      for(const frame of document.querySelectorAll('iframe')) {
        try {
          frame.contentWindow.postMessage({ type: '_n_volumAmpVolume', volume: v }, '*');
        } catch(_) { }
      }
    };

    slider.oninput = (e) => updateVolume(parseFloat(e.target.value));

    panel.querySelector('#ampSave').onclick = () => {
      const selector = panel.querySelector('#ampSelector').value.trim() || 'video';
      const volume = parseFloat(slider.value);
      const allSettings = getSiteSettings();
      allSettings[rule] = { selector, volume };
      saveSiteSettings(allSettings);
      GM_notification({ text: "配置已保存，刷新页面生效", timeout: 2000 });
    };

    panel.querySelector('#ampClose').onclick = () => panel.remove();
  }

  // ============ Startup Logic ============
  const isTop = window.self === window.top;
  if(isTop) registerMenu();

  const { matched, rule } = checkMatch();
  if(!matched && isTop) return;

  const allSettings = getSiteSettings();
  const settings = (rule && allSettings[rule]) || { selector: 'video', volume: 1.0 };

  if(isTop) {
    showUI(settings, rule);
    const uiTitle = document.getElementById('ampStatusTitle');

    // Listen for iframe reporting
    window.addEventListener('message', (e) => {
      if(e.data?.type === '_n_volumAmpReady' && uiTitle) {
        uiTitle.innerText = '网页音量增强';
      }
    });

    const findVideo = () => {
      const video = document.querySelector(settings.selector);
      if(video) {
        const success = initAmplifier(video, settings.volume)
        if(uiTitle) {
          console.log('findVideo success', success);
          uiTitle.innerText = success ? '网页音量增强' : '音量增强初始化失败，检查是否有其他类似脚本占用<video>';
        }
        return success;
      }
      return false;
    };

    // Poll to find video
    let count = 0;
    const timer = setInterval(() => {
      if(findVideo() || count++ > 10) {
        clearInterval(timer);
      }
    }, 1000);

    // Initial broadcast of selector to iframe
    setTimeout(() => {
      for(const frame of document.querySelectorAll('iframe')) {
        try {
          frame.contentWindow.postMessage({
            type: '_n_volumAmpInit',
            volume: settings.volume,
            selector: settings.selector
          }, '*');
        } catch(_) { }
      }
    }, 2000);

  } else {
    // iframe internal logic
    window.addEventListener('message', (e) => {
      // Only accept messages from parent window
      if(e.source !== window.parent) {
        return;
      }
      if(e.data?.type === '_n_volumAmpInit') {
        const video = document.querySelector(e.data.selector || 'video');
        if(video && initAmplifier(video, e.data.volume)) {
          window.parent.postMessage({ type: '_n_volumAmpReady' }, '*');
        }
      } else if(e.data?.type === '_n_volumAmpVolume' && gainNode) {
        gainNode.gain.value = e.data.volume;
      }
    });
  }
})();
