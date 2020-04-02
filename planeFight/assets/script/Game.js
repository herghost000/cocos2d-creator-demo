// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Global = require('Global');
const Utils = require('Utils');

const BULLET_NODE_NAME = 'bullet';

const GameStatus = {
    START: 'start',
    PAUSE: 'pause',
    END: 'end'
};

const UfoTag = {
    ULT: 1
};

const UfoName = {
    ULT: 'Ult'
};

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            type: cc.Node,
            default: null
        },
        speed: {
            type: cc.Float,
            default: 250
        },
        hero: {
            type: cc.Node,
            default: null
        },
        bullet: {
            type: cc.Prefab,
            default: null
        },
        enemy1: {
            type: cc.Prefab,
            default: null
        },
        enemy2: {
            type: cc.Prefab,
            default: null
        },
        enemy3: {
            type: cc.Prefab,
            default: null
        },
        menu: {
            type: cc.Node,
            default: null
        },
        ultButton: {
            type: cc.Button,
            default: null
        },
        ufoUlt: {
            type: cc.Prefab,
            default: null
        },
        score: {
            type: cc.Label,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;
        this.clearScore();
        this.disableUltBtn();
        this.menu.zIndex = 10;
        this.showMenu();

        const manager = cc.director.getCollisionManager();
        manager.enabled = true; //开启碰撞检测
        // manager.enabledDebugDraw = true; //显示碰撞检测区域

        this.bulletPool = new cc.NodePool();
        this.bulletDistance = this.bulletCount = 8;
        this.heroStartPos = this.hero.position;
        this.hero.zIndex = 1;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    start() {
        this.designSize = {
            width: cc.winSize.width || cc.view.getDesignResolutionSize().width,
            height: cc.winSize.height
        };
        this.gameStatus = null;
    },

    update(dt) {
        if (this.gameStatus === GameStatus.START) {
            this.scrollBackground(dt);
            this.updateBullet();
            this.updateEnemy(dt, 1, 1);
            this.updateEnemy(dt, 2, 3.5);
            this.updateEnemy(dt, 3, 20.33);
            this.updateUfo(dt, UfoName.ULT, 10.7);
        }
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    addScore(num) {
        this.score.string = this.scoreNum = this.scoreNum + num;
    },

    clearScore() {
        this.score.string = this.scoreNum = 0;
    },

    ultClick() {
        this.node.children.forEach((element) => {
            if (element.name.indexOf('enemy') !== -1) {
                const enemy = element.getComponent('Enemy');
                enemy.deadHandler && enemy.deadHandler();
            }
        });
        this.disableUltBtn();
    },

    endGame() {
        this.gameStatus = GameStatus.END;
        this.node.children.forEach((element) => {
            if (element.name.indexOf('enemy') !== -1) {
                element.destroy();
            }
            if (element.name == BULLET_NODE_NAME) {
                element.destroy();
            }
        });
        this.hero.setPosition(this.heroStartPos);
        this.clearScore();
        this.showMenu();
    },

    enableUltBtn() {
        this.ultButton.interactable = true;
    },

    disableUltBtn() {
        this.ultButton.interactable = false;
    },

    showMenu() {
        this.menu.active = true;
    },

    hideMenu() {
        this.menu.active = false;
    },

    startClick() {
        this.gameStatus = GameStatus.START;
        this.hideMenu();
    },

    scrollBackground(dt) {
        this.bg.y -= this.speed * dt;
        if (this.bg.y <= -this.designSize.height) {
            const distance = Math.abs(this.bg.y) - this.designSize.height;
            this.bg.y = -distance;
        }
    },

    touchStart(event) {

    },

    touchMove(event) {
        if (this.gameStatus !== GameStatus.START) {
            return;
        }
        const delta = event.getDelta();
        this.hero.x += delta.x;
        this.hero.y += delta.y;

        this.crossHandler(delta);
    },

    touchCancel(event) {

    },

    touchEnd(event) {

    },

    updateUfo(dt, name, duration) {
        if (!this[`ufo${name}Timer`]) {
            this[`ufo${name}Timer`] = 0;
        }
        if (this[`ufo${name}Timer`] >= duration) {
            this[`ufo${name}Timer`] = 0;
            this.createUfo(name);
            this.ufoCrossHandler(name);
        }
        this[`ufo${name}Timer`] += dt;
    },

    createUfo(name) {
        let ufo = null;
        if (!this[`ufo${name}Pool`]) {
            this[`ufo${name}Pool`] = new cc.NodePool();
        }
        if (this[`ufo${name}Pool`].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            ufo = this[`ufo${name}Pool`].get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            ufo = cc.instantiate(this[`ufo${name}`]);
        }
        this.node.addChild(ufo);
        ufo.name = `ufo${name}`;
        const leftX = -(this.designSize.width / 2) + ufo.width / 2;
        const rightX = this.designSize.width / 2 - ufo.width / 2;
        ufo.setPosition(cc.v2(Utils.randomNum(leftX, rightX), (this.designSize.height / 2 + ufo.height / 2)));
    },

    recyleUfo(name, ufo) {
        this[`ufo${name}Pool`].put(ufo);
    },

    ufoCrossHandler(name) {
        this.node.children.forEach(element => {
            if (element.name === `ufo${name}`) {
                if (element.y <= -(this.designSize.height / 2) - element.height / 2) {
                    this.recyleUfo(name, element);
                }
            }
        });
    },

    updateEnemy(dt, tag, duration) {
        if (!this[`enemy${tag}Timer`]) {
            this[`enemy${tag}Timer`] = 0;
        }
        if (this[`enemy${tag}Timer`] >= duration) {
            this[`enemy${tag}Timer`] = 0;
            this.createEnemy(tag);
            this.enemyCrossHandler(tag);
        }
        this[`enemy${tag}Timer`] += dt;
    },

    createEnemy(tag) {
        let enemy = null;
        if (!this[`enemy${tag}Pool`]) {
            this[`enemy${tag}Pool`] = new cc.NodePool();
        }
        if (this[`enemy${tag}Pool`].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            enemy = this[`enemy${tag}Pool`].get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            enemy = cc.instantiate(this[`enemy${tag}`]);
        }
        this.node.addChild(enemy);
        enemy.name = `enemy${tag}`;
        const leftX = -(this.designSize.width / 2) + enemy.width / 2;
        const rightX = this.designSize.width / 2 - enemy.width / 2;
        enemy.setPosition(cc.v2(Utils.randomNum(leftX, rightX), (this.designSize.height / 2 + enemy.height / 2)));
    },

    recyleEnemy(tag, enemy) {
        this[`enemy${tag}Pool`].put(enemy);
    },

    enemyCrossHandler(tag) {
        this.node.children.forEach(element => {
            if (element.name === `enemy${tag}`) {
                if (element.y <= -(this.designSize.height / 2) - element.height / 2) {
                    this.recyleEnemy(tag, element);
                }
            }
        });
    },

    updateBullet() {
        this.bulletDistance++;
        if (this.bulletDistance >= this.bulletCount) {
            this.bulletDistance = 0;
            this.createBullet();
            this.bulletCrossHandler();
        }
    },

    createBullet() {
        let bullet = null;
        if (this.bulletPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bullet = this.bulletPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bullet = cc.instantiate(this.bullet);
        }
        this.node.addChild(bullet);
        bullet.name = BULLET_NODE_NAME;
        bullet.setPosition(cc.v2(this.hero.x, this.hero.y + this.hero.height / 2));
    },

    recyleBullet(bullet) {
        this.bulletPool.put(bullet);
    },

    bulletCrossHandler() {
        this.node.children.forEach(element => {
            if (element.name === BULLET_NODE_NAME) {
                if (element.y >= this.designSize.height / 2) {
                    this.recyleBullet(element);
                }
            }
        });
    },

    crossHandler(delta) {
        if (this.hero.x - this.hero.width / 2 <= -(this.designSize.width / 2)) {
            this.hero.x -= delta.x;
        }

        if (this.hero.y - this.hero.height / 2 <= -(this.designSize.height / 2)) {
            this.hero.y -= delta.y;
        }

        if (this.hero.x + this.hero.width / 2 >= (this.designSize.width / 2)) {
            this.hero.x -= delta.x;
        }

        if (this.hero.y + this.hero.height / 2 >= (this.designSize.height / 2)) {
            this.hero.y -= delta.y;
        }
    }
});