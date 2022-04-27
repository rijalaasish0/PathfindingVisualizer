import React, { useState, useEffect } from 'react';
import Vertex from './Vertex';
import { AStar } from '../algorithms/astar';
import './PathfindingVisualizer.css'

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [start_vertex_row, setStartVertexRow] = useState(4);
    const [finish_vertex_row, setFinishVertexRow] = useState(10);
    const [start_vertex_col, setStartVertexCol] = useState(10);
    const [finish_vertex_col, setFinishVertexCol] = useState(19);
    const [row_count, setRowCount] = useState(15);
    const [col_count, setColCount] = useState(20);
    const [isStartVertex, setIsStartVertex] = useState(false);
    const [isFinishVertex, setIsFinishVertex] = useState(false);
    const [isWallVertex, setIsWallVertex] = useState(false);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const [mouseIsPressed, setMouseIsPressed] = useState(false);

    useEffect(() => {
        const newGrid = getInitialGrid();
        setGrid(newGrid);
    }, []);


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
        if (isRunning) {
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
    }

    const createVertex = (row, col) => {
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
                Math.abs(finish_vertex_row - row) +
                Math.abs(finish_vertex_col - col),
            isVisited: false,
            isWall: false,
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
        toggleIsRunning();
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

    const visualize = (algo) => {
        console.log(isRunning);
        if (!isRunning) {
            toggleIsRunning();
            const startVertex = grid[start_vertex_row][start_vertex_col];
            const finishVertex = grid[finish_vertex_row][finish_vertex_col];

            let visitedVerticesInOrder;
            switch (algo) {
                case 'AStar':
                    let start = performance.now();
                    visitedVerticesInOrder = AStar(grid, startVertex, finishVertex);
                    let end = performance.now();
                    console.log(`Call to A* took ${end - start} milliseconds.`); break;
                default:
                    break;
            }
            const verticesInShortestPathOrder = getVerticesInShortestPathOrder(finishVertex);
            verticesInShortestPathOrder.push('end');
            animate(visitedVerticesInOrder, verticesInShortestPathOrder);
        }

    }

    const animate = (visitedVerticesInOrder, verticesInShortestPathOrder) => {
        for (let i = 0; i <= visitedVerticesInOrder.length; i++) {
            if (i === visitedVerticesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(verticesInShortestPathOrder);
                }, 10 * i);
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
            }, 10 * i);
        }
    }

    const animateShortestPath = (verticesInShortestPathOrder) => {
        for (let i = 0; i < verticesInShortestPathOrder.length; i++) {
            if (verticesInShortestPathOrder[i] === 'end') {
                setTimeout(() => {
                    toggleIsRunning();
                }, i * 50);
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
                }, i * 40);
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

    return (
        <div>
            <h2>Pathfinding Visualizer</h2>
            <button onClick={clearWalls}>Clear Walls</button>
            <button onClick={clearGrid}>Clear Grid</button>

            <button
                type="button"
                className="btn btn-primary"
                onClick={() => visualize('AStar')}>
                A* Algorithm
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
        </div >

    );
}

export default PathfindingVisualizer;