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
        enemyTag: {
            type: cc.Integer,
            default: 0
        },
        brokenAudio: {
            default: null,
            type: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    update(dt) {
        this.node.y -= 5;
    },

    hit() {
        if (this.checkDead()) {
            return;
        }
        this.isDead = true;

        if (this.enemyTag === 1) {
            this.isDead = true;
            cc.audioEngine.play(this.brokenAudio, false, 1);
            this.anim = this.node.getComponent(cc.Animation)
            this.anim.on('finished', this.finished, this);
            this.anim.play();
        }
    },

    finished(type, state) {
        this.anim.off('finished', this.finished, this);
        let curAniClip = this.anim.currentClip;
        this.anim.setCurrentTime(0, curAniClip.name)
        this.anim.sample(curAniClip.name);
        Global.game.recyleEnemy(this.enemyTag, this.node);
        this.isDead = false;
    },

    checkDead() {
        return this.isDead;
    }
});