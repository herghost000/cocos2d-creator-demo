cc.Class({
    extends: cc.Component,

    properties: {
        //积分更新
        Scores: {
            default: null,
            type: cc.Label
        },

    },
    //积分更新
    disScore: function () {
        this.score =  cc.sys.localStorage.getItem("ScoreDis");//读取本地存储的积分
        // 更新 scoreDisplay Label 的文字
        this.Scores.string = "Score: " + this.score.toString();//显示
    },
    
    // use this for initialization
    onLoad: function () {
       this.disScore();//首次加载时候调用
    },
 

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    
        
    // },
});
