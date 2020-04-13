const ErmjGameMenuConstant = require('ErmjGameMenuConstant');
const EventBus = require('EventBus')

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        EventBus.addEventListener(ErmjGameMenuConstant.EventType.JUMP_TO_ERMJ_HALL, this.jumpToErmjHall, this);
    },

    start() {

    },

    // update (dt) {},

    onDestroy() {
        EventBus.removeEventListener(ErmjGameMenuConstant.EventType.JUMP_TO_ERMJ_HALL, this.jumpToErmjHall, this);
    },

    jumpToErmjHall() {

    }
});