cc.Class({
    extends: cc.Component,

    properties: {
        //是否开启音乐  默认开启
        isOpen: true,
        // 游戏音乐资源
        gameAudio: {
            default: null,
            url: cc.AudioClip
        },
        
    },

    // use this for initialization
    onLoad: function () {
        this.isOpen = true;//开启音乐
        cc.audioEngine.playMusic ( this.gameAudio, true );
        
    },
    //检查音乐开启状态
    checkMusic:function(){
        
        return isOpen;
    },
    //获取点击坐标
    setCp:function(pos){
        
        var rec = cc.rectContainsPoint(this.node.getBoundingBoxToWorld(),pos) ;
     
        if(rec){
            //检查音乐开启状态
            //如果音乐开启了则关闭音乐和音效
            if(this.isOpen){
             //if (cc.audioEngine.isMusicPlaying()) {
                cc.audioEngine.pauseMusic();//暂停正在播放音乐
                cc.log("暂停正在播放音乐");
                //this.node.addChild("Texture/menu_music_off.png");
                this.isOpen = false;
                }
            else {
              // cc.log("music is not playing");
              cc.audioEngine.resumeMusic ();//恢复背景音乐
              cc.log("恢复背景音乐");
              this.isOpen = true;
             }
             
        }
    },

    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

        
    // },
});
