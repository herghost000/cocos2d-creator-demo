// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.resize();
        cc.view.on("canvas-resize", this.resize, this);
    },

    start() {

    },

    // update (dt) {},

    onDestroy() {
        cc.view.off("canvas-resize", this.resize, this);
    },

    resize() {
        console.log(`画布：${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`)
        console.log(`设计：${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`)
        console.log(`像素比：${cc.view.getDevicePixelRatio()}`)
        // if (cc.view.getCanvasSize().height > cc.view.getDesignResolutionSize().height) {
        const radio = cc.view.getDevicePixelRatio();
        const canvasWidth = cc.view.getCanvasSize().width / radio;
        const canvasHeight = cc.view.getCanvasSize().height / radio;
        const designWidth = cc.view.getDesignResolutionSize().width;
        const designHeight = cc.view.getDesignResolutionSize().height;
        console.log(`画布：${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`)
        console.log(`设计：${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`)
        console.log(`像素比：${cc.view.getDevicePixelRatio()}`, canvasWidth / (designWidth * canvasHeight / designHeight))
        if ((canvasWidth / (designWidth * canvasHeight / designHeight)) < 1) {
            this.node.setScale(canvasWidth / (designWidth * canvasHeight / designHeight));
        } else {
            this.node.setScale(1)
        }

        // } else {
        //     this.node.setScale(1);
        // }
    }
});