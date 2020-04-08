const Type = cc.Enum({
    Zoom: 1,
    Stretch: 2
});

cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            type: Type,
            default: Type.Zoom
        }
    },

    onLoad() {
        this.startNodeWidth = this.node.width;
        this.startNodeHeight = this.node.height;
        this.resize();
        cc.view.on("canvas-resize", this.resize, this);
    },

    start() {

    },

    onDestroy() {
        cc.view.off("canvas-resize", this.resize, this);
    },

    resize() {
        if (this.type === Type.Zoom) {
            let scaleForShowAll = Math.min(
                cc.view.getCanvasSize().width / this.startNodeWidth, // 0.63
                cc.view.getCanvasSize().height / this.startNodeHeight // 0.52
            );

            let realWidth = this.startNodeWidth * scaleForShowAll;
            let realHeight = this.startNodeHeight * scaleForShowAll;

            // 2. 基于第一步的数据，再做缩放适配
            this.node.scale = Math.max(
                cc.view.getCanvasSize().width / realWidth,
                cc.view.getCanvasSize().height / realHeight
            );
        }
        if (this.type === Type.Stretch) {
            let scaleForShowAll = Math.min(
                cc.view.getCanvasSize().width / this.startNodeWidth, // 0.63
                cc.view.getCanvasSize().height / this.startNodeHeight // 0.52
            );

            let realWidth = this.startNodeWidth * scaleForShowAll;
            let realHeight = this.startNodeHeight * scaleForShowAll;

            this.node.setScale(cc.v2(cc.view.getCanvasSize().width / realWidth, cc.view.getCanvasSize().height / realHeight));
        }
    }
});