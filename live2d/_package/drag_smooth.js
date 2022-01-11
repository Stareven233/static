jQuery(document).ready(function($){
    var box=$('.waifu')[0];
    var topCount = 20;
    box.onmousedown=function(e){
        var Ocx=e.clientX;
        var Ocy=e.clientY;
        var Oboxx=parseInt(box.style.left);
        var Oboxy=parseInt(box.style.top);
        var Ch=document.documentElement.clientHeight;
        var Cw=document.documentElement.clientWidth;
        document.onmousemove=function(e){
            var Cx=e.clientX;
            var Cy=e.clientY;
            box.style.left=Oboxx+Cx-Ocx+"px";
            box.style.top=Oboxy+Cy-Ocy+"px";
            if(box.offsetLeft<0){
                box.style.left=0
            }else if(box.offsetLeft+box.offsetWidth>Cw){
                box.style.left=Cw-box.offsetWidth+"px"
            }
            if(box.offsetTop-topCount<0){
                box.style.top=topCount+"px"
            }else if(box.offsetTop+box.offsetHeight-topCount>Ch){
                box.style.top=Ch-(box.offsetHeight-topCount)+"px"
            }
            ismove = true
        };
        document.onmouseup=function(e){
            document.onmousemove = null;
            document.onmouseup = null
        }
    }
}
