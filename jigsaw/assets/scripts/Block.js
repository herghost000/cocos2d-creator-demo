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

    init(texture, position, size) {
        const sprite = this.node.getComponent(cc.Sprite);
        const spriteFrame = new cc.SpriteFrame(texture, cc.rect(position.x * size.width, position.y * size.height, size.width, size.height));
        sprite.spriteFrame = spriteFrame;
        this.node.opacity = 255;
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    touchStart(event) {
        this.node.opacity = 128;
        this.startPos = this.node.position;
        this.node.zIndex = 1;
    },

    touchMove(event) {
        const delta = event.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
    },

    touchCancel(event) {
        this.resetTouchStart();
    },

    touchEnd(event) {
        this.resetTouchStart();
    },

    resetTouchStart() {
        this.node.opacity = 255;
        this.node.zIndex = 0;

        const startIndex = this.convert2Index(this.startPos);
        const tmpIndex = this.convert2Index(this.node.position);

        let tmpNode = null;

        if (tmpIndex.x >= 0 && tmpIndex.x < 4 && tmpIndex.y >= 0 && tmpIndex.y < 4) {
            tmpNode = Global.game.blockNodeArr[tmpIndex.y][tmpIndex.x]
        }

        if (tmpNode) {
            this.node.setPosition(tmpNode.position);
            tmpNode.setPosition(this.startPos);

            Global.game.blockNodeArr[startIndex.y][startIndex.x] = tmpNode
            Global.game.blockNodeArr[tmpIndex.y][tmpIndex.x] = this.node;

            if (Global.game.checkSuccess()) {
                Global.game.successHandler();
            }
        } else {
            this.node.setPosition(this.startPos);
        }
    },

    convert2Index(pos) {
        const width = this.node.width;
        const height = this.node.height;

        const fixWidth = (pos.x - Global.game.leftGap) + (width / 2);
        const fixHeight = (pos.y + Global.game.topGap) - (height / 2);

        let x = fixWidth >= 0 ? Math.abs(parseInt(fixWidth / width)) : -1;
        let y = fixHeight <= 0 ? Math.abs(parseInt(fixHeight / height)) : -1;

        return {
            x,
            y
        };
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    }
});