const Room = require('Room');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.bindRoomClickEvent();
    },

    start() {

    },

    onDestroy() {
        this.unBindRoomClickEvent();
    },

    bindRoomClickEvent() {
        const self = this;
        this.node.children.forEach(function (element) {
            element.on(cc.Node.EventType.TOUCH_START, self.onRoomClick, self);
        });
    },

    unBindRoomClickEvent() {
        const self = this;
        this.node.children.forEach(function (element) {
            element.off(cc.Node.EventType.TOUCH_START, self.onRoomClick, self);
        });
    },

    onRoomClick(event) {
        const element = event.target;
        const nodeName = element.name;
        if (Room.RoomNodeName.ROOM_TEX_1 === nodeName) {

        } else if (Room.RoomNodeName.ROOM_TEX_2 === nodeName) {

        } else if (Room.RoomNodeName.ROOM_TEX_3 === nodeName) {

        } else if (Room.RoomNodeName.ROOM_TEX_4 === nodeName) {

        }
        console.log(element)
    }
});