### Live2d模型
收集了一些博客/网页中能用的live2d

### 用法
网页中添加下列script即可，src的"L2Dwidget.min.js"及下方jsonPath的模型json"model.json"要用正确路径替换

```
<script src="L2Dwidget.min.js"></script>  
<script>  
　　L2Dwidget.init({  
          "model": {  
            "jsonPath":"model.json",  
            "scale": 1  
          },  
          "display": {  
            "position": "right",  
            "width": 120,  
            "height": 200,  
        　"hOffset": 0,  
            "vOffset": 0  
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
```
