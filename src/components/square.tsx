import React, { useState } from "react";
import "./board.css"
export default function Square(props: any){
    const[value, setValue] = useState(props.value)
    
    return(
        <button className="square" onClick={() => props.playerMove} data-testid="board-square">
            {value}
        </button>
    )
}