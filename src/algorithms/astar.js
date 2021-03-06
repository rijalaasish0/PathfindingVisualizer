// Returns all vertices in the order in which they were visited.
// Make vertices point back to their previous vertex so that we can compute the shortest path
// by backtracking from the finish vertex.

export function AStar(grid, startVertex, finishVertex) {
    const visitedVerticesInOrder = [];
    startVertex.distance = 0;
    const unvisitedVertices = getAllVertices(grid); // Q: different from using grid or slice of grid???
  
    while (unvisitedVertices.length) {
      sortByDistance(unvisitedVertices);
      const closestVertex = unvisitedVertices.shift();
      // If we encounter a wall, we skip it.
      if (!closestVertex.isWall) {
        // If the closest vertex is at a distance of infinity,
        // we must be trapped and should stop.
        if (closestVertex.distance === Infinity) return visitedVerticesInOrder;
        closestVertex.isVisited = true;
        visitedVerticesInOrder.push(closestVertex);
        if (closestVertex === finishVertex) return visitedVerticesInOrder;
        updateUnvisitedNeighbors(closestVertex, grid);
      }
    }
  }
  
  function getAllVertices(grid) {
    const vertices = [];
    for (const row of grid) {
      for (const vertex of row) {
        vertices.push(vertex);
      }
    }
    return vertices;
  }
  
  function sortByDistance(unvisitedVertices) {
    unvisitedVertices.sort((vertexA, vertexB) => vertexA.distance - vertexB.distance);
  }
  
  function updateUnvisitedNeighbors(vertex, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(vertex, grid);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = vertex.distance + 1 + neighbor.distanceToFinishVertex;
      neighbor.previousVertex = vertex;
    }
  }
  
  function getUnvisitedNeighbors(vertex, grid) {
    const neighbors = [];
    const {col, row} = vertex;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }