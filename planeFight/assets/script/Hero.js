// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        brokenAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    onCollisionEnter(other, self) {
        const enemy = other.node.getComponent('Enemy');
        if (enemy && !enemy.checkDead()) {
            this.anim = self.getComponent(cc.Animation);
            const clips = this.anim.getClips();
            const brokenClip = clips[clips.length - 1];
            cc.audioEngine.play(this.brokenAudio, false, 1);
            this.anim.on('finished', this.finished, this);
            this.anim.play(brokenClip.name);
        }
    },

    finished(type, state) {
        this.anim.off('finished', this.finished, this);
        const defaultClip = this.anim.defaultClip;
        this.anim.setCurrentTime(0, defaultClip.name)
        this.anim.sample(defaultClip.name);
        this.anim.play(defaultClip.name);
        Global.game.endGame();
    },
});