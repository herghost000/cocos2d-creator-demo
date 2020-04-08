cc.Class({
    extends: cc.Component,

    properties: {},

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
        const srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / this.startNodeWidth,
            cc.view.getCanvasSize().height / this.startNodeHeight
        );
        const realWidth = this.startNodeWidth * srcScaleForShowAll;
        const realHeight = this.startNodeHeight * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高重置
        this.node.width = this.startNodeWidth * (cc.view.getCanvasSize().width / realWidth);
        this.node.height = this.startNodeHeight * (cc.view.getCanvasSize().height / realHeight);
        console.log(this.node.width, this.node.height, this.startNodeWidth, this.startNodeHeight)
    }
});