cc.Class({
  extends: cc.Component,

  properties: {},

  onLoad() {},

  start() {
    this._initNodeTouchEvent();
  },
  _initNodeTouchEvent() {
    //监听事件
    this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
  },

  _destroyTouchEvent() {
    //销毁事件
    this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this);
    this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
    this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    cc.log("销毁事件...");
  },

  _onTouchBegin: function (event) {
    //获取当前点击的全局坐标
    let temp = event.getLocation();
    //获取当前点击的局部坐标
    let tempClick = this.node.convertToNodeSpaceAR(temp)

    this.newClickNode(tempClick, function (node) {

      if (!node) return

      //杀死所有存在的粒子，然后重新启动粒子发射器。
      node.getComponent(cc.ParticleSystem).resetSystem();

      cc.log("子节点数:" + this.node.children.length);

      this.node.children.forEach(element => {

        if (element.name === 'clickNode') {

          //获取粒子系统组件
          let particle = element.getComponent(cc.ParticleSystem);

          //指示粒子播放是否完毕
          if (particle.stopped) {
            //特效播放完毕的节点放入对象池
            this._clickPool.put(element);
            cc.log("顺利回收...");
          }
        }
      });
    }.bind(this));
  },

  _onTouchMoved: function (event) {
    cc.log('_onTouchMoved');
  },

  _onTouchEnd: function (event) {
    cc.log('_onTouchEnd');
  },

  _onTouchCancel: function (event) {
    cc.log('_onTouchCancel');
  },

  onDestroy() {
    //销毁事件
    this._destroyTouchEvent();
  },

  newClickNode(position, callBack) {
    let newNode = null;
    if (!this._clickPool) {

      //初始化对象池
      this._clickPool = new cc.NodePool();
    }
    if (this._clickPool.size() > 0) {

      //从对象池请求对象
      newNode = this._clickPool.get();
      cc.log('回收的元素：', newNode);
      this.setClickNode(newNode, position, callBack);
    } else {

      // 如果没有空闲对象，我们就用 cc.instantiate 重新创建
      cc.loader.loadRes("prefab/smoke", cc.Prefab, function (err, prefab) {
        if (err) {
          return;
        }
        newNode = cc.instantiate(prefab);
        this.setClickNode(newNode, position, callBack);
      }.bind(this));
    }

  },

  setClickNode(newNode, position, callBack) {
    newNode.name = "clickNode"; //设置节点名称
    newNode.setPosition(position); //设置节点位置
    this.node.addChild(newNode); //将新的节点添加到当前组件所有节点上
    if (callBack) {
      callBack(newNode); //回调节点
    }

  },
});