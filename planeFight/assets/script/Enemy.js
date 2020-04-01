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
        this.hitNum = 0;
    },

    start() {

    },

    update(dt) {
        if (this.enemyTag === 1) {
            this.node.y -= 5;
        }

        if (this.enemyTag === 2) {
            this.node.y -= 4;
        }

        if (this.enemyTag === 3) {
            this.node.y -= 1;
        }
    },

    hit() {
        if (this.checkDead()) {
            return;
        }

        if (this.enemyTag === 1) {
            this.isDead = true;
            cc.audioEngine.play(this.brokenAudio, false, 1);
            this.anim = this.node.getComponent(cc.Animation)
            this.anim.on('finished', this.finished, this);
            this.anim.play();
        }

        if (this.enemyTag === 2) {
            if (++this.hitNum === 6) {
                this.isDead = true;
                this.hitNum = 0;
                cc.audioEngine.play(this.brokenAudio, false, 1);
                this.anim = this.node.getComponent(cc.Animation)
                this.anim.on('finished', this.finished, this);
                this.anim.play();
            }
        }

        if (this.enemyTag === 3) {
            if (++this.hitNum === 50) {
                this.isDead = true;
                this.hitNum = 0;
                cc.audioEngine.play(this.brokenAudio, false, 1);
                this.anim = this.node.getComponent(cc.Animation)
                this.anim.on('finished', this.finished, this);
                const brokenClip = this.getBrokenClip();
                this.anim.play(brokenClip.name);
            }
        }
    },

    finished(type, state) {
        this.anim.off('finished', this.finished, this);
        const defaultClip = this.anim.defaultClip;
        this.anim.setCurrentTime(0, defaultClip.name)
        this.anim.sample(defaultClip.name);
        if (this.enemyTag === 3) {
            this.anim.play(defaultClip.name);
        }
        Global.game.recyleEnemy(this.enemyTag, this.node);
        this.isDead = false;
    },

    getBrokenClip() {
        const clips = this.anim.getClips();
        const brokenClip = clips[clips.length - 1];
        return brokenClip;
    },

    checkDead() {
        return this.isDead;
    }
});