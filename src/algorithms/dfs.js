export function DFS(grid, startVertex, finishVertex){
    const visitedVerticesInOrder = [];
    const nextVerticesStack = [startVertex];
    while(nextVerticesStack.length){
        const currentVertex = nextVerticesStack.pop();

        if(currentVertex === finishVertex) {
            return visitedVerticesInOrder;
        }

        if(!currentVertex.isWall &&
            (currentVertex.isStart || !currentVertex.isVisited)){
            currentVertex.isVisited = true;
            visitedVerticesInOrder.push(currentVertex);

            const {col, row} = currentVertex;
            let nextVertex;
            if(row > 0){
                nextVertex = grid[row - 1][col];
                if(!nextVertex.isVisited){
                    nextVertex.previousVertex = currentVertex;
                    nextVerticesStack.push(nextVertex);
                }
            }
            if(row < grid.length - 1){
                nextVertex = grid[row + 1][col];
                if(!nextVertex.isVisited){
                    nextVertex.previousVertex = currentVertex;
                    nextVerticesStack.push(nextVertex);
                }
            }
            if(col < grid[0].length - 1){
                nextVertex = grid[row][col + 1];
                if(!nextVertex.isVisited){
                    nextVertex.previousVertex = currentVertex;
                    nextVerticesStack.push(nextVertex);
                }
            }
            if(col > 0){
                nextVertex = grid[row][col - 1];
                if(!nextVertex.isVisited){
                    nextVertex.previousVertex = currentVertex;
                    nextVerticesStack.push(nextVertex);
                }
            }
        }
    }
    return visitedVerticesInOrder;
}