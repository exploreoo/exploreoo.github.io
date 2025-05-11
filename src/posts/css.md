---
icon: pen-to-square
date: 2023-03-10
category:
  - 前端
tag:
  - css
---

# CSS样式效果

- ##### background 渐变色、图片叠加

  ```css
  // 使用,间隔 需要渐变色置后
  background: url(static/images/xxx.png) no-repeat center center, linear-gradient(105deg, #F8FCFF 0%, #C4CBD5 100%);
  ```

- ##### 断线边框动画

  ```html
  <div class="box"></div>
  ```

  ```less
  @keyframes run {
    0%,
    100% {
      clip: rect(0px, 220px, 2px, 0px);
      /*初始和结束状态:上边线条*/
    }
  
    25% {
      clip: rect(0px, 2px, 220px, 0px);
      /*左边线条*/
    }
  
    50% {
      clip: rect(218px, 220px, 220px, 0px);
      /*底边线条*/
    }
  
    75% {
      clip: rect(0px, 220px, 220px, 218px);
      /*右边线条*/
    }
  }
  .box {
    height: 200px;
    width: 200px;
    background: rgba(10, 150, 220, 1);
    margin: 50px auto;
    position: relative;
  
    &::after,
    &::before {
      content: "";
      position: absolute;
      width: 220px;
      height: 220px;
      box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.5);
      /*内阴影 inset*/
      left: 0;
      top: 0;
      margin: -10px;
  
      // 设计CLIP:
      //  clip:rect(上边起始的距离 ,  自左道右的距离,  自上到下的距离,  左边起始的距离)
  
      /* 开始0% ： 裁剪保留上边部分*/
      /* clip: rect(0px, 220px, 2px, 0px); */
      /* 25% ： 裁剪保留左边部分*/
      /* clip: rect(0px, 2px, 220px, 0px); */
      /* 50% ： 裁剪保留底边部分*/
      /* clip: rect(218px, 220px, 220px, 0px); */
      /*  75% ： 裁剪保留右边部分 */
      /* clip: rect(0px, 220px, 220px, 218px); */
      /* 结束100% ： 回到原点 裁剪保留上边部分*/
      /* clip: rect(0px, 220px, 2px, 0px); */
  
      animation: run 6s linear infinite;
      /*应用动画run 匀速运动  重复执行*/
    }
  
    &::before {
      animation-delay: 3s;
      /*让before 比after 慢3秒,总时间6秒,这样就形成对角线动画效果*/
    }
  }
  ```

- ##### 滚动显示

  ```html
  <div class="clip-txt">稍等~稍等等~~稍等~~~~马上出现！ -done！</div>
  ```

  ```less
  @keyframes clipTxt {
    0% {
      clip: rect(0px, 0px, 30px, 0);
    }
    100% {
      clip: rect(0px, 200px, 30px, 0);
    }
  }
  .clip-txt {
    width: 200px;
    height: 30px;
    background: rgba(0, 0, 0, 0.2);
    animation: clipTxt 5s infinite;
  }
  ```
