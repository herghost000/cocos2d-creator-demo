var hero2 = require("HeroPlayer");

cc.Class({
    extends: cc.Component,

    properties: {
        
        times: 0,
        // 碰撞音效资源
        pengAudio: {
            default: null,
            url: cc.AudioClip
        },
    },

    // use this for initialization
    onLoad: function () {
      
        //this.times = 0.8;
        this.moveRight();
        cc.audioEngine.setEffectsVolume ( 0.2);
    },
    //左右移动
    moveRight: function(){
        
        
        var seq = cc.repeatForever(
             cc.sequence(
                 cc.moveBy(this.times, cc.p(-240, 0)), cc.moveBy(this.times,cc.p(240,0))
             ));
       this.node.runAction(seq);
    },
    noteBox: function(){
        
        return this.node.getBoundingBoxToWorld();
       
    },  
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var _label = cc.find("Canvas/hero").getComponent(hero2);
        
      //障碍物2碰撞框
            if(cc.rectIntersectsRect(_label.node.getBoundingBoxToWorld(), this.noteBox())){
                
                //  cc.log("障碍物区域"+this.noteBox() );
                //  cc.log("角色区域"+_label.node.getBoundingBox() );
                 cc.audioEngine.playEffect(this.pengAudio, false);
                cc.eventManager.removeAllListeners();//移除所有事件监听
                
            }
    },
});
