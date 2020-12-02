export default class placeWall {
    constructor(){
        this.name = "Wall Tool";
    }
    useTool(grid, row, col){
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: true,
        };
        newGrid[row][col] = newNode;
        return newGrid;
    }
}