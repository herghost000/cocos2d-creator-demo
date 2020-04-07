cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.resize();
        cc.view.on("canvas-resize", this.resize, this);
    },

    start () {

    },

    onDestroy() {
        cc.view.off("canvas-resize", this.resize, this);
    },

    resize() {
        const srcScaleForShowAll = Math.min(
            cc.view.getCanvasSize().width / this.node.width,
            cc.view.getCanvasSize().height / this.node.height
        );
        const realWidth = this.node.width * srcScaleForShowAll;
        const realHeight = this.node.height * srcScaleForShowAll;

        // 2. 基于第一步的数据，再做节点宽高重置
        this.node.width = this.node.width * (cc.view.getCanvasSize().width / realWidth);
        this.node.height = this.node.height * (cc.view.getCanvasSize().height / realHeight);
    }
});
