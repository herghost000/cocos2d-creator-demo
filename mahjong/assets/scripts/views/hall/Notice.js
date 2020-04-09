cc.Class({
    extends: cc.Component,
    properties: {
        marqueeLabel: cc.RichText,
        mask: cc.Node
    },

    onLoad: function () {
        this.fillDesc();
    },

    update: function () {
        this.updateMarquee();
    },

    updateMarquee() {
        if (this.descs.length) {
            var endIndex = this.descs.length - 1
            var desc = this.descs[endIndex]
            if (desc) {
                this.runMarqeeBar(desc)
                this.descs[endIndex] = null;
            }
        }
    },

    runMarqeeBar: function (desc) {
        this.marqueeLabel.string = desc;
        this.marqueeLabel.node.x = (this.marqueeLabel.node.width + this.mask.width) / 2;
        this.marqueeLabel.node.runAction(cc.sequence(
            cc.moveTo(this.marqueeLabel.node.width / 30, this.marqueeLabel.node.x - (this.marqueeLabel.node.width + this.mask.width), 0),
            cc.callFunc(() => {
                this.descs.pop();
                if (!this.isExistContent()) {
                    this.fillDesc();
                }

            }, this, this)))
    },

    isExistContent: function () {
        if (this.descs[this.descs.length - 1]) {
            return true;
        }
        return false;
    },

    fillDesc() {
        this.descs = [
            "财神降临，玩家***0625尽然在二人麻将高级房赢了1,710金币",
            "恭喜玩家***orz尽然在二人麻将高级房赢了2,110金币,真是太厉害了"
        ]
    }
});