export enum character {
    zhexing,
    shizixing,
    shuxing,
    gouxing,
    tianzixing,
    tuzixing
}
export enum act {
    start,
    open,
    close
}
export const bgWidth: number = 5
export const bgHeight: number = 9

export const zhexing = [[-1, 1], [0, 1], [0, 0], [1, 0]];
export const shizixing = [[0, 0], [1, 0], [0, -1], [-1, 0], [0, 1]];
export const shuxing = [[0, 1], [0, 0], [0, -1], [0, -2]];
export const gouxing = [[-1, 0], [0, 0], [1, 0], [1, -1]];
export const tianzixing = [[0, 1], [1, 1], [1, 0], [0, 0]];
export const tuzixing = [[-1, 0], [0, 0], [0, 1], [1, 0]];
export const shapeList = [zhexing, shizixing, shuxing, gouxing, tianzixing, tuzixing];
export enum state {
    fall,
    stop
}