cc.Class({
    extends: cc.Component,

    properties: {
        TOTAL_NUM: 20,
        OPT_HEIGHT: 80,
        inertia: true,
        itemPrefab: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad() {
        this.scrollView = this.node.getComponent(cc.ScrollView)
        this.content = this.scrollView.content;
        this.valueSet = [];
        for (let i = 1; i <= this.TOTAL_NUM; i++) {
            this.valueSet.push(i);
        }

        this.optItemSet = [];
        this.pageNum = Math.ceil((this.node.height / this.OPT_HEIGHT) + 1);
        this.scrollHeight = (this.pageNum * this.OPT_HEIGHT) - this.node.height;
        for (let i = 0; i < this.pageNum; i++) {
            const item = cc.instantiate(this.itemPrefab);
            this.content.addChild(item);
            this.optItemSet.push(item);
        }

        this.isTouch = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
    },

    start() {
        this.startY = this.content.y;
        this.lastY = this.content.y;
        this.startIndex = 0;
        this.loadRecord(this.startIndex);
    },

    update(dt) {
        this.scrollViewLoadRecord();
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
    },

    loadRecord(startIndex) {
        this.startIndex = startIndex;
        for (let i = 0; i < this.pageNum; i++) {
            const label = this.optItemSet[i].getChildByName('src').getComponent(cc.Label);
            label.string = this.valueSet[(startIndex + i) % this.TOTAL_NUM];
        }
    },

    scrollViewLoadRecord() {
        if (!this.isTouch && !this.scrollView.isAutoScrolling()) {
            this.content.y += 4;
        }

        if (this.content.y >= this.startY + this.scrollHeight) {
            const dis = this.content.y - (this.startY + this.scrollHeight);
            this.content.y = this.startY + dis;
            this.startIndex++;
            if (this.startIndex === this.TOTAL_NUM) {
                this.startIndex = 0;
            }
            this.loadRecord(this.startIndex);
        }

        if (this.content.y <= this.startY) {
            this.startIndex--;
            this.startIndex += this.TOTAL_NUM;
            if (this.startIndex === 0) {
                this.startIndex = 0;
            }
            this.loadRecord(this.startIndex);
            this.content.y = this.startY + this.OPT_HEIGHT;
        }
    },

    touchStart() {
        this.isTouch = true;
    },

    touchEnd() {
        this.isTouch = false;
        if (!this.inertia) {
            this.scrollView.stopAutoScroll();
        }
    }
});