let bgAudio = null;

cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: null,
            type: cc.AudioClip
        }
    },

    onLoad: function () {
        if (this.audio) {
            cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onAfterSceneLaunch, this);
        }
    },

    play() {
        if (bgAudio) {
            this.stop();
        }
        bgAudio = cc.audioEngine.play(this.audio, true, 1);
    },

    stop() {
        cc.audioEngine.stop(bgAudio);
    },

    onDestroy: function () {
        this.stop();
    },

    onAfterSceneLaunch() {
        this.play();
    }
});