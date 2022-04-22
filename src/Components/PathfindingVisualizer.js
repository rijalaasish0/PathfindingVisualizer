import React, { useState, useEffect } from 'react';
import Vertex from './Vertex';
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
        const grid = getInitialGrid();
        setGrid(grid);
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
        setIsRunning(!isRunning);
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
        if (document.getElementById(`vertex-${row}-${col}`).className === 'vertex vertex-finish') {
            setIsStartVertex(true);
        }
        else if (document.getElementById(`vertex-${row}-${col}`).className === 'vertex vertex-start') {
            setIsFinishVertex(true);
        } else {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid);
            console.log(row);
            setIsWallVertex(true);
        }
        setMouseIsPressed(true);
        setCurRow(row);
        setCurCol(col);
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

    return (
        <div>
            <h2>Pathfinding Visualizer</h2>
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
                                        ></Vertex>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

    );
}

export default PathfindingVisualizer;