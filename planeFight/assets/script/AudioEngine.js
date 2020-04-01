cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
        this.current = cc.audioEngine.play(this.audio, true, 1);
    },

    // called every frame
    update: function (dt) {},

    onDestory: function () {
        cc.audioEngine.stop(this.current);
    }
});