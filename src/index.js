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
                        this.data[k] = encodeURIComponent( argv[k] );
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
        this.sendData(data);
    }else{
        pubsub.subscribe( data );
    }
};

wzPing.prototype.sendData = function(data){
    var s = '';
        
    for(var key in data){
        s += '&'+key+'='+data[key];
    }

    var protocol = window.location.protocol=='https:' ? window.location.protocol : 'http:';
    var iurl = protocol+'//btrace.qq.com/kvcollect?v=1'+s+'&_dc='+ Math.random();
    var gImage = new Image(1,1);
    gImage.src = iurl;
}

module.exports = wzPing;