/**
 * Created by litengfei on 16/12/7.
 */
var WsRpcClient = require("WsRpcClient");
var EventEmitter = require("EventEmitter");
//自动连接的WsRpcClient
function AutoReconnectWsRpcClient(){
    var self = this;
    this.client = new WsRpcClient();
    this.client.enbleHeartBeat = false;
    this.events = new EventEmitter();
    this.isReady = false;
    this.proxy = null;
    this.rpcService = null;
    this.url = null;

    //添加从外面切换回来的事件
    if(cc && cc.eventManager){
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
            setTimeout(function () {
                self.checkHeartBeatAndReconnect(1000);
            }.bind(self),50);
        }.bind(this));
    }


}

AutoReconnectWsRpcClient.prototype.connect = function(url){
    if(this.client != null){
        try{
            this.client.clearSocket();//清除网络事件
        }catch(e) {

        }
    }
    this.url = url;
    this.client.enbleHeartBeat = false;
    this.client.isReconnected = false;
    this.client.addRpc(this.rpcService);
    this.client.startConnectUntilConnected(url);
    this.client.onClose(function(client){
        this.isReady = false;
        this.proxy = null;
        this.events.emit("onClose",client);
        this.client = new WsRpcClient();
        this.client.enbleHeartBeat = false;
        this.client.isReconnected = false;
        this.stopCheckHeartBeart();//停止心跳检测
        this.connect(this.url);
    }.bind(this));
    this.client.onReady(function(){
        this.startCheckHeartBeat();//开始心跳检测
        this.isReady = true;
        this.proxy = this.client.proxy;
        this.events.emit("onReady",this.client);
        this.events.removeEvent("onReady");

    }.bind(this));
}

AutoReconnectWsRpcClient.prototype.startCheckHeartBeat = function () {
    var self = this;
    this.heartBeatInterVal = setInterval(function () {
        self.checkHeartBeatAndReconnect(10000);
    },11000);
}

AutoReconnectWsRpcClient.prototype.stopCheckHeartBeart = function () {
    clearInterval(this.heartBeatInterVal);
}


AutoReconnectWsRpcClient.prototype.checkHeartBeatAndReconnect = function (timeOut) {
    cc.log("进入开始检测阶段");
    var self = this;
    var isConnected = false;
    self.client.onReady(function () {
        self.client.proxy.heartBeat(function (data) {
            if(data.ok) isConnected = true;
        })
    })
    setTimeout(function () {
        if(isConnected == false && self.isReady == true){
            self.isReady = false;
            //发送断开连接事件
            self.proxy = null;
            self.stopCheckHeartBeart();
            self.client.clearSocket();
            self.events.emit("onClose",self.client);
            self.client = new WsRpcClient();
            self.connect(self.url);
        }
    },timeOut);
}

AutoReconnectWsRpcClient.prototype.addRpc = function(service){
    this.rpcService = service;
}

AutoReconnectWsRpcClient.prototype.onReady = function(cb){
    if(this.isReady){
        this.client.onReady(cb);
    }else{
        this.events.on("onReady",cb);
    }
}
AutoReconnectWsRpcClient.prototype.onReadyState = function(cb){
    this.client.onReadyState(cb);
}

AutoReconnectWsRpcClient.prototype.onClose = function(cb){
    //重新连接
    this.events.on("onClose",cb);
}

AutoReconnectWsRpcClient.prototype.close = function(){
    this.client.close();
}

AutoReconnectWsRpcClient.prototype.off = function(cb){
    this.events.remove(cb);
}

module.exports = AutoReconnectWsRpcClient;
