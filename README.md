# 封装简易方法，方便上报数据

该模块是前端上报数据时使用，封装了几个方法，上传数据时调用即可。

简单的使用样例：  

```javascript
import wzPing from 'tencent-updata';

var wzp = new wzPing({
    user: 123456,
    pwd: 123456
});

wzp.ready([
    function(callback){
        setTimeout(function(){
            callback({
                now: Date.now()
            })
        }, 400);
    }
]);

wzp.send({act: 'PV'})
```

上面的代码基本上展示出所有的功能了。

### 初始化  

可以把经常要上报的字段或者数据不需要变动的字段，在初始化时就传入进去。这样在后续上报行为中，都会带上这些字段。

代码内部是用`data`来存储这些数据的，因此初始化完成后，可以用对象直接访问该属性，并对`data`属性进行修改： 

```javascript
console.log( wzp.data );
```

### ready

在数据上报前，有些字段是需要异步获取的，在上报时需要等待该字段获取到数据后，才能上传，因此，这里设置了一个`ready`方法，在`send()`方法前先调用下`ready()`方法，这样在ready里获取到数据后，自动执行后面的send方法。

调用方式，ready方法接收一个数组，数组的每一项都是一个函数，这个函数都需要传入一个回调方法`callback`，回调方法里传入异步执行完毕获取到的值，这个值需要用json格式的方式：  

```javascript
wzp.ready([
    fn(callback);
])
```

使用样例：  

```javascript
wzp.ready([
    function(callback){
        setTimeout(function(){
            callback({
                now: Date.now()
            })
        }, 400);
    }
]);

wzp.ready([
    function(callback){
        setTimeout(function(){
            callback({
                random: (Math.random()+'').substr(-6);
            })
        }, 600);
    }
]);

wzp.send({act: 'PV'})
```
上面的代码中，字段`now`和`random`都是异步获取到的，代码里的`send`会等待这两个字段都获取到后才会执行。

### send

调用`send()`方法后就会发送数据上报请求，同时send还能接受一个json格式的参数，用户当前发送时的额外数据，不同的send上报请求之间互不影响。

```javascript
wzp.send({act: 'PV'});
wzp.send({page: 'main'}); // 当前请求中不存在act字段
```

### sendData

最终的数据上报请求是通过这个方法发送的，我们也可以修改这个`sendData`方法，来修改数据上报的方式。不过记得在`send()`发送请求之前进行修改：

```javascript
wzp.sendData = function(data){
    console.log(data);
    // ajax(data);
}
```