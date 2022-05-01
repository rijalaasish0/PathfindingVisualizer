import React, { useState, useEffect } from 'react';
import Vertex from './Vertex';
import { AStar } from '../algorithms/astar';
import { BFS } from '../algorithms/bfs';
import { DFS } from '../algorithms/dfs';
import { dijkstra } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css'

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [start_vertex_row, setStartVertexRow] = useState(30);
    const [finish_vertex_row, setFinishVertexRow] = useState(49);
    const [start_vertex_col, setStartVertexCol] = useState(30);
    const [finish_vertex_col, setFinishVertexCol] = useState(49);
    const [row_count, setRowCount] = useState(50);
    const [col_count, setColCount] = useState(50);
    const [isStartVertex, setIsStartVertex] = useState(false);
    const [isFinishVertex, setIsFinishVertex] = useState(false);
    const [isWallVertex, setIsWallVertex] = useState(false);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);

    const [wallPercentage, setWallPercentage] = useState(0);
    const [animationTime, setAnimationTime] = useState(10);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    let isRunning = false;
    const setIsRunning = (running) => {
        isRunning = running;
    }
    useEffect(() => {
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }, [wallPercentage, row_count, start_vertex_col, start_vertex_col, finish_vertex_col, finish_vertex_row]);


    const getInitialGrid = (rowCount = row_count, colCount = col_count) => {
        const initialGrid = [];
        for (let row = 0; row < rowCount; row++) {
            const currentRow = [];
            for (let col = 0; col < colCount; col++) {
                currentRow.push(createVertex(row, col));
            }
            initialGrid.push(currentRow);
        }
        return initialGrid;
    }

    const toggleIsRunning = () => {
        isRunning = !isRunning;
    }

    const createVertex = (row, col) => {
        let genNum = Math.floor(Math.random() * 100);
        return {
            row,
            col,
            isStart:
                row === start_vertex_row &&
                col === start_vertex_col,
            isFinish:
                row === finish_vertex_row &&
                col === finish_vertex_col,
            distance: Infinity,
            distanceToFinishVertex:
                Math.abs(finish_vertex_col - col)  + Math.abs(finish_vertex_row - row)
            ,
            isVisited: false,
            isWall: genNum < wallPercentage,
            previousVertex: null,
            isVertex: true
        }
    }

    const handleMouseDownEvent = (row, col) => {
        if (isGridClear()) {


            if (document.getElementById(`vertex-${row}-${col}`).className === 'vertex vertex-finish') {
                setIsFinishVertex(true);
                setMouseIsPressed(true);
                setCurRow(row);
                setCurCol(col);
                console.log("FINISH!");
            }
            else if (document.getElementById(`vertex-${row}-${col}`).className === 'vertex vertex-start') {
                setMouseIsPressed(true);
                setCurRow(row);
                setCurCol(col);
                setIsStartVertex(true);
                console.log("START");
            } else {
                const newGrid = getNewGridWithWallToggled(grid, row, col);
                setGrid(newGrid);
                setMouseIsPressed(true);
                setCurRow(row);
                setCurRow(col);
                setIsWallVertex(true);
            }
        } else {
            // clearGrid();
        }
    }

    const isGridClear = () => {
        for (const row of grid) {
            for (const vertex of row) {
                const vertexClassName = document.getElementById(`vertex-${vertex.row}-${vertex.col}`).className;
                if (vertexClassName === 'vertex vertex-visited' || vertexClassName === 'vertex vertex-shortest-path') {
                    return false;
                }
            }
        }
        return true;
    }

    const clearGrid = () => {
        const newGrid = grid.slice();
        for (const row of newGrid) {
            for (const vertex of row) {
                let vertexClassName = document.getElementById(`vertex-${vertex.row}-${vertex.col}`).className;
                if (vertexClassName !== 'vertex vertex-start' && vertexClassName !== 'vertex vertex-finish' && vertexClassName !== 'vertex vertex-wall') {
                    document.getElementById(`vertex-${vertex.row}-${vertex.col}`).className = 'vertex';
                    vertex.isVisited = false;
                    vertex.distance = Infinity;
                    vertex.distanceToFinishVertex =
                        Math.abs(finish_vertex_row - vertex.row) +
                        Math.abs(finish_vertex_col - vertex.col);
                }

                if (vertexClassName === 'vertex vertex-finish') {
                    vertex.isVisited = false;
                    vertex.distance = Infinity;
                    vertex.distanceToFinishVertex = 0;
                    vertex.isFinish = true;
                    vertex.isWall = false;
                    vertex.isVertex = true;
                }

                if (vertexClassName === 'vertex vertex-start') {
                    vertex.isVisited = false;
                    vertex.distance = Infinity;
                    vertex.distanceToFinishVertex =
                        Math.abs(finish_vertex_row - vertex.row) +
                        Math.abs(finish_vertex_col - vertex.col);
                    vertex.isStart = true;
                    vertex.isWall = false;
                    vertex.previousVertex = null;
                    vertex.isVertex = true;
                }
            }
        }
        setIsRunning(false);
    }

    const handleMouseUp = (row, col) => {
        setMouseIsPressed(false);
        if (isStartVertex) {
            setIsStartVertex(false);
            setStartVertexRow(row);
            setStartVertexCol(col);

            console.log("Start moved!!")
        } else if (isFinishVertex) {
            setIsFinishVertex(false);
            setFinishVertexRow(row);
            setFinishVertexCol(col);

            console.log("Finish moved!!");
        }

    }

    const clearWalls = () => {
        clearGrid();
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }

    const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const vertex = newGrid[row][col];

        if (!vertex.isStart && !vertex.isFinish && vertex.isVertex) {
            const newVertex = {
                ...vertex,
                isWall: !vertex.isWall
            };
            newGrid[row][col] = newVertex;
        }
        return newGrid;
    }

    const visualize = (algo, animatePath = true) => {
        clearGrid();
        console.log(isRunning);
        if (!isRunning) {
            toggleIsRunning();
            const startVertex = grid[start_vertex_row][start_vertex_col];
            const finishVertex = grid[finish_vertex_row][finish_vertex_col];

            let visitedVerticesInOrder;
            switch (algo) {
                case 'AStar':
                    visitedVerticesInOrder = AStar(grid, startVertex, finishVertex);
                    break;
                case 'BFS':
                    visitedVerticesInOrder = BFS(grid, startVertex, finishVertex);
                    break;
                case 'DFS':
                    visitedVerticesInOrder = DFS(grid, startVertex, finishVertex);
                    break;
                case 'Dijkstra':
                    visitedVerticesInOrder = dijkstra(grid, startVertex, finishVertex);
                default:
                    break;
            }
            const verticesInShortestPathOrder = getVerticesInShortestPathOrder(finishVertex);

            if (animatePath) {
                console.log("Total Vertices Explored: " + visitedVerticesInOrder.length);
                console.log("Shortest Path Length: " + (verticesInShortestPathOrder.length - 1));
                verticesInShortestPathOrder.push('end');
                animate(visitedVerticesInOrder, verticesInShortestPathOrder);
            } else {
                return [visitedVerticesInOrder.length, verticesInShortestPathOrder.length - 1]
            }

        }

    }

    const animate = (visitedVerticesInOrder, verticesInShortestPathOrder) => {
        for (let i = 0; i <= visitedVerticesInOrder.length; i++) {
            if (i === visitedVerticesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(verticesInShortestPathOrder);
                }, animationTime * i);
                return;
            }
            setTimeout(() => {
                const vertex = visitedVerticesInOrder[i];
                const vertexClassName = document.getElementById(
                    `vertex-${vertex.row}-${vertex.col}`,
                ).className;
                if (
                    vertexClassName !== 'vertex vertex-start' &&
                    vertexClassName !== 'vertex vertex-finish'
                ) {
                    document.getElementById(`vertex-${vertex.row}-${vertex.col}`).className =
                        'vertex vertex-visited';
                }
            }, animationTime * i);
        }
    }

    const updateAnimationTime = (e) => {
        setAnimationTime(parseInt(e.target.value));
    }

    const animateShortestPath = (verticesInShortestPathOrder) => {
        for (let i = 0; i < verticesInShortestPathOrder.length; i++) {
            if (verticesInShortestPathOrder[i] === 'end') {
                setTimeout(() => {
                    toggleIsRunning();
                }, i * animationTime * 5);
            } else {
                setTimeout(() => {
                    const vertex = verticesInShortestPathOrder[i];
                    const vertexClassName = document.getElementById(
                        `vertex-${vertex.row}-${vertex.col}`,
                    ).className;
                    if (
                        vertexClassName !== 'vertex vertex-start' &&
                        vertexClassName !== 'vertex vertex-finish'
                    ) {
                        document.getElementById(`vertex-${vertex.row}-${vertex.col}`).className =
                            'vertex vertex-shortest-path';
                    }
                }, i * animationTime * 4);
            }
        }
    }

    const getVerticesInShortestPathOrder = (finishVertex) => {
        const verticesInShortestPathOrder = [];
        let currentVertex = finishVertex;
        while (currentVertex !== null) {
            verticesInShortestPathOrder.unshift(currentVertex);
            currentVertex = currentVertex.previousVertex;
        }
        return verticesInShortestPathOrder;
    }

    const updateWallPercentage = (e) => {
        setWallPercentage(parseInt(e.target.value));
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }

    const updateSize = (e) => {
        setColCount(parseInt(e.target.value));
        setRowCount(parseInt(e.target.value));
        setFinishVertexCol(parseInt(e.target.value) - 1);
        setFinishVertexRow(parseInt(e.target.value) - 1);
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }

    const runAll = () => {

        let aStarResult = visualize('AStar', false);
        let dfsResult = visualize('DFS', false);
        let bfsResult = visualize('BFS', false);
        let dijkstraResult = visualize('Dijkstra', false);

        if (aStarResult.length > 1 && dfsResult.length && bfsResult) {
            console.log("AStar:")
            console.log(aStarResult);

            console.log("BFS:")
            console.log(bfsResult);

            console.log("DFS:")
            console.log(dfsResult);

            console.log("Dijkstra:")
            console.log(dijkstraResult);


            window.open(`https://quickchart.io/chart?c={ type: 'bar', data: { labels: ['A*', 'BFS', 'DFS', 'Dijkstra'], datasets: [{ label: 'Total Vertices Explored', data: [${aStarResult[0]}, ${bfsResult[0]}, ${dfsResult[0]}, ${dijkstraResult[0]}] }] } }`, "_blank");
            window.open(`https://quickchart.io/chart?c={ type: 'bar', data: { labels: ['A*', 'BFS', 'DFS', 'Dijkstra'], datasets: [{ label: 'Shortest Path Found', data: [${aStarResult[1]}, ${bfsResult[1]}, ${dfsResult[1]}, ${dijkstraResult[1]}] }] } }`, "_blank");
        }
    }

    return (
        <div>
            <center>
                <h2>Pathfinding Visualizer</h2>
                <button onClick={clearWalls}>Clear Walls</button>
                <button onClick={clearGrid}>Clear Grid</button>
                {/* <select name="wallPer" id="wallPer" onChange={updateWallPercentage}>
                    <option value="0">0%</option>
                    <option value="10">10%</option>
                    <option value="20">20%</option>
                    <option value="30">30%</option>
                    <option value="40">40%</option>
                    <option value="50">50%</option>
                </select> */}
                <p>
                    Walls Percentage: <input type="range" min="0" max="100" value={wallPercentage} onChange={updateWallPercentage} className="slider"></input>
                    {wallPercentage}%
                </p>
                <p>
                    Grid size: <input type="range" min="30" max="100" value={row_count} onChange={updateSize} className="sizeSlider"></input>
                    {row_count}*{col_count}
                </p>
                <p>
                    Animation Time: <input type="range" min="1" max="10" value={animationTime} onChange={updateAnimationTime} className="animationSlider"></input>
                    {animationTime}
                </p>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => visualize('AStar')}>
                    A* Algorithm
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => visualize('BFS')}>
                    Breadth First Search Algorithm
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => visualize('DFS')}>
                    Depth First Search Algorithm
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => visualize('Dijkstra')}>
                    Dijkstra's Algorithm
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => runAll()}>
                    Test All (Beta)
                </button>
                <table
                    className="grid-container">
                    <tbody className="grid">
                        {grid.map((row, rowIdx) => {
                            return (
                                <tr key={rowIdx}>
                                    {row.map((vertex, vertexIdx) => {
                                        const { row, col, isFinish, isStart, isWall } = vertex;
                                        return (
                                            <Vertex
                                                key={vertexIdx}
                                                colNum={col}
                                                rowNum={row}
                                                isFinish={isFinish}
                                                isStart={isStart}
                                                isWall={isWall}
                                                onMouseDown={(row, col) => handleMouseDownEvent(row, col)}
                                                onMouseUp={(row, col) => handleMouseUp(row, col)}

                                            ></Vertex>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </center>
        </div >

    );
}

export default PathfindingVisualizer;