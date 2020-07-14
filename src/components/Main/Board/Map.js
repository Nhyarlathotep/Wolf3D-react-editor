import React, {useState} from "react";
import tiles from "../../../resources/tiles.png";
import sprites from "../../../resources/sprites.png";
import {Image, Text, Arrow, Line} from "react-konva";
import portal from "../../../resources/portal.png";
import Konva from "konva";

function dirToPoints(direction) {
    switch (direction) {
        case "North":
            return [32, 32, 32, 4];
        case "South":
            return [32, 32, 32, 60];
        case "East":
            return [32, 32, 4, 32];
        case "West":
            return [32, 32, 60, 32];
        default:
            return [];
    }
}

export default function Map(props) {
    const {pos, z, size: {width, height}, scale, opacity, map} = props;
    const [tileImg, setTileImg] = useState(() => {
        let img = new window.Image();
        img.src = tiles;
        img.onload = () => {
            setTileImg(img);
        };
        return null;
    });
    const [portalImg, setPortalImg] = useState(() => {
        let img = new window.Image();
        img.src = portal;
        img.onload = () => {
            setPortalImg(img);
        };
        return null;
    });
    const [spriteImg, setspriteImg] = useState(() => {
        let img = new window.Image();
        img.src = sprites;
        img.onload = () => {
            setspriteImg(img);
        };
        return null;
    });

    const cellSize = 64 * scale;
    const startCol = Math.floor(pos.x / cellSize);
    const endCol = startCol + Math.ceil(width / cellSize);
    const startRow = Math.floor(pos.y / cellSize);
    const endRow = startRow + Math.ceil(height / cellSize);
    const floor = map.cells[z] ? map.cells[z] : [];
    let images = [];

    for (const cell of floor) {
        //Wall
        if (cell.hasOwnProperty("value")) {
            const {x, y} = cell.pos;
            const value = cell.value;

            if (x < startCol || x > endCol || y < startRow || y > endRow) {
                continue;
            }
            images.push(<Image
                key={`Cell ${x} ${y}`} image={tileImg}
                x={x * cellSize - pos.x} y={y * cellSize - pos.y} width={64} height={64}
                scaleX={scale} scaleY={scale} opacity={opacity}
                crop={{x: 0, y: value * 64, width: 64, height: 64}}/>);

            if (cell.hasOwnProperty("thin")) {
                if (cell.pushable) {
                    images.push(<Arrow
                        key={`Pushable FArrow ${x} ${y}`} x={x * cellSize - pos.x} y={y * cellSize - pos.y}
                        points={dirToPoints(cell.direction)} stroke={"red"} strokeWidth={4} scaleX={scale}
                        scaleY={scale} opacity={opacity}/>);
                } else {
                    let points = cell.direction === "North/South" ? [0, 32, 64, 32] : [32, 0, 32, 64];

                    images.push(<Line
                        key={`Line ThinWall ${x} ${y}`} x={x * cellSize - pos.x} y={y * cellSize - pos.y}
                        points={points} stroke="red" strokeWidth={4} scaleX={scale} scaleY={scale} opacity={opacity}/>);
                }
            } else {
                images.push(<Text
                    key={`height ${x} ${y}`} x={x * cellSize - pos.x} y={y * cellSize - pos.y} text={cell.height * 100}
                    width={64} height={64} scaleX={scale} opacity={opacity} scaleY={scale} fontSize={20}
                    fontFamily={'Arial'} fontStyle={'bold'} align={'center'} verticalAlign={'middle'} fill="white"/>);
            }
        }
    }

    for (const sprite of map.sprites) {
        if (Math.floor(sprite.pos.z) === z) {
            const {x, y} = sprite.pos;

            images.push(<Image
                key={`Sprite ${x} ${y}`} image={spriteImg} x={x * cellSize - pos.x} y={y * cellSize - pos.y} width={64}
                height={64} scaleX={scale} scaleY={scale} opacity={opacity}
                crop={{x: 0, y: sprite.index * 64, width: 64, height: 64}}/>);
        }
    }

    const drawPortal = (portal) => {
        const {x, y} = portal.pos;

        images.push(<Image
            key={`Portal ${x} ${y}`} image={portalImg} x={x * cellSize - pos.x} y={y * cellSize - pos.y} width={64}
            height={64} scaleX={scale} scaleY={scale} opacity={opacity} filters={[Konva.Filters.HSV]}
            ref={(node) => {
                if (node) {
                    node.cache();
                    node["hue"](portal.hue);
                    node["saturation"](0.0);
                    node["value"](0.5);
                    node.getLayer().batchDraw();
                }
            }}/>);
        images.push(<Arrow
            key={`Portal Arrow ${x} ${y}`} x={x * cellSize - pos.x} y={y * cellSize - pos.y}
            points={dirToPoints(portal.direction)} stroke={"red"} strokeWidth={4} scaleX={scale} scaleY={scale}
            opacity={opacity}/>);
    };

    for (const portal of map.portals) {
        if (portal.first && portal.first.pos.z === z) {
            drawPortal(portal.first);
        }
        if (portal.second && portal.second.pos.z === z) {
            drawPortal(portal.second);
        }
    }
    return (images);
}