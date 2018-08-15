import { character, act } from "./cfg"

const { ccclass, property } = cc._decorator;

@ccclass
export default class Cell extends cc.Component {
    @property([cc.SpriteFrame])
    pic: Array<cc.SpriteFrame> = []
    act: act
    x: number = 0
    y: number = 0
    show(act: act) {
        this.act = act;
        let chartype = this.node.getChildByName("frame").getComponent(cc.Sprite);
        chartype.spriteFrame = this.pic[this.act]
    }
    //   onLoad(){
    //       this.show(0)
    //   }
}
