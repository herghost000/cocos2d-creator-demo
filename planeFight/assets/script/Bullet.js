// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        this.moveBullet(dt);
    },

    moveBullet(dt) {
        this.node.y += dt * 1000;
    },

    onCollisionEnter(other, self) {
        const enemy = other.node.getComponent('Enemy');
        if (enemy && !enemy.checkDead()) {
            Global.game.recyleBullet(self.node);
            enemy.hit();
        }
    }
});