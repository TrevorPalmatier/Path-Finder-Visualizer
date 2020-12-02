export default class eraseWall{
    constructor() {
        this.name = "Erase Tool";
    }
    useTool(grid, row, col){
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: false,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }
}