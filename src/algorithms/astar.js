export default class astar{
  constructor(){
    this.name = "A* Algorithm"
  }
  
  findPath(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.h = hDistance(startNode, finishNode);
    const open = [];
    open.push(startNode);
    while (!!open.length) {
        sortNodesByDistance(open);
        const closestNode = open.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        if (closestNode === finishNode) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        const neighbors = getNeighbors(closestNode, grid);
        for (const neighbor of neighbors) {
            let newCost = closestNode.distance + 1;
            if(neighbor.distance === Infinity || neighbor.distance > newCost){
                neighbor.distance = newCost;
                neighbor.previousNode = closestNode;
                const h = hDistance(neighbor, finishNode);
                neighbor.priority = h + newCost;
                neighbor.h = h;
                open.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}
    
  getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
}

function hDistance(node, finish){
  return (Math.abs(node.col - finish.col) + Math.abs(node.row - finish.row));
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => {
    const diff = nodeA.priority - nodeB.priority;

    if(diff === 0){
      return nodeA.h - nodeB.h;
    }
    
    return diff;
  });
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}