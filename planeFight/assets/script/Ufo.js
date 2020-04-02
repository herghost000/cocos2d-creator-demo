// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const Global = require('Global');

const UfoTag = {
    Ult: 1
};

const UfoName = {
    ULT: 'Ult'
};

cc.Class({
    extends: cc.Component,

    properties: {
        ufoTag: {
            type: cc.Integer,
            default: 0
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        this.node.y -= 5;
    },

    hit() {
        if (this.ufoTag === UfoTag.Ult) {
            Global.game.recyleUfo('Ult', this.node);
            Global.game.enableUltBtn();
        }
    }
});