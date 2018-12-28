// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    //主角跳跃高度
    jumpHeight: 0,
    //主角跳跃持续时间
    jumpTimes: 0,
    //掉落速度
    maxMoveSpeed: 0,
    //加速度
    accel: 0
  },
  //跳跃
  setJumpUpAction: function() {
    // 跳跃上升
    var jumpUp = cc.moveBy(this.jumpTimes, cc.v2(0, this.jumpHeight))
    //jumpUp.reverse();
    return jumpUp
  },
  //掉落
  setJumpDownAction: function() {
    //下落
    var jumpDown = cc.moveBy(this.jumpTimes, cc.v2(0, -this.maxMoveSpeed))
    return jumpDown
  },
  setJumpRunAction: function() {
    // 初始化跳跃动作
    this.jumpAction = this.setJumpUpAction()
    //掉落动作
    this.maxMoveSpeed = this.setJumpDownAction()
    //包装动作
    var seq = cc.sequence(this.jumpAction, this.maxMoveSpeed)
    this.node.runAction(seq)
  },
  //玩家不操作时，角色进行下坠
  heroDownMove: function() {
    //下落
    var heroDown = cc.moveBy(0.8, cc.v2(0, -5))
    return heroDown
  },
  // use this for initialization
  onLoad: function() {
    this.setJumpRunAction()
  },
  noteBox: function() {
    return this.node.getBoundingBox()
  },
  // called every frame, uncomment this function to activate update callback
  update: function(dt) {
    this.node.runAction(this.heroDownMove()) //精灵移动
  }
})
