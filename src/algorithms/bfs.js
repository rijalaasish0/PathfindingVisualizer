export function BFS(grid, startVertex, finishVertex){
    //List of the visited vertices part of the path
    const visitedVerticesInOrder = [];

    //The first node we explore is the Starting Vertex
    let nextVerticesStack = [startVertex];
    //For this case, we are using an array, but
    //we're going to make it act like a queue
    //array.shift() pops the item off the top of the array 
    //like you would a queue, as you'll see later


    while(nextVerticesStack.length){
        //remove the first item of the queue
        const currentVertex = nextVerticesStack.shift();
        //return the path if we reached the finish vertex
        if(currentVertex === finishVertex)
            return visitedVerticesInOrder;
        
        //otherwise, continue searching the graph
        if(!currentVertex.isWall && (currentVertex.isStart || !currentVertex.isVisited)){
            currentVertex.isVisited = true;
            visitedVerticesInOrder.push(currentVertex);
            const {col, row} = currentVertex;
            let nextVertex;
            if(row > 0){
                nextVertex = grid[row -1][col];
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
            if(col > 0){
                nextVertex = grid[row][col -1];
                if(!nextVertex.isVisited) {
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
        }
    }
    return visitedVerticesInOrder;
}