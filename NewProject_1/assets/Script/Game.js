// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var HeroPlayer = require('HeroPlayer')

cc.Class({
  extends: cc.Component,

  properties: {
    // 背景音乐资源
    bgmusic: {
      default: null,
      type: cc.Node
    },
    // 游戏音乐资源
    gameAudio: {
      default: null,
      url: cc.AudioClip
    },
    // 游戏结束音乐资源
    gameOverAudio: {
      default: null,
      url: cc.AudioClip
    },
    // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
    player: {
      default: null,
      type: cc.Node
    },
    // bgsprite1 节点，用于背景移动
    bgsprite1: {
      default: null,
      type: cc.Node
    },
    // bgsprite2 节点，用于背景移动
    bgsprite2: {
      default: null,
      type: cc.Node
    },
    // score label 的引用
    scoreDisplay: {
      default: null,
      type: cc.Label
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    //触摸监听

    this.setEventControl()

    // 初始化计分

    this.score = 0
  },

  start() {},

  // update (dt) {},
  //事件监听
  setEventControl: function() {
    var self = this
    var hero = self.player.getComponent(HeroPlayer) //角色绑定控件
    // var bg1 = self.bgsprite1.getComponent(MoveBg) //绑定背景控件
    // var bg2 = self.bgsprite2.getComponent(MoveBg) //绑定背景控件
    // var mus = self.bgmusic.getComponent(bgmu) //绑定背景音乐控件

    cc.eventManager.addListener(
      {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true, // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
        onTouchBegan: function(touch, event) {
          //实现 onTouchBegan 事件回调函数
          var target = event.getCurrentTarget() // 获取事件所绑定的 target

          // cc.log("点击节点："+ target);

          var locationInNode = target.convertToNodeSpace(touch.getLocation())

          cc.log('当前点击坐标' + locationInNode)

          //   mus.setCp(touch.getLocation())

          hero.node.runAction(hero.setJumpUpAction()) //精灵移动
          //cc.log("跳跃：－－－－－－－－");

          return true
        },
        onTouchMoved: function(touch, event) {
          // 触摸移动时触发
        },
        onTouchEnded: function(touch, event) {
          // 点击事件结束处理
          //   if (self.player.getPositionY() > 0) {
          //     var height = self.player.getPositionY() //背景需要移动的高度
          //     self.player.setPositionY(height / 2)
          //     self.gainScore() //  积分更新
          //     bg1.node.runAction(bg1.setMoveAction(height)) //背景实现向下滚动
          //     bg2.node.runAction(bg2.setMoveAction(height)) //背景实现向下滚动
          //   }
          //  cc.log("跳跃后角色坐标：" + self.player.getPosition() );
        }
      },
      self.node
    )
  }
})
