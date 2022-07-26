// ==UserScript==
// @name         让网络生活轻松点吧
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  fxxk the net
// @author       noe
// @match        https://www.icourse163.org/learn/*
// @match        https://wenda.zhihuishu.com/shareCourse/questionDetailPage*
// @match        https://mooc1-1.chaoxing.com/mycourse/studentstudy?*
// @match        https://www.iqiyi.com/*
// @match        https://pc.xuexi.cn/*
// @match        https://www.rijula.com/rijuplay/*
// @match        http://www.imomoe.ai/player/*
// @match        https://mbz789.com/*
// @match        https://mbz789.com/*
// @match        https://www.mangabz.com/*

// @match        www.fgq5u6pklrv3.com/*

// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// ==/UserScript==

$(document).ready(function() {
    'use strict'
    const url = new URL(document.URL);
    const hostname = url.hostname;

    if (hostname === 'www.icourse163.org')
    {
        // 取消sbMooc自动播放
        function remove_auto() {
            let auto = $('#g-body .j-autoNext')[0];
            if(!auto)
                return false;
            auto.checked = false;
        }
        // setInterval(remove_auto, 30000);
        // 为了自动刷课，先关了
    }

    else if(hostname === 'www.mangabz.com')
    {
        //去mangabz漫画广告
        $("#cc1").remove();
        $("#cc2").remove();
        $("#cc3").remove();
    }

    else if(url.href.startsWith('https://www.fgq5u6pklrv3.com/')){
        //去猫咪广告
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
    }

    else if(hostname === 'wenda.zhihuishu.com')
    {
        //智慧树解除问答区答题框复制粘贴限制
        let area = $('<textarea></textarea>').addClass('my-ans-textarea').attr('id', 'aContent');
        area.keydown(input_answerContent).keyup(input_answerContent).attr('maxlength', 1000);
        $('#aContent').replaceWith(area);
    }

    else if(hostname == "mooc1-1.chaoxing.com")
    {
        //超星学习通解除反调试措施；还需取消xhr/fetch breakpoints
        //setTimeout(function(){ _0x43d060 = function(){}}, 10000);  //反调函数，但似乎名称会改变
    }

    else if(hostname == "www.iqiyi.com" && url.pathname.length>1)
    {
        //爱奇艺视频播放页video解绑pause事件
        let video = document.querySelector('#flashbox .iqp-player>video');
        video.onpause = function(event) {
            event.stopImmediatePropagation();
        }
        //算了算了，不知道用了什么垃圾方法，取消不掉
    }

    else if(url.href.startsWith('https://pc.xuexi.cn/'))
    {
        //学习强国关闭背景音乐
        let audio = document.querySelector('.layout-body audio');
        if(audio){
            audio.remove();
        }
        //学习强国专项答题答案获取
        function get_ans(){
            get_ans_btn.html('点击获取答案: '); //避免多题堆积
            document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span.tips").click();
            let ans = document.querySelectorAll("#body-body div.ant-popover div.ant-popover-content div.ant-popover-inner div.ant-popover-inner-content font");
            let blank = document.querySelectorAll("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-body > div > input");

            if(blank.length && ans.length) {
                for(let i=0; i<blank.length; i++)
                    blank[i].value = ans[i].innerText;
                blank[0].focus();
                blank[0].value = blank[0].value + '○'; //这样手动删去○就能触发下一题按钮可用...
                //let event = new Event("change");
                //blank[0].dispatchEvent(event); //没空去想怎么直接触发下一题了
            }

            ans.forEach((a) => get_ans_btn.append(a.innerText + ' '));
            //$("#app > div > div.layout-body > div > div.detail-body > div.action-row > button").removeAttr('disabled');
        }

       let get_ans_btn = $('<span id="auto-answer">').html('点击获取答案: ').click(get_ans);

       setTimeout(function() {
            let q_footer = $("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer");
            q_footer.prepend(get_ans_btn);
       }, 2000);
    }

    else if(url.href.startsWith('https://www.rijula.com/rijuplay')){
        $('#btnshow').parent().remove();
        $('#countdown').parent().remove();
        //去视频播放页右下角两个广告
    }

    else if(url.href.startsWith('http://www.imomoe.ai/player/')){
        let ad = $('#HMRichBox');
        ad.remove();
        //去视频播放页右下角广告
    }

    else if(url.href.startsWith('https://mbz789.com/')){
        //本子库漫画弹窗
        $('#gurl').remove();
    }
});
