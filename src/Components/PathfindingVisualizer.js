import React, {useState, useEffect} from 'react';
import Vertex from './Vertex';

const PathfindingVisualizer = () => {
    const [grid, setGrid] = useState([]);
    const [START_VERTEX_ROW, setStartVertexRow] = useState(0);
    const [FINISH_Vertex_ROW, setFinishVertexRow] = useState(0);
    const [START_Vertex_COL, setStartVertexCol] = useState(0);
    const [FINISH_Vertex_COL, setFinishVertexCol] = useState(0);
    const [row_count, setRowCount] = useState(10);
    const [col_count, setColCount] = useState(10);
    const [isStartVertex, setIsStartVertex] = useState(false);
    const [isFinishVertex, setIsFinishVertex] = useState(false);
    const [isWallVertex, setIsWallVertex] = useState(false);
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const grid = getInitialGrid(10, 10);
        setGrid({grid});
    });


    const getInitialGrid = (rowCount, colCount) => {
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
        return{
            row, 
            col, 
            isStart:
                row === START_VERTEX_ROW && 
                col === START_Vertex_COL,
            isFinish:
                row === FINISH_Vertex_ROW &&
                col === FINISH_Vertex_COL,
            distance: Infinity,
            distanceToFinishVertex:
                Math.abs(FINISH_Vertex_ROW - row) +
                Math.abs(FINISH_Vertex_COL - col),
            isVisited: false,
            isWall: false,
            previousNode: null,
            isNode: true
        }
    }

    return(
        <div>
            <h2>Hello World</h2>
            <table
                className="grid-container">
                    <tbody className = "grid">
                        {grid.map((row, rowIdx) => {
                            return(
                                <tr key={rowIdx}>
                                    {row.map((vertex, vertexIdx) => {
                                        const {row, col, isFinish, isStart, isWall} = vertex;
                                        return(
                                            <Vertex
                                                key={vertexIdx}
                                                col={col}
                                                row={row}
                                                isFinish={isFinish}
                                                isStart={isStart}
                                                isWall={isWall}
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