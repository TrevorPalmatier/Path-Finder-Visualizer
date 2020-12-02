export default class greedyBest{
  constructor(){
    this.name = "Greedy Best First Search"
  }
  
  findPath(grid, startNode, finishNode) {
      const visitedNodesInOrder = [];
      startNode.distance = 0;
      startNode.h = hDistance(startNode, finishNode);
      const unvisitedNodes = getAllNodes(grid);
      while (!!unvisitedNodes.length) {
          sortNodesByDistance(unvisitedNodes);
          const closestNode = unvisitedNodes.shift();
          // If we encounter a wall, we skip it.
          if (closestNode.isWall) continue;
          // If the closest node is at a distance of infinity,
          // we must be trapped and should therefore stop.
          if (closestNode.distance === Infinity) return visitedNodesInOrder;
          if (closestNode === finishNode) return visitedNodesInOrder;
          closestNode.isVisited = true;
          visitedNodesInOrder.push(closestNode);
          const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
          for (const neighbor of unvisitedNeighbors) {
              neighbor.previousNode = closestNode;
              const h = hDistance(neighbor, finishNode);
              neighbor.distance = (closestNode.distance + 1 + h)
              neighbor.h = h;
          }
      }
  }
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the method above.
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
  const diff = nodeA.h - nodeB.h;
  if(diff === 0){
    return nodeA.distance - nodeB.distance;
  }
  return diff;
});
}

function getUnvisitedNeighbors(node, grid) {
const neighbors = [];
const {col, row} = node;
if (row > 0) neighbors.push(grid[row - 1][col]);
if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
if (col > 0) neighbors.push(grid[row][col - 1]);
if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
const nodes = [];
for (const row of grid) {
  for (const node of row) {
    nodes.push(node);
  }
}
return nodes;
}