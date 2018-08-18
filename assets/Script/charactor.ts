import { character, bgWidth, bgHeight, act,  shapeList, tianzixing  state } from "./cfg"

import cell from "./cell"

const { ccclass, property } = cc._decorator;

@ccclass
export default class Character extends cc.Component {
    @property(cc.Label)
    private SCORE: cc.Label = null
    @property(cc.Node)
    private bg: cc.Node = null
    @property(cc.Prefab)
    private cellPfb: cc.Prefab = null
    type: character = null
    background: cell[][] = []
    shape: cell[][] = []
    staylist: number[][] = []
    stayshape: number[][] = []
    stayX: number = 0
    stayY: number = 0
    score:number=1
    // blanklist: cell[] = []
    // ret: number = 0
    // row0: number[] = [];
    // row1: number[] = [];
    // row2: number[] = [];
    // row3: number[] = [];
    // row4: number[] = [];
    // row5: number[] = [];
    // row6: number[] = [];
    // row7: number[] = [];
    // row8: number[] = [];
    //声明一个对象接口
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
        // this.ret = this.remove();
        this.schedule(() => {
            this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
            //对于这里的 this.csret.pointY由于this指针指向同一个类即character类的同一个实例，所以是同一个值，一个改变其余的也会随之改变
            if (!this.check(this.csret.pointX, this.csret.pointY - 1, this.csret.shape)
                // || !this.check(this.csret.pointX, this.csret.pointY, this.csret.shape)
            ) {
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                // this.remove();
                // this.fallDown();
                this.resetCharacter();
            }
            else {
                this.csret.pointY--;
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
            }

            // this.changeShape({ keyCode: 38 });
        }, 0.5, cc.macro.REPEAT_FOREVER, 0.5);
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
    clean(x: number, y: number) {
        this.background[x][y].show(act.close)
    }
    show(x: number, y: number) {
        this.background[x][y].show(act.open)
    }
    //判断进行操作的格子是否存在和是否时空白
    //当格子不存在或者已经有图形的时候显示false
    check(pointX: number, pointY: number, shape: number[][]) {
        for (let i = 0; i < shape.length; ++i) {
            if (typeof this.background[pointX + shape[i][0]][pointY + shape[i][1]] === "undefined" ||
                this.background[pointX + shape[i][0]][pointY + shape[i][1]].act === act.open
                //|| pointX - 1 + shape[i][0] < 0 || pointX - 1 < 0 || pointX + 1 + shape[i][0] > bgWidth - 1 
                // || pointX + 1 > bgWidth - 1
            ) {
                // console.log(pointX + shape[i][0], pointY + shape[i][1]);
                return false;
            }
            // console.log(typeof this.background[pointX + shape[i][0]][pointY + shape[i][1]]);
        }
        return true;
    }

    // 随机生成一个图形，并返回他的参数
    createShape() {
        let pointX: number = 2;
        let pointY: number = 7;
        let shape: number[][] = shapeList[Math.random() * shapeList.length | 0].slice();
        if (!this.check(pointX, pointY, shape)) {
            this.score=1;
            this.addScore(0);
            alert("gameover");
            
            for (let j = 0; j < bgHeight; ++j) {
                for (let i = 0; i < bgWidth; ++i) {
                    this.background[i][j].show(act.close);
                }
            }
        }
        this.draw(pointX, pointY, shape);
        return {
            pointX: pointX,
            pointY: pointY,
            shape: shape
        };
    }
    //更改图形的状态（位置，旋转）
    changeShape(systemEvent) {
        switch (systemEvent.keyCode) {
            //cc.KEY.up||
            case cc.KEY.w:
                if (!this.checkArray(this.csret.shape, tianzixing)) {
                    this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
                    let oldShape = this.csret.shape;
                    let newshape = this.opearteShape(this.csret.shape);
                    this.csret.shape = newshape;
                    // for (let i = 0; i < this.csret.shape.length; ++i) {
                    //         if (this.csret.pointX - 1 + this.csret.shape[i][0] < 0 || this.csret.pointX - 1 < 0
                    //             ||this.csret.pointX + 1 + this.csret.shape[i][0] > bgWidth - 1 || this.csret.pointX + 1 > bgWidth - 1
                    //             ||!this.check(this.csret.pointX, this.csret.pointY - 1, this.csret.shape)
                    //         ){
                    //             // this.draw(this.csret.pointX, this.csret.pointY, oldShape);
                    //             return
                    //         }
                    //     }
                    //     this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                    if (!this.check(this.csret.pointX, this.csret.pointY - 1, this.csret.shape)
                        || !this.check(this.csret.pointX + 1, this.csret.pointY, this.csret.shape)
                        || !this.check(this.csret.pointX, this.csret.pointY, this.csret.shape)) {
                        // for (let i=0;i<this.csret.shape.length;i++){
                        //     if((this.csret.pointX - 1 + this.csret.shape[i][0] < 0 || this.csret.pointX - 1 < 0)
                        //     &&(this.csret.pointX + 1 + this.csret.shape[i][0] > bgWidth - 1 || this.csret.pointX + 1 > bgWidth - 1)){
                        //         return;
                        //     }
                        // }
                        this.draw(this.csret.pointX, this.csret.pointY, oldShape);
                        this.csret.shape = oldShape;
                    }
                    else {
                        this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                        // this.csret.shape = oldShape;
                    }
                }
                else return;
                break;
            //cc.KEY.left||
            case cc.KEY.a:
                for (let i = 0; i < this.csret.shape.length; i++) {
                    if (this.csret.pointX - 1 + this.csret.shape[i][0] < 0) {
                        return;
                    }
                }
                this.clear(this.csret.pointX--, this.csret.pointY, this.csret.shape);
                if (!this.check(this.csret.pointX, this.csret.pointY, this.csret.shape)) {
                    this.draw(this.csret.pointX + 1, this.csret.pointY, this.csret.shape);
                    this.csret.pointX++;
                    return;

                }
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                break;
            //cc.KEY.right||
            case cc.KEY.d:
                for (let i = 0; i < this.csret.shape.length; i++) {
                    if (this.csret.pointX + 1 + this.csret.shape[i][0] > bgWidth - 1) {
                        // console.log(this.csret.pointX + 1 + this.csret.shape[i][0]);
                        return
                    }
                    // console.log(this.csret.pointX + 1 + this.csret.shape[i][0]);
                }
                this.clear(this.csret.pointX++, this.csret.pointY, this.csret.shape);
                // this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                if (!this.check(this.csret.pointX, this.csret.pointY, this.csret.shape)) {
                    this.draw(this.csret.pointX - 1, this.csret.pointY, this.csret.shape);
                    this.csret.pointX--;
                    return;
                }
                this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
                break;

        }
    }
    addScore(score:number){
       this.SCORE.string=`${score}`;

    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.changeShape, this);
    }
    checkArray(a0: number[][], a1: number[][]) {
        if (a0 === a1) {
            return true;
        }
        if (a0.length !== a1.length) {
            return false;
        }
        for (let i = 0; i < a0.length; ++i) {
            if (a0[i][0] !== a1[i][0] || a0[i][1] !== a1[i][1]) {
                return false;
            }
        }
        return true;
    }
    resetCharacter() {
        this.stayshape = this.csret.shape
        this.stayX = this.csret.pointX
        this.stayY = this.csret.pointY
        this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
        this.draw(this.csret.pointX, this.csret.pointY, this.stayshape);
        this.remove();
        // this.fallDown();
        this.csret = this.createShape();
        



        // this.schedule(() => {
        //     this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape)
        //     if (!this.check(this.csret.pointX, this.csret.pointY - 1, this.csret.shape)) {
        //         this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
        //     }
        //     else {
        //         this.csret.pointY--;
        //         this.draw(this.csret.pointX, this.csret.pointY, this.csret.shape);
        //     }
        // }, 1, cc.macro.REPEAT_FOREVER, 1);
    }
    clearRow(num: number) {
        for (let i = 0; i < 5; ++i) {
            this.background[i][num].show(act.close)
        }
    }
    makeSure() { }
    remove() {
        // this.clear(this.csret.pointX, this.csret.pointY, this.csret.shape);
        // this.fallDown();
        // console.log(this.stayshape);
        // // this.staylist = this.staylist.concat(this.stayshape);
        // console.log(this.staylist);
        for (let j = 0; j < bgHeight; ++j) {
            let blanklist: cell[] = [];
            for (let i = 0; i < bgWidth; ++i) {
                if (this.background[i][j].act === act.open) {
                    blanklist.push(this.background[i][j]);
                }
            }
            if (blanklist.length === bgWidth) {
                for (let x = 0; x < blanklist.length; ++x) {
                    blanklist[x].show(act.close);
                }
                this.clearfall(j);
                this.addScore(this.score);
                this.score++;
                j--;

            }
        }

        // this.fallDown();
        // //元素在背景中的位置
        // let a = this.stayX + this.staylist[i][0];
        // let b = this.stayY + this.staylist[i][1];
        // this.background[a][b]
    }
    clearfall(row: number) {
        for (let j = row; j < bgHeight; ++j) {
            for (let i = 0; i < bgWidth; ++i) {
                if (j === bgHeight - 1) {
                    this.background[i][j].show(act.close);
                }
                else {
                    this.background[i][j].show(this.background[i][j + 1].act);
                }
            }
        }
    }

    //对于多少行以上的方块整体下落
    // fallDown() {
    //     for (let j = 0; j < bgHeight; ++j) {
    //         for (let i = 0; i < bgWidth; ++i) {
    //             if (j > this.ret) {
    //                 if (this.background[i][j].act === act.open && this.background[i][j - 1].act === act.close) {
    //                     this.background[i][j].show(act.close);
    //                     this.background[i][j - 1].show(act.open);
    //                 }
    //             }
    //         }
    //     }
    // }
    isStop() {

    }
    //     for (let j = 0; j < bgHeight; ++j) {
    //         for (let i = 0; i< bgWidth; ++i) {
    //             if (this.background[i][j].act === act.open) {
    //                 this.clean(i, j);
    //                 if (j > 0) {
    //                     this.show(i, j - 1);
    //                 }
    //                 else {
    //                     this.show(i, j);
    //                 }
    //             }
    //         }
    //     }
    //     // this.remove();
    // }
    //         switch (this.background[a][b].y) {
    //             case 0:
    //                 this.row0.push(i);
    //                 break;
    //             case 1:
    //                 this.row1.push(i);
    //                 break;
    //             case 2:
    //                 this.row2.push(i);
    //                 break;
    //             case 3:
    //                 this.row3.push(i);
    //                 break;
    //             case 4:
    //                 this.row4.push(i);
    //                 break;
    //             case 5:
    //                 this.row5.push(i);
    //                 break;
    //             case 6:
    //                 this.row6.push(i);
    //                 break;
    //             case 7:
    //                 this.row7.push(i);
    //                 break;
    //             case 8:
    //                 this.row8.push(i);
    //                 break;
    //         }
    //     }
    //     if (this.row0.length === 5) {
    //         this.clearRow(0);
    //         this.row0.splice(0);
    //     }
    //     else if (this.row1.length === 5) {
    //         this.clearRow(1);
    //     }
    // }
}
