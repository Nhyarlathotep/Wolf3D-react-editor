import React, {useLayoutEffect, useRef, useState, useContext, useCallback, useReducer} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ImportExport, PlayArrow, Pause, AspectRatio} from "@material-ui/icons";
import {CssBaseline, IconButton} from '@material-ui/core/';

import {Context} from "../../context";
import defaultMap from "../../resources/defaultMap"
import AppBar from "../common/AppBar";
import MapModal from "../common/MapModal";

const keys = [87, 65, 90, 81, 83, 68, 32, 70];

const useStyles = makeStyles((theme) => ({
    content: {
        position: 'absolute',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,

        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center'
    },

    canvas: {
        width: "640px",
        height: "480px",
        border: "4px solid purple"
    }
}));

export default function Game(props) {
    const classes = useStyles();
    const {editor: {map}, setEditor} = useContext(Context);
    const loopId = useRef(null);
    const fps = useRef(0);
    const lastFrameTimeStamp = useRef(performance.now());
    const [wasm, setWasm] = useState(async () => {
        const wasm = await import('wasm');
        setWasm(wasm);
        return null;
    });
    const [game, setGame] = useReducer((state, newState) => {
            if (state) {
                state.free();
            }
            return newState;
        }, null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        if (!open) {
            //Stop updating the game while the modal is open
            stopLoop();
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        }
        setOpen(!open);
    };

    const handleKeyDown = useCallback((event) => {
        if (keys.includes(event.keyCode)) {
            event.preventDefault();
            game.process_event(event.keyCode, true);
        }
    }, [game]);

    const handleKeyUp = useCallback((event) => {
        if (keys.includes(event.keyCode)) {
            event.preventDefault();
            game.process_event(event.keyCode, false);
        }
    }, [game]);

    const loop = useCallback(() => {
        const now = performance.now();
        const delta = (now - lastFrameTimeStamp.current);

        lastFrameTimeStamp.current = now;
        if (fps.current) {
            fps.current.textContent = `Frames per Second: latest = ${Math.round(1 / delta * 1000)}`;
        }
        game.update(delta / 1000);
        loopId.current = window.requestAnimationFrame(loop);
    }, [game]);

    const stopLoop = () => {
        if (loopId.current) {
            window.cancelAnimationFrame(loopId.current);
            loopId.current = null;
        }
    };

    useLayoutEffect(() => {
        const {Game} = wasm;

        if (Game) {
            //Check if the wasm file is loaded
            if (map.cells.length === 0) {
                setEditor(p => {return {...p, map: defaultMap}});
                return;
            }
            setGame(new Game(map.cells.length ? map : defaultMap));
        }
    }, [wasm, map, setEditor]);

    useLayoutEffect(() => {
        if (!game) {
            return;
        }
        if (!loopId.current) {
            //Start loop
            loop();
        }
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            stopLoop();
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [game, loop, handleKeyUp, handleKeyDown]);

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar name="Launch Editor" onclick={() => {props.history.push('/')}} github="https://github.com/Nhyarlathotep/Wolf3d-wasm">
                {
                    <IconButton color="inherit" edge="end" onClick={handleOpen}>
                        <ImportExport/>
                    </IconButton>
                }
            </AppBar>
            <div className={classes.content}>
                <div ref={fps}>
                    Loading
                </div>
                <canvas id="canvas" className={classes.canvas}/>
            </div>
            <MapModal open={open} onClose={handleOpen}/>
        </React.Fragment>
    );
};