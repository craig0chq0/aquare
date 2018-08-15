import { character, bgWidth, bgHeight, act, zhexing, shapeList, tuzixing } from "./cfg"

import cell from "./cell"
const { ccclass, property } = cc._decorator;

@ccclass
export default class Character extends cc.Component {

    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Prefab)
    private cellPfb: cc.Prefab = null
    type: character = null
    background: cell[][] = []
    shape: cell[][] = []

    private csret: {
        pointX: number,
        pointY: number,
        shape: number[][]
    } = null

    init() {
        let cellWidth = this.bg.width / bgWidth;
        let cellHeight = this.bg.height / bgHeight;
        for (let i = 0; i < bgWidth; ++i) {
            this.background[i] = [];
            for (let j = 0; j < bgHeight; ++j) {
                let pfbNode = cc.instantiate(this.cellPfb);
                pfbNode.parent = this.bg;
                this.background[i][j] = pfbNode.getComponent(cell)
                this.background[i][j].show(act.close);
                pfbNode.x = i * cellWidth + cellWidth / 2;
                pfbNode.y = j * cellHeight + cellHeight / 2;
                this.background[i][j].x = i;
                this.background[i][j].y = j;
            }
        }
        // let newshape=this.opearteShape(tuzixing);
        // let new1=this.opearteShape(newshape)
        // this.draw(2,2,new1);

    }

    // creatcharacter(type: character) {
    //     this.type = type;

    //     switch (this.type) {
    //         case character.zhexing:
    //             this.shape[0]
    //     }
    // }

    onLoad() {
        this.init();
        this.csret = this.createShape();
        this.schedule(() => {
            this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
            if (!this.check(this.csret.pointX, this.csret.pointY - 1, this.csret.shape)) {
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
            }
            else {
                this.csret.pointY--;
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
            }

            this.changeShape({ keyCode: 38 });
        }, 2, cc.macro.REPEAT_FOREVER, 2);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.changeShape, this);
    }

    opearteShape(oldShape: number[][]) {
        let newShape: number[][] = [];
        for (let i = 0; i < oldShape.length; ++i) {
            newShape[i] = [oldShape[i][1], -oldShape[i][0]];
        }
        return newShape;
    }

    draw(pointX: number, pointY: number, shape: number[][]) {
        for (let i = 0; i < shape.length; ++i) {
            this.background[pointX + shape[i][0]][pointY + shape[i][1]].show(act.open);
        }
    }
    clear(pointX: number, pointY: number, shape: number[][]) {
        for (let i = 0; i < shape.length; ++i) {
            this.background[pointX + shape[i][0]][pointY + shape[i][1]].show(act.close);
        }
    }
    check(pointX: number, pointY: number, shape: number[][]) {
        for (let i = 0; i < shape.length; ++i) {
            if (typeof this.background[pointX + shape[i][0]][pointY + shape[i][1]] === "undefined" ||
                this.background[pointX + shape[i][0]][pointY + shape[i][1]].act === act.open) {
                return false;
            }
        }
        return true;
    }

    // 随机生成一个图形，并返回他的参数
    createShape() {
        let pointX: number = 2;
        let pointY: number = 7;
        let shape: number[][] = shapeList[Math.random() * shapeList.length | 0].slice();
        this.draw(pointX, pointY, shape);
        return { pointX, pointY, shape };
    }

    changeShape(systemEvent) {
        switch (systemEvent.keyCode) {
            case cc.KEY.up:
                this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
                let newshape = this.opearteShape(this.csret.shape);
                this.csret.shape = newshape;
                this.draw(this.csret.pointX, this.csret.pointY, newshape);

                break;
            // case cc.KEY.left:
            //     this.clear(pointX, pointY, shape);
            //     this.draw(pointX - 1, pointY, newshape);
            //     break;
            // case cc.KEY.right:
            //     this.clear(pointX, pointY, shape);
            //     this.draw(pointX + 1, pointY, newshape);
            //     break;

        }
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.changeShape, this);
    }
}