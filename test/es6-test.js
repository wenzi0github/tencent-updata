import wzPing from '../dist/bundle';

var wzp = new wzPing({
    user: 123456,
    pwd: 123456
});
wzp.ready([
    function(callback){
        setTimeout(function(){
            callback({
                now: Date.now(),
                random: (Math.random()+'').substr(-6)
            });
        }, 200)
    },
    function(callback){
        setTimeout(function(){
            callback({
                now: Date.now(),
                url: 'https://news.qq.com/newsapp/invite/share.htm'
            });
        }, 600)
    },
    function(callback){
        callback({
            user: 'wenzi'
        });
    }
]);

wzp.sendData = function(data){
    console.log( data );
}

wzp.send({act: 'PV'});

wzp.ready([
    function(callback){
        setTimeout(function(){
            callback({
                a1: 1,
                a2: 2
            });
        }, 100)
    }
]);

wzp.send({act: Math.random()});
wzp.send({act: Math.random()});
wzp.send({act: Math.random()});