// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const Global = require('Global');
const Utils = require('Utils');

const BULLET_NODE_NAME = 'bullet';
const ENEMY_NODE_NAME = 'enemy';

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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.game = this;

        const manager = cc.director.getCollisionManager();
        manager.enabled = true; //开启碰撞检测
        // manager.enabledDebugDraw = true; //显示碰撞检测区域

        this.bulletPool = new cc.NodePool();
        this.bulletDistance = this.bulletCount = 8;
        this.hero.zIndex = 1;
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    start() {
        this.designSize = cc.view.getDesignResolutionSize();
    },

    update(dt) {
        this.scrollBackground(dt);
        this.updateBullet();
        this.updateEnemy(dt, 1, 1);
        this.updateEnemy(dt, 2, 3.5);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
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
        const delta = event.getDelta();
        this.hero.x += delta.x;
        this.hero.y += delta.y;

        this.crossHandler(delta);
    },

    touchCancel(event) {

    },

    touchEnd(event) {

    },

    updateEnemy(dt, tag, enemyDuration) {
        if (!this[`enemy${tag}Timer`]) {
            this[`enemy${tag}Timer`] = 0;
        }
        if (this[`enemy${tag}Timer`] >= enemyDuration) {
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