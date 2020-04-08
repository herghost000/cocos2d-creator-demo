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
        this.startZoomV2 = this.node.getScale(cc.v2());
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
        // console.log(`画布：${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`)
        // console.log(`设计：${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`)
        // console.log(`像素比：${cc.view.getDevicePixelRatio()}`)
        // if (cc.view.getCanvasSize().height > cc.view.getDesignResolutionSize().height) {
        const radio = cc.view.getDevicePixelRatio();
        const canvasWidth = cc.view.getCanvasSize().width / radio;
        const canvasHeight = cc.view.getCanvasSize().height / radio;
        const designWidth = cc.view.getDesignResolutionSize().width;
        const designHeight = cc.view.getDesignResolutionSize().height;
        // console.log(`画布：${cc.view.getCanvasSize().width} x ${cc.view.getCanvasSize().height}`)
        // console.log(`设计：${cc.view.getDesignResolutionSize().width} x ${cc.view.getDesignResolutionSize().height}`)
        // console.log(`像素比：${cc.view.getDevicePixelRatio()}`, canvasWidth / (designWidth * canvasHeight / designHeight))
        const zoomScale = canvasWidth / (designWidth * canvasHeight / designHeight);
        const newZoomV2 = cc.v2(this.startZoomV2.x * zoomScale, this.startZoomV2.y * zoomScale);
        if (zoomScale < 1) {
            this.node.setScale(newZoomV2);
        } else {
            this.node.setScale(this.startZoomV2)
        }

        // } else {
        //     this.node.setScale(1);
        // }
    }
});