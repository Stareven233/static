window.onload = function() {     
    let live2d = document.querySelector('#live2dcanvas');
    live2d.setAttribute("draggable", "true"); 
    
    let shiftX;
    let shiftY;
    // 记录到点击时鼠标到目标左边和上边的偏移
  
    live2d.addEventListener('dragstart', function (e) {
        e.dataTransfer.effectAllowed = "move";  //指定拖放操作所允许的一个效果
        shiftX = event.clientX - live2d.getBoundingClientRect().left;
        shiftY = event.clientY - live2d.getBoundingClientRect().top;
        // console.log("dragstart", shiftX, shiftY, live2d.getBoundingClientRect());
        return true;
    }, false);
  
    live2d.addEventListener('drag', function (e) {
        live2d.style.top = e.clientY - shiftY + 'px';
        live2d.style.left = e.clientX - shiftX + 'px';
        // console.log("drop");
    }, false);
  
    document.addEventListener('dragover', function (e) {
        // 取消冒泡 ,不取消则不能触发 drop事件
        e.preventDefault()|| e.stopPropagation();
    }, false);
  
    document.addEventListener('drop', function (e) {
        // console.log("drop");
        e.preventDefault() || e.stopPropagation();  
        // 不取消，firefox中会触发网页跳转到查找setData中的内容
    }, false);
};
