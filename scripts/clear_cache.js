// 清除所有 Cookie
(function clearCookies() {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
})();

// 清除 LocalStorage
localStorage.clear();

// 清除 SessionStorage
sessionStorage.clear();

// 清除 IndexedDB 中的所有数据
// 获取当前页面的域名
const domain = window.location.hostname;

// 打开 IndexedDB
const request = indexedDB.open(domain);

request.onsuccess = function(event) {
    const db = event.target.result;

    // 获取所有对象存储空间的名称
    const objectStoreNames = db.objectStoreNames;

    // 遍历并删除每个对象存储空间
    for (let i = 0; i < objectStoreNames.length; i++) {
        const objectStoreName = objectStoreNames[i];
        db.deleteObjectStore(objectStoreName);
    }

    console.log(`IndexedDB for domain "${domain}" has been cleared.`);
};

request.onerror = function(event) {
    console.error("Error opening IndexedDB:", event.target.error);
};

request.onupgradeneeded = function(event) {
    // 如果数据库需要升级（例如删除对象存储空间），则在这里处理
    const db = event.target.result;
    console.log("IndexedDB upgrade needed.");
};
