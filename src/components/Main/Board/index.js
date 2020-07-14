import React, {useContext, useLayoutEffect, useRef, useState} from "react";

import {Stage, Layer} from 'react-konva';
import useTheme from "@material-ui/core/styles/useTheme";

import Grid from "./Grid";
import Map from "./Map";
import Preview from "./Preview"
import {Context} from "../../../context";

export default function Board(props) {
    const theme = useTheme();
    const {editor, editor: {map, selected, options}, setEditor, handleMapAt} = useContext(Context);

    const containerRef = useRef();
    const [pos, setPos] = useState({x: 0, y: 0});
    const [size, setSize] = useState({width: 0, height: 0});
    const [mouse, setMouse] = useState({x: 0, y: 0, draw: options.draw, down: false});
    const cellSize = 64 * options.zoom;

    useLayoutEffect(() => {
        const resize = () => {
            const {width, height} = containerRef.current.getBoundingClientRect();

            setSize({width, height});
        };
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, [props.open]);

    useLayoutEffect(() => {
        if (!options.focus) {
            return;
        }
        for (const sprite of map.sprites) {
            if (sprite.index === 0) {
                let x = sprite.pos.x * cellSize - size.width / 2;
                let y = sprite.pos.y * cellSize - size.height / 2;

                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                setPos({x, y});
                break;
            }
        }
        setEditor(p => {return {...p, options: {...p.options, focus: false}}});
    }, [setPos, setEditor, options.focus, map.sprites, size, cellSize]);

    const handleDragStart = (e) => {
        if (!options.draw) {
            document.body.style.cursor = "all-scroll";
        }
    };

    const handleDragMove = (e) => {
        if (!options.draw) {
            const x = Math.max(0, Math.min(pos.x - e.evt.movementX, 100 * cellSize - size.width));
            const y = Math.max(0, Math.min(pos.y - e.evt.movementY, 100 * cellSize - size.height));

            setPos({x, y});
        }
    };

    const handleDragEnd = (e) => {
        if (!options.draw) {
            document.body.style.cursor = "default";
        }
    };

    const getPos = () => {
        const relativeX = pos.x / cellSize - Math.floor(pos.x / cellSize);
        const relativeY = pos.y / cellSize - Math.floor(pos.y / cellSize);
        const posX = Math.floor((mouse.x + relativeX * cellSize) / cellSize);
        const posY = Math.floor((mouse.y + relativeY * cellSize) / cellSize);

        const x = Math.floor(pos.x / cellSize) + posX;
        const y = Math.floor(pos.y / cellSize) + posY;

        return {x, y, z: options.currentLayer};
    };

    const handleMouseDown = (e) => {
        if (mouse.draw) {
            setMouse({...mouse, down: true, x: e.clientX, y: e.clientY - 64});
            handleMapAt(getPos())
        }
    };

    const handleMouseMove = (e) => {
        if (options.draw) {
            setMouse({...mouse, draw: true, x: e.clientX, y: e.clientY - 64});
            if (mouse.down) {
                handleMapAt(getPos())
            }
        }
    };

    const handleMouseUp = (e) => {
        if (mouse.draw) {
            setMouse({...mouse, down: false});
        }
    };

    const handleMouseOut = (e) => {
        if (options.draw) {
            setMouse({...mouse, draw: false});
            setEditor({...editor, map: editor.map});
        }
    };

    const bounds = () => {
        return {x: 0, y: 0};
    };

    return (
        <div style={{width: '100%', height: '100%'}} ref={containerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut}>
            <Stage style={{position: 'absolute'}} width={size.width} height={size.height} draggable dragBoundFunc={bounds} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
                <Layer visible={options.layers}>
                    <Map pos={pos} z={options.currentLayer - 2} size={size} scale={options.zoom} opacity={0.3} map={map}/>
                </Layer>
                <Layer visible={options.layers}>
                    <Map pos={pos} z={options.currentLayer - 1} size={size} scale={options.zoom} opacity={0.5} map={map}/>
                </Layer>
                <Layer>
                    <Map pos={pos} z={options.currentLayer} size={size} scale={options.zoom} opacity={1.0} map={map}/>
                </Layer>
                <Layer visible={options.grid}>
                    <Grid pos={pos} width={size.width} height={size.height} scale={options.zoom} strokeStyle={theme.strokeStyle}/>
                </Layer>
                <Layer>
                    <Preview pos={pos} scale={options.zoom} selected={selected} mouse={mouse}/>
                </Layer>
            </Stage>
        </div>
    );
}
