import './Vertex.css'
const Vertex = ({colNum, isFinish, isStart, isWall, onMouseDown, onMouseEnter, onMouseUp, rowNum}) => {
    const vertexClassName = 
        isFinish ? 'vertex-finish' :
        isStart ? 'vertex-start' :
        isWall ? 'vertex-wall' :
        '';
    
        return (
            <td
                id={`vertex-${rowNum}-${colNum}`}
                className={`vertex ${vertexClassName}`}
                onMouseDown={()=>onMouseDown(rowNum, colNum)}
            >
            
            </td>
        )
}

export default Vertex;