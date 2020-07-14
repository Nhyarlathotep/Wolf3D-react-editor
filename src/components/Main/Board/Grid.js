import {Line} from "react-konva";
import React from "react";

export default function Grid(props) {
    const {pos, width, height, scale, strokeStyle} = props;

    const lines = [];
    const cellSize = 64 * scale;

    const startCol = 1 + Math.floor(pos.x / cellSize);
    const endCol = startCol + Math.ceil(width / cellSize);

    for (let col = startCol; col <= endCol; col++) {
        lines.push(
            <Line key={`col${col}`} x={col * cellSize - pos.x} y={0} points={[0, 0, 0, height]}
                  dash={[4, 2]}
                  stroke={col % 10 !== 0 ? strokeStyle.default : strokeStyle.bold}
                  strokeWidth={col % 50 !== 0 ? 0.5 : 1.5}
            />
        )
    }

    const startRow = 1 + Math.floor(pos.y / cellSize);
    const endRow = startRow + Math.ceil(height / cellSize);

    for (let row = startRow; row <= endRow; row++) {
        lines.push(
            <Line key={`row${row}`} x={0} y={row * cellSize - pos.y} points={[0, 0, width, 0]}
                  dash={[4, 1]}
                  stroke={row % 10 !== 0 ? strokeStyle.default : strokeStyle.bold}
                  strokeWidth={row % 50 !== 0 ? 0.5 : 1.5}
            />
        )
    }
    return (lines);
}