// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: {
            default: null,
            type: cc.Prefab
        },
        win: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        this.win.active = false;
        this.destoryBlockComponent();
        this.blockNodeArr = [];
        this.leftGap = 0;
        this.topGap = 0;
        cc.loader.loadRes(`textures/jigsaw`, cc.Texture2D, (err, texture) => {
            if (err) {
                return cc.log(err)
            }
            const winSize = cc.winSize;
            const winWidth = Math.min(winSize.width, winSize.height);
            const imgWidth = texture.width;
            const imgHeight = texture.height;
            const minImgWidth = Math.min(imgWidth, imgHeight);
            const imgBlockWidth = minImgWidth / 4;

            let scale = winWidth / minImgWidth;
            let tmpImgWidth = imgWidth * scale;
            let tmpImgHeight = imgHeight * scale;
            tmpImgWidth *= 0.9
            tmpImgHeight *= 0.9;

            const minWidth = Math.min(tmpImgWidth, tmpImgHeight);
            const blockWidth = minWidth / 4;

            this.leftGap = (winSize.width - tmpImgWidth) / 2;
            this.topGap = (winSize.height - tmpImgHeight) / 2;

            for (let y = 0; y < 4; y++) {
                this.blockNodeArr[y] = []
                for (let x = 0; x < 4; x++) {
                    const block = cc.instantiate(this.blockPrefab);
                    this.node.addChild(block);
                    block.width = blockWidth;
                    block.height = blockWidth;
                    block.setPosition(cc.v2(x * blockWidth + this.leftGap, -y * blockWidth - this.topGap));
                    block.getComponent('Block').init(texture, cc.v2(x, y), cc.size(imgBlockWidth, imgBlockWidth));
                    block.mPos = cc.v2(x, y);
                    this.blockNodeArr[y][x] = block;
                }
            }

            this.randomPos();
        });
    },

    randomPos() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const block = this.blockNodeArr[y][x];
                const exIndex = {
                    x: parseInt(Math.random() * 4),
                    y: parseInt(Math.random() * 4)
                };
                const exBlock = this.blockNodeArr[exIndex.y][exIndex.x];

                const pos = block.position;
                const exPos = exBlock.position;

                block.setPosition(exPos);
                exBlock.setPosition(pos);

                this.blockNodeArr[y][x] = exBlock;
                this.blockNodeArr[exIndex.y][exIndex.x] = block;
            }
        }
    },

    checkSuccess() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const block = this.blockNodeArr[y][x];
                if (block.mPos.y !== y || block.mPos.x !== x) {
                    return false;
                }
            }
        }

        return true;
    },

    successHandler() {
        this.destoryBlockComponent();
        this.win.active = true;
    },

    destoryBlockComponent() {
        if (!(this.blockNodeArr instanceof Array)) {
            return;
        }
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.blockNodeArr[y] && this.blockNodeArr[x]) {
                    const block = this.blockNodeArr[y][x];
                    const blockComponent = block.getComponent('Block');
                    blockComponent.onDestroy();
                }
            }
        }
    }
});