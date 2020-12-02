export default class MovePoints{
    constructor() {
        this.name = "Move";
    }

    startMove(grid, row, col){
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isStart: !node.isStart,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }

    endMove(grid, row, col){
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isFinish: !node.isFinish,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }
}