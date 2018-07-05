const pubsub = {};

;(function(q){
    var topics = [];

    // 添加订阅者
    q.subscribe = function(data){
        topics.push(data);

        return topics.length;
    }

    // 触发
    q.publish = function(callback=()=>{}){
        var len = topics.length,
            i = 0;

        while( i<len ){
            callback( topics[i] );
            i++;
        }
    }
})(pubsub);

function wzPing(params){
    this.data = {};
    this.pm = []; // promise list
    this.readyWait = 0;

    Object.assign(this.data, params);
}

wzPing.prototype.ready = function(params){
    this.readyWait++;

    let fn, p;
    for(let key in params){
        fn = params[key];
        
        p = new Promise((resolve, reject)=>{
            fn(argv=>{
                for(let k in argv){
                    if( argv[k] ){
                        this.data[k] = argv[k];
                    }
                }
                resolve( this.data );
            })
        });

        this.pm.push( p );
    }

    // 异步全部完成后
    let self = this;
    Promise.all( this.pm ).then(()=>{
        self.readyWait--;
        if( self.readyWait<=0 ){
            pubsub.publish(function(data){
                self.send(data);
            });
        }
    }).catch(err=>{
        console.error(err);
    });
};

wzPing.prototype.send = function(params){
    let data = Object.assign({}, this.data, params);
    
    if( this.readyWait==0 ){
        // 若ready执行完毕，则开始上传数据
        this.sendData(data);
    }else{
        // 若还有ready没有执行完毕，则先将请求存起来，等待上报
        pubsub.subscribe( data );
    }
};

wzPing.prototype.sendData = function(data){
    let s = '',
        item;
        
    for(let key in data){
        item = data[key];
        if( typeof item==='object' ){
            // 若上传的数据为array或者json格式的，则转换为字符串
            item = JSON.stringify(item);
        }

        s += '&' + key + '=' + encodeURIComponent( data[key] );
    }

    let protocol = window.location.protocol=='https:' ? window.location.protocol : 'http:';
    let iurl = protocol+'//btrace.qq.com/kvcollect?v=1'+s+'&_dc='+ Math.random();
    let gImage = new Image(1,1);
    gImage.src = iurl;
}

module.exports = wzPing;