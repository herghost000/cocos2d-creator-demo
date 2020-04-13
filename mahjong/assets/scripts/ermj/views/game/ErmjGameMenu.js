const ErmjGameMenuConstant = require('ErmjGameMenuConstant');
const EventBus = require('EventBus')

cc.Class({
    extends: cc.Component,

    properties: {
        menuNode: {
            type: cc.Node,
            default: null
        }
    },

    onLoad() {},

    start() {

    },

    // update (dt) {},

    onMenuClick() {
        this.menuNode.active = !this.menuNode.active;
    },

    onQuitClick() {
        cc.director.loadScene("ErmjHall");
        EventBus.dispatch(ErmjGameMenuConstant.EventType.JUMP_TO_ERMJ_HALL);
    },

    onSetClick() {

    },

    onRecordClick() {

    },

    onHelpClick() {

    },

    onFeedBackClick() {

    }
});