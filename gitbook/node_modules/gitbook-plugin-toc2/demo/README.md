# Introduction


<!-- toc -->



## 什么异步和同步？

首先得了解什么是异步和同步的概念。

举个例子：比如你去cnode论坛发帖提问，多半是没有人立即回复的。这时可以采用两种做法。

- 第一种做法：在网上一直等待，直到有人还书，然后再去吃饭睡觉。
- 第二种做法：直接忙自己的去了，当有人回复的时候，它收到回复直接通知你。你则该忙什么忙什么。到时候等通知即可。

而第一种做法就是同步的表现，必须等待别人回复（等待服务器返回信息）才进行其他事情，至死方休。

而第二种做法就是异步的表现，不耽误时间，合理利用时间高效率做事（只要服务器能并行执行多少，就可以并行多少）。

遇到这种情况，你会采用那种办法呢？

选择第一种，哈哈，说明你太执着啦；选择第二种，说明你灵活变通，合理安排自己的人生。你自己看着办吧。

## Ajax中的异步

> Ajax = Asynchronous JavaScript and XML

其中的`A = Asynchronous`，中文即异步的意思，相信很多人都了解这个，这里我们通过理解`Ajax`的原理来理解一下所谓的异步是什么


```
$.getJSON("/api/1",function(result){
    // do something
    $("div").append("x");
});
console.log(1 + '\n')
$.getJSON("/api/2",function(result){
    // do something
    $("div").append("y");
});
console.log(2 + '\n')
```

这里发了2个请求,2个$.getJSON是顺序执行的，所以会打出

```
1
2
```

至于x和y哪个先输出，要看具体服务器的响应时间，这部分就是异步操作。


## 异步原理


`Node.js`异步原理因为`Event Loop`，我们调用node api方法的时候，它会把具体操作和callback丢给`Event Loop`去执行，`Event Loop`是一个回调函数队列，当异步函数执行时，回调函数会被压入这个队列。JavaScript引擎直到异步函数执行完成后，才会开始处理事件循环。这意味着JavaScript代码不是多线程的，即使表现的行为相似。事件循环是一个先进先出（FIFO）队列，这说明回调是按照它们被加入队列的顺序执行的。JavaScript被 `node` 选做为开发语言，就是因为写这样的代码多么简单啊。 

`Event Loop` 是 `libuv` 的核心实现，所以实际是 `libuv` 和 `system` 操作系统去打交道，此时会出现执行时长差异，所以也是异步的。

综上，无论`Ajax`还是`Node.js`，它们都是借助中间层去做实际操作，所以我们无需过多的关注中间层之后的操作就可以非常简单的完成功能开发，这其实就是它们最大的好处。

## Api

> 应用程序接口（英语：Application Programming Interface，简称：API）

从`Node.js`异步原理，我们可以知道，核心在于api方法调用，然后交由`Event Loop`（libuv）去执行，所以我们一定要熟悉`Node.js`的api操作

举例： 获取目录下所有文件的api是fs.readdir

```
fs.readdir(path, callback)#
Asynchronous readdir(3). Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
```

这里稍稍解释下

- callback通常都是函数最后一个参数
- callback里约定回调内容，(err, files)
  - err在前，没有err则为空
  - 具体返回结果在后


## 异步写法

使用回调函数，即为异步写法

见readdir-async.js

```
var fs = require('fs')

var path = '.';

fs.readdir(path, function(err, files) {
  console.log(files)
})
```

## 同步写法

同步写法即直接返回结果，不需要在回调函数里处理。

见readdir-sync.js

```
var fs = require('fs')

console.log(fs.readdirSync('.'))
```

## 执行并查看结果

```
node nodejs/async/readdir-sync.js 
[ '.DS_Store',
  '.git',
  '.gitignore',
  'README.md',
  'SUMMARY.md',
  '_book',
  'async',
  'cover.jpg',
  'cover.png',
  'cover_small.jpg',
  'db',
  'debug',
  'docs',
  'es-in-node4',
  'framework',
  'fullstack',
  'getting-start',
  'koa-core',
  'koa-http',
  'koa-in-action',
  'koa.sketch',
  'more',
  'newbie',
  'next',
  'nodejs',
  'npm',
  'npm-debug.log',
  'other',
  'practice',
  'referrence.md',
  'wechat' ]
```  

从这个结果里我们可以看出，它的返回值是数组类型。我们如果想找出以koa开头的文件呢？

## 找出以koa开头的文件

核心是使用正则表达式来正则test方法的简单实例

```  
  files.forEach(function (file) {
    if (/^koa/.test(file)) {   //正则 test 来查找以koa开头的文件
      console.log(file)
    }
  })
```  

首先看一下异步写法，见readdir-async2.js

```  
var fs = require('fs')

var path = '.';

fs.readdir(path, function(err, files) {
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log(file)
    }
  })
})
```  

很明显，这是在回调函数里处理的，这是异步写法。

下面我们看一下同步写法

见readdir-sync2.js

```  
var fs = require('fs')

var files = fs.readdirSync('.')

files.forEach(function (file) {
  if (/^koa/.test(file)) {
    console.log(file)
  }
})
```  

说明

- 先获取files结果
- 然后遍历files，进行处理

这里没有用回调函数，非常容易读懂，我们知道代码是顺序执行，所以这样写更容易让人理解

## 优化

这段代码写的还是比较冗余，我们来优化一下，把过滤处理的代码抽成一个独立的函数，能让我们代码具有更好的可读性，通过这个我们再比较一下同步异步的差别

先说异步，见readdir-async3.js

```
var fs = require('fs')

var path = '.';

function filter(files){
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log(file)
    }
  })
}

// 入口
fs.readdir(path, function(err, files) {
  // 过滤
  filter(files)
})
```

核心如下

```
// 入口
fs.readdir(path, function(err, files) {
  // 过滤
  filter(files)
})
```

这是一个比较好的理解异步的例子，代码看起来还不错。不过我们换个角度想想，如果我嵌套5层呢？是不是太可怕了。。。这不是好的写法，在后面流程控制章节里会具体讲


我们再来看看同步优化后的代码，见readdir-sync3.js

```
var fs = require('fs')

function filter(files){
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log(file)
    }
  })
}

var files = fs.readdirSync('.')

filter(files)
```

顺序执行，还是比较容易理解的。

## 极端情况

我们就以readdir-sync3.js为例，

```
var files = fs.readdirSync('.')
// fs.readdirSync执行完成才会执行filter
filter(files)
```

这样的代码非常容易理解，我们再极端点，如果文件少效率是非常不错的，可是如果文件多呢？比较过亿个文件，程序执行就需要一定时间，这种同步代码会阻塞下面的方法执行，那是不是无法提高并行效率呢？

如果是异步呢？

```
// 入口
fs.readdir(path, function(err, files1) {
  // 过滤
  filter(files1)
})

fs.readdir(path, function(err, files2) {
  // 过滤
  filter(files2)
})
```

这时，其实是执行2个`fs.readdir`方法的，它能够更好的利用系统资源完成更多的任务。

### 阻塞

模拟阻塞

```
var fs = require('fs')

function filter(files){
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log(file)
    }
  })
}

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
};
 
var files = fs.readdirSync('.')

sleep(10000);

filter(files)


```

### 并行任务

async.js

```
var fs = require('fs')

var path = '.';


// 入口
fs.readdir(path, function(err, files) {    
  // 过滤
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log('1= ' + file)
    }
  })
})


fs.readdir(path, function(err, files) {
  // 过滤
  files.forEach(function (file) {
    if (/^koa/.test(file)) {
      console.log('2= ' + file)
    }
  })
})
```

多次执行，返回结果是不一定的，有的时候是1先执行，有的时候是2先执行，这其实就是因为这2个人是并行，快的先执行完

```
$ node nodejs/async/async.js
2= koa-core
2= koa-http
2= koa-in-action
2= koa.sketch
1= koa-core
1= koa-http
1= koa-in-action
1= koa.sketch
$ node nodejs/async/async.js
1= koa-core
1= koa-http
1= koa-in-action
1= koa.sketch
2= koa-core
2= koa-http
2= koa-in-action
2= koa.sketch
```

## 总结

本章节以`fs.readdir`为例，讲解了异步和同步的区别

- 同步利于人的理解，但会造成线程阻塞，无法最大限度的利于系统资源
- 异步写法需要嵌套回调，不利于理解和维护，哪怕代码写的非常规范也很难，但它能够并行，同时处理更多任务，效率会大于或等于异步


