// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        stab: {
            default: null,
            type: cc.Prefab
        },
        playerJumpHeight: 30,
        wallWidth: 80,
        stabCount: 0,
        maxStabCount: 8,
        stabGap: 150
    },

    onLoad() {
        
        this.setInputControl();
      
    },

    start() {
        this.wallWidth = this.node.width * 0.20;
        for (let i = 0; i < this.maxStabCount; i++) {
            this.generateNewStab();
        }
    },

    update(dt) { },

    setInputControl: function () {
        let that = this;
        let listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touches, event) {
                let target = event.getCurrentTarget();
                let locationInNode = target.convertToNodeSpace(touches.getLocation());//获取到点击的坐标
                if (locationInNode.x > that.node.width / 2) {
                    that.playJumpToRight();
                } else {
                    that.playJumpToLeft();
                }
                that.generateNewStab();
            },
            onTouchMoved: function (touches, event) { },
            onTouchEnded: function (touches, event) {
               
             }
        }
        cc.eventManager.addListener(listener, that.node);
    },

    playJumpToRight: function () {
        if (this.player.rotationY === 180) {
            let toR1 = cc.moveTo(0.1, cc.p(this.node.width / 2 - this.wallWidth - this.playerJumpHeight, this.player.getPositionY()));
            let toR2 = cc.moveTo(0.1, cc.p(this.node.width / 2 - this.wallWidth, this.player.getPositionY()));
            this.player.runAction(cc.sequence(toR1, toR2));
        } else {
            let toRight = cc.moveTo(0.2, cc.p(this.node.width / 2 - this.wallWidth, this.player.getPositionY()));
            this.player.runAction(toRight);
        }
        this.player.rotationY = 180;
    },
    playJumpToLeft: function () {
        if (this.player.rotationY === 0) {
            let toL1 = cc.moveTo(0.1, cc.p(-this.node.width / 2 + this.wallWidth + this.playerJumpHeight, this.player.getPositionY()));
            let toL2 = cc.moveTo(0.1, cc.p(-this.node.width / 2 + this.wallWidth, this.player.getPositionY()));
            this.player.runAction(cc.sequence(toL1, toL2));
        } else {
            let toLeft = cc.moveTo(0.2, cc.p(-this.node.width / 2 + this.wallWidth, this.player.getPositionY()));
            this.player.runAction(toLeft);
        }
        this.player.rotationY = 0;
    },
    generateNewStab: function () {
        this.stabCount++;
        let newStab = cc.instantiate(this.stab);
        this.node.addChild(newStab);
        newStab.rotationY = cc.random0To1()<0.5 ? 0 : 180;
        newStab.setPosition(this.createRandomPosition(newStab.rotationY));
    },

    createRandomPosition: function (randomLR) {
        let x = randomLR ? -this.node.width / 2 + this.wallWidth : this.node.width / 2 - this.wallWidth;
        let ry = 0;
        if(this.stabCount<=8)
            ry = this.node.height / 2 - this.stabGap * (this.stabCount + 1);
        else
            ry = this.node.height / 2 - this.stabGap * (8 + 1);
        return cc.p(x, ry);
    }
});
