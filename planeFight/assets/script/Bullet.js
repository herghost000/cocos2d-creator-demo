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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        this.moveBullet(dt);
    },

    moveBullet(dt) {
        this.node.y += dt * 500;
    },

    onCollisionEnter(other, self) {
        const enemy = other.node.getComponent('Enemy');
        if (other.tag === 1) {
            if (enemy && !enemy.checkDead()) {
                Global.game.recyleBullet(self.node);
                enemy.hit();
            }
        }

        if (other.tag === 2) {
            if (enemy && !enemy.checkDead()) {
                Global.game.recyleBullet(self.node);
                enemy.hit();
            }
        }

        if (other.tag === 3) {
            if (enemy && !enemy.checkDead()) {
                Global.game.recyleBullet(self.node);
                enemy.hit();
            }
        }

    }
});