---
icon: file-contract
date: 2024-06-02
category:
  - 前端 
  - 合集
tag:
  - 工具
---

# 工具

##### HTML元素自动滚动

```
export class ScrollWrapper {
    constructor(vm, { scrollDirection = 1, speed = 0.3, bodyWrapper } = {}) {
        this.vm = vm;
        this.scrollDirection = scrollDirection;
        this.speed = speed;
        this.bodyWrapper = bodyWrapper;
        this.startScroll();
    }

    clearScroll() {
        cancelAnimationFrame(this.animationId);
    }

    startScroll() {
        this.vm.$nextTick(() => {
            if (!this.bodyWrapper) return;
            if (this.bodyWrapper.clientHeight >= this.bodyWrapper.scrollHeight) return;
            this.bodyWrapper.addEventListener('scroll', () => this.scroll());
            this.bodyWrapper.addEventListener('mouseenter', () => this.pauseScroll());
            this.bodyWrapper.addEventListener('mouseleave', () => this.resumeScroll());
            this.bodyWrapper.scrollTop = 0;
            this.scrollDirection = 1;
            this.pos = 0;
            this.clearScroll();
            this.startScrollFn();
        });
    }

    startScrollFn() {
        const step = () => {
            if (this.bodyWrapper && !this.isPaused) {
                this.pos += this.speed * this.scrollDirection;
                this.bodyWrapper.scrollTop = this.pos;
                if (this.bodyWrapper.scrollTop + this.bodyWrapper.clientHeight >= this.bodyWrapper.scrollHeight - 1) {
                    this.scrollDirection = -1;
                }
                if (this.bodyWrapper.scrollTop <= 0) {
                    this.scrollDirection = 1;
                }
            }
            this.animationId = requestAnimationFrame(step);
        };
        this.animationId = requestAnimationFrame(step);
    }

    pauseScroll() {
        this.isPaused = true;
    }

    resumeScroll() {
        this.isPaused = false;
    }

    scroll() {
        if (this.isPaused) {
            this.pos = this.bodyWrapper.scrollTop;
        }
    }
}

```

```
this.bodyWrapper.scrollTop = this.pos;
```

此处由于HTMLElement取值scrollTop会取整，为了保证浮点数滚动，所以声明pos过渡

##### 全排列算法

```javascript
const func = (arr) => {
  let len = arr.length,
    res = [];
  /**
   * 【全排列算法】
   * 说明：arrange用来对arr中的元素进行排列组合，将排列好的各个结果存在新数组中
   * @param tempArr：排列好的元素
   * @param leftArr：待排列元素
   */
  let arrange = (tempArr, leftArr) => {
    if (tempArr.length === len) {
      // 这里就是递归结束的地方
      // res.push(tempArr) // 得到全排列的每个元素都是数组
      res.push(tempArr.join("")); // 得到全排列的每个元素都是字符串
    } else {
      leftArr.forEach((item, index) => {
        let temp = [].concat(leftArr);
        temp.splice(index, 1);
        // 此时，第一个参数是当前分离出的元素所在数组；第二个参数temp是传入的leftArr去掉第一个后的结果
        arrange(tempArr.concat(item), temp); // 这里使用了递归
      });
    }
  };
  arrange([], arr);
  return res;
};
```

<!-- more -->

##### 防抖/节流

```javascript
// 防抖
const debounce = (fun, time) => {
  let timer = null;
  return (...arg) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fun.apply(this, arg);
    }, time);
  };
};
// X1、节流
const throttle = (fun, time) => {
  let lock = null;
  return (...arg) => {
    if (!lock) {
      lock = true;
      setTimeout(() => {
        fun.apply(this, arg);
        lock = false;
      }, time);
    }
  };
};

// X2、带尾部执行
const throttle = (func, wait) => {
  let timeout = null;
  let lastArgs = null;
  let lastContext = null;
  let lastCallTime = 0;

  const invokeFunc = () => {
    func.apply(lastContext, lastArgs);
    lastCallTime = Date.now();
    timeout = null;
  };

  return (...args) => {
    const now = Date.now();
    const remainingTime = wait - (now - lastCallTime);
    lastContext = this;
    lastArgs = args;

    if (remainingTime <= 0 || remainingTime > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      invokeFunc();
    } else if (!timeout) {
      timeout = setTimeout(invokeFunc, remainingTime);
    }
  };
};
```

##### 字符串千分位隔断

```


const toBreakStr = (num) => {
    const arr = String(num).split('').reverse();
    let res = [];
    while (arr.length) {
      res.push(arr.splice(0, 3).reverse().join(''))
      if (arr.length) res.push(',')
    }
    return res.reverse().join('');
  }
```

##### 对象数组转树

```javascript
const transformToTree = (arr, parentId = null) => {
  let tree = [];
  arr.forEach((item) => {
    if (item.parentId == parentId) {
      const children = transformToTree(arr, item.id);
      if (children.length) item.children = children;
      tree.push(item);
    }
  });
  return tree;
};
```

##### 文件下载

```javascript
const downloadFile = (buffer, fileName) => {
	let fileURL = window.URL.createObjectURL(new Blob([buffer]));
	let fileLink = document.createElement("a");
	fileLink.href = fileURL;
	fileLink.setAttribute("download", fileName);
	document.body.appendChild(fileLink);
	fileLink.click();
	document.body.removeChild(fileLink);
}

const downloadFile = (url, fileName) => {
	let fileLink = document.createElement("a");
	fileLink.href = url;
	fileLink.download = fileName;
	document.body.appendChild(fileLink);
	fileLink.click();
	document.body.removeChild(fileLink);
}

import {saveAs} from file-saver;
saveAs(new Blob([buffer]), 'fileName');
```

##### crypto-js加密

```javascript
const encryption: any = {
  keyEnum: {
    DEFAULTKEY: 'ws12345678901234', //默认密钥 16位
    USERKEY: 'ws12345678901234',
    LIBRARY: 'ABCDEFGHIJKLMNOPORSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  },
  encrypt: (
    word: any,
    keyStr: string | null = encryption.keyEnum.DEFAULTKEY
  ) => {
    const _word = JSON.stringify(word) || '' //转string 类型
    const _keyStr = keyStr //判断是否存在key，不存在就用定义好的key
    const _key = CryptoJS.enc.Utf8.parse(_keyStr)
    const _srcs = CryptoJS.enc.Utf8.parse(_word)
    const _encrypted = CryptoJS.AES.encrypt(_srcs, _key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return _encrypted.toString()
  },
  decrypt: (
    word: string,
    keyStr: string | null = encryption.keyEnum.DEFAULTKEY
  ) => {
    const _keyStr = keyStr
    const _key = CryptoJS.enc.Utf8.parse(_keyStr)
    const _word = word || ''
    const _decrypt = CryptoJS.AES.decrypt(_word, _key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return JSON.parse(CryptoJS.enc.Utf8.stringify(_decrypt).toString())
  },
}
```
