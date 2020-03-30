// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Node,
        knifeNode: cc.Node,
        knifePrefab: cc.Prefab,
        gameNameLabel: cc.Label,
        scoreLabel: cc.Label,
        levelLabel: cc.Label,
        startButton: cc.Button,
        restartButton: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.scoreNum = 0;
        this.levelNum = 1;
        this.canThrow = true;
        this.targetNode.zIndex = 1;
        this.startPos = this.knifeNode.position;
        this.knifeNodeList = [];
    },

    start() {
        this.targetRotation = 2;
    },

    update(dt) {
        this.targetNode.angle = (this.targetNode.angle + this.targetRotation) % 360;

        for (let knifeNode of this.knifeNodeList) {
            knifeNode.angle = (knifeNode.angle + this.targetRotation) % 360;
            const r = this.targetNode.width / 2;
            const rad = Math.PI * knifeNode.angle / 180;

            const x = this.targetNode.x + r * Math.sin(rad)
            const y = this.targetNode.y - r * Math.cos(rad)

            knifeNode.x = x;
            knifeNode.y = y;
        }
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },

    touchStart(event) {
        if (this.canThrow) {
            this.canThrow = false;
            this.knifeNode.runAction(cc.sequence(
                cc.moveTo(0.15, cc.v2(this.knifeNode.x, this.targetNode.y - this.targetNode.height / 2)),
                cc.callFunc(() => {
                    let isHit = false;
                    const gap = 13;

                    for (let knifeNode of this.knifeNodeList) {
                        if (Math.abs(knifeNode.angle) < gap || (360 - Math.abs(knifeNode.angle)) < gap) {
                            isHit = true;
                            break;
                        }
                    }

                    if (isHit) {
                        return this.knifeNode.runAction(cc.sequence(
                            cc.spawn(
                                cc.moveTo(0.25, cc.v2(this.knifeNode.x, -cc.winSize.height)),
                                cc.rotateTo(0.25, 30)
                            ),
                            cc.callFunc(() => {
                                this.gameOver();
                            })
                        ));
                    }

                    const knifeNode = cc.instantiate(this.knifePrefab);
                    knifeNode.setPosition(this.knifeNode.position);
                    this.node.addChild(knifeNode);
                    this.knifeNode.setPosition(this.startPos);
                    this.knifeNodeList.push(knifeNode);
                    this.canThrow = true;
                    this.scoreLabel.string = ++this.scoreNum;

                    if (this.checkPass()) {
                        this.nextLevel();
                    }

                })
            ));
        }
    },

    gameOver() {
        this.restartButton.node.active = true;
    },

    removeAllKnifePrefab() {
        for (let knifeNode of this.knifeNodeList) {
            knifeNode.removeFromParent(true);
        }
    },

    checkPass() {
        if (((this.scoreNum / 7) % this.levelNum) === 0) {
            return true;
        }
        return false;
    },

    nextLevel() {
        this.removeAllKnifePrefab();
        this.knifeNodeList = [];
        this.targetRotation += 0.3;
        this.levelLabel.string = ++this.levelNum;
    },

    startClick() {
        this.gameNameLabel.node.active = false;
        this.startButton.node.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
    },

    restartClick() {
        this.restartButton.node.active = false;
        this.scoreLabel.string = this.scoreNum = 0;
        this.levelLabel.string = this.levelNum = 1;
        this.canThrow = true;
        this.targetNode.zIndex = 1;
        this.knifeNode.setPosition(this.startPos);
        this.knifeNode.angle = 0;
        this.removeAllKnifePrefab();
        this.knifeNodeList = [];
        this.targetRotation = 2;
    }
});