<script src="https://eqcn.ajz.miesnfu.com/wp-content/plugins/wp-3d-pony/live2dw/lib/L2Dwidget.min.js"></script>
<script>
    // 白猫
    // https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json
    // 黑猫
    // https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json
    // bilibili 33
    // https://raw.githubusercontent.com/Stareven233/static/master/live2d/Bilibili2233/haruna/33/model.2018.bls-winter.json
    
    function rand_choice(arr) {
      return arr[Math.round(Math.random()*(arr.length-1))];
    }
    
    let haruna_basedir = "https://raw.githubusercontent.com/Stareven233/static/master/live2d/Bilibili2233/haruna/"
    let haruna = ["22", "33"];
    let closet_list = ['model.2016.xmas.1.json', 'model.2016.xmas.2.json', 'model.2017.cba-normal.json', 'model.2017.cba-super.json', 'model.2017.newyear.json', 'model.2017.school.json', 'model.2017.summer.normal.1.json', 'model.2017.summer.normal.2.json', 'model.2017.summer.super.1.json', 'model.2017.summer.super.2.json', 'model.2017.tomo-bukatsu.high.json', 'model.2017.tomo-bukatsu.low.json', 'model.2017.valley.json', 'model.2017.vdays.json', 'model.2018.bls-summer.json', 'model.2018.bls-winter.json', 'model.2018.lover.json', 'model.2018.spring.json', 'model.default.json'];
    let model_path = haruna_basedir;
    model_path += rand_choice(haruna) + '/' + rand_choice(closet_list);
    // console.log(model_path);
    
　　L2Dwidget.init({
          "model": {
            "jsonPath":model_path,
            "scale": 1 
          }, 
          "display": { 
            "position": "right", 
            "width": 120, 
            "height": 160,
        　  "hOffset": 0, 
            "vOffset": -20
          }, 
          "mobile": { 
            "show": true, 
            "scale": 0.5 
          },
        　"react": { 
            "opacityDefault": 1, 
            "opacityOnHover": 0.2 
          } 
        });
</script>

<script>
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
</script>