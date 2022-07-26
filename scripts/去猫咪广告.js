// ==UserScript==
// @name         去猫咪广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fxxk the net
// @author       noe

// @match        www.fgq5u6pklrv3.com/*

// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

$(document).ready(function() {
    'use strict'
    $('section.section.section-banner').remove();
    $('#photo-header-title-content-text-dallor').remove();
    $('#favCanvas').remove();
    $('.footer-fix').remove();

    $('.close_discor').remove();
    $('#photo--content-title-bottomx--foot').remove();
    $('#photo-content-title-text-main').remove();

    let normal_scrollbar = $('<style>');
    normal_scrollbar.html(`*::-webkit-scrollbar {
        width: 16px;
        height: 80px;
    }`);
    $(document.head).append(normal_scrollbar);

});
