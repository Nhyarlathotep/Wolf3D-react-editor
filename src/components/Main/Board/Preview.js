import React, {useState} from "react";
import tiles from "../../../resources/tiles.png";
import sprites from "../../../resources/sprites.png";
import portal from "../../../resources/portal.png";
import {Image} from "react-konva";
import Konva from "konva";

export default function Preview(props) {
    const {pos, scale, selected, mouse} = props;
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

    let images = [];
    const cellSize = 64 * scale;

    if (mouse.draw && selected) {
        const relativeX = pos.x / cellSize - Math.floor(pos.x / cellSize);
        const relativeY = pos.y / cellSize - Math.floor(pos.y / cellSize);
        const posX = Math.floor((mouse.x + relativeX * cellSize) / cellSize) - relativeX;
        const posY = Math.floor((mouse.y + relativeY * cellSize) / cellSize) - relativeY;

        if (selected.hasOwnProperty("value")) {
            images.push(
                <Image
                    key="Preview tile" image={tileImg}
                    x={posX * cellSize} y={posY * cellSize} width={64} height={64} scaleX={scale} scaleY={scale}
                    opacity={0.5} crop={{x: 0, y: selected.value * 64, width: 64, height: 64}}
                />
            );
        } else if (selected.hasOwnProperty("portals")) {
            images.push(
                <Image
                    key="Preview portal" image={portalImg}
                    x={posX * cellSize} y={posY * cellSize} width={64} height={64} scaleX={scale} scaleY={scale}
                    opacity={0.8} filters={[Konva.Filters.HSV]}
                    ref={(node) => {
                        if (node) {
                            node.cache();
                            node["hue"](selected.selectedPortal ? selected.portals.first.hue :  selected.portals.second.hue);
                            node["saturation"](0.0);
                            node["value"](0.5);
                            node.getLayer().batchDraw();
                        }
                    }}
                />
            );
        } else if (selected.hasOwnProperty("index")) {
            images.push(
                <Image
                    key="Preview sprite" image={spriteImg}
                    x={posX * cellSize} y={posY * cellSize} width={64} height={64} scaleX={scale} scaleY={scale}
                    opacity={0.8} crop={{x: 0, y: selected.index * 64, width: 64, height: 64}}/>
            );
        }
    }
    return (images);
}