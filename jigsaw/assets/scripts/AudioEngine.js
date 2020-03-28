let bgAudio = null;

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
        cc.log('bgAudio', bgAudio)
        if (bgAudio === null) {
            bgAudio = cc.audioEngine.play(this.audio, true, 1);
        }

    },

    stop() {
        cc.audioEngine.stop(bgAudio);
    },

    onDestroy: function () {

    }
});