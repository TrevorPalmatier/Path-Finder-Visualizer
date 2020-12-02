import React, {Component} from 'react';
import Node from './Node/Node';
import {Wall, Erase, Move} from '../tools/tools';
import {Greedy, Astar, Dijksta} from '../algorithms/algorithms.js';
import './PathfindingVisualizer.css';

var START_NODE_ROW = 10;
var START_NODE_COL = 15;
var FINISH_NODE_ROW = 10;
var FINISH_NODE_COL = 35;
const moveTool = new Move();
const wallTool = new Wall();

export default class PathfindingVisualizer extends Component {
    constructor() {
        super();
        this.state = {
        grid: [],
        mouseIsPressed: false,
        currentTool: new Wall(),
        algorithm: new Dijksta(),
        moveStart: false,
        moveEnd: false,
        search: false,
        };
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
        document.getElementById("currentTool").innerText = "Current Tool: " + this.state.currentTool.name;
        const grid = getInitialGrid();
        this.setState({grid});
    }

    

    handleMouseDown(row, col) {
        if(row === START_NODE_ROW && col === START_NODE_COL){
            this.setState({moveStart: true});
        }else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
            this.setState({moveEnd: true});
        }else{
            const currentTool = this.state.currentTool;
            const newGrid = currentTool.useTool(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
        this.setState({mouseIsPressed: true});
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        if(this.state.moveStart && !(document.getElementById(`node-${row}-${col}`).classList.contains("node-wall"))){
            START_NODE_ROW = row;
            START_NODE_COL = col;
            const newGrid = moveTool.startMove(this.state.grid, row, col);
            this.setState({grid: newGrid});
            if(this.state.search === true){
                this.updateSearch();
            }
        }else if(this.state.moveEnd && !document.getElementById(`node-${row}-${col}`).classList.contains("node-wall")){
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            const newGrid = moveTool.endMove(this.state.grid, row, col);
            this.setState({grid: newGrid});
            if(this.state.search === true){
                this.updateSearch();
            }
        }else{
            const currentTool = this.state.currentTool;
            const newGrid = currentTool.useTool(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
    }

    handleMouseOut(row, col) {
        if(this.state.moveStart && !document.getElementById(`node-${row}-${col}`).classList.contains("node-wall")){
            const newGrid = moveTool.startMove(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }else if(this.state.moveEnd && !document.getElementById(`node-${row}-${col}`).classList.contains("node-wall")){
            const newGrid = moveTool.endMove(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp(row, col) {
        this.setState({mouseIsPressed: false, moveStart: false, moveEnd: false});
    }

    onKeyPress(key){
        if(key.charCode === 77){
            this.setTool(wallTool);
        }
    }

    animateSearch(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
            this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-visited");
        }, 10 * i);
        }
    }

    updateSearch() {
        this.resetAnimation();
        const {grid, algorithm} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = algorithm.findPath(grid, startNode, finishNode);
        const nodesInShortestPathOrder = algorithm.getNodesInShortestPathOrder(finishNode);
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            break;
        }
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-visited");
        }
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-shortest-path");
            }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).classList.add("node-shortest-path");
        }, 50 * i);
        }
        document.getElementById("reset").disabled = false;
    }

    resetGrid(){
        const newGrid = getInitialGrid();
        this.setState({grid: newGrid});
        for (let row = 0; row < 20; row++) {
            for (let col = 0; col < 50; col++) {
                if (row === START_NODE_ROW && col === START_NODE_COL){
                    document.getElementById(`node-${row}-${col}`).className = "node node-start";
                } else if(row === FINISH_NODE_ROW && col === FINISH_NODE_COL){
                    document.getElementById(`node-${row}-${col}`).className = "node node-finish";
                }else{
                    document.getElementById(`node-${row}-${col}`).className = "node";
                }
            }
        }
        this.setState({search: false});
    }

    resetAnimation(){
        const visited = document.getElementsByClassName("node-visited");
        while(visited.length !== 0){
            visited[0].classList.remove("node-visited");
        }
        const shortest = document.getElementsByClassName("node-shortest-path");
        while(shortest.length !== 0){
            shortest[0].classList.remove("node-shortest-path");
        }
        resetGridAnimation(this.state.grid);
    }

    visualizeAlgorithm() {
        this.resetAnimation();
        this.setState({search: true});
        document.getElementById("reset").disabled = true;
        const {grid, algorithm} = this.state;
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = algorithm.findPath(grid, startNode, finishNode);
        const nodesInShortestPathOrder = algorithm.getNodesInShortestPathOrder(finishNode);
        this.animateSearch(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    setTool(newTool){
        this.setState({currentTool: newTool});
        document.getElementById("currentTool").innerText = "Current Tool: " + newTool.name;
    }

    changeAlgorithm(newAlgorithm){
        this.setState({algorithm: newAlgorithm});
        this.resetAnimation();
        document.getElementById("startVisualization").innerText = "Visualize " + newAlgorithm.name;
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
        <>
                <nav>
                    <div className="dropdown">
                        <div className="algorithms">
                            <button className="btn">Algorithms</button>
                            <ul>
                                <li><button onClick={() => this.changeAlgorithm(new Dijksta())}>Dijkstra's</button></li>
                                <li><button onClick={() => this.changeAlgorithm(new Astar())}>A*</button></li>
                                <li><button onClick={() => this.changeAlgorithm(new Greedy())}>Greed Best First</button></li>
                            </ul>
                        </div>
                        <button id = "startVisualization" className="btn" onClick={() => this.visualizeAlgorithm()}>
                            Visualize Dijkstra's Algorithm
                        </button>
                        <button id = "reset" className="btn" onClick={() => this.resetGrid()}>
                            Reset
                        </button>
                        <button id = "placeWalls" className="btn" onClick={() => this.setTool(new Wall())}>
                            Place Walls
                        </button>
                        <button id = "eraseWalls" className="btn" onClick={() => this.setTool(new Erase())}>
                            Erase Walls
                        </button>
                        <span id = "currentTool">Current Tool: </span>
                    </div>
                </nav>
                <div className="grid" onKeyPress={this.onKeyPress}>
                {grid.map((row, rowIdx) => {
                    return (
                    <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {row, col, isFinish, isStart, isWall} = node;
                        return (
                            <Node
                            key={nodeIdx}
                            col={col}
                            row={row}
                            isFinish={isFinish}
                            isStart={isStart}
                            isWall={isWall}
                            mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                            onMouseOut={(row, col) => this.handleMouseOut(row,col)}
                            onMouseUp={() => this.handleMouseUp(row, col)}></Node>
                        );
                        })}
                    </div>
                    );
                })}
                </div>
        </>
        );
    }
}
const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
        const currentRow = [];
        for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

const resetGridAnimation = (grid) => {
    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 50; col++) {
            let node = grid[row][col];
            grid[row][col] = {...node, distance: Infinity, isVisited: false, previousNode: null, h: Infinity, priority: Infinity,};
        }
    }
    return grid
};

const createNode = (col, row) => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
        h: Infinity,
        priority: Infinity,
    };
};

