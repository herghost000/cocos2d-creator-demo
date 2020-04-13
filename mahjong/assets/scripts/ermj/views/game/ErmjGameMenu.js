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