import React, {useLayoutEffect, useRef, useState, useContext, useCallback, useReducer} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ImportExport, AspectRatio} from "@material-ui/icons";
import {CssBaseline, IconButton, Tooltip, Menu, MenuItem} from '@material-ui/core/';

import {Context} from "../../context";
import defaultMap from "../../resources/defaultMap"
import AppBar from "../common/AppBar";
import MapModal from "../common/MapModal";

const keys = [87, 65, 90, 81, 83, 68, 32, 70];

const useStyles = makeStyles(() => ({
    content: {
        position: 'absolute',
        top: "calc(50% + 32px)",
        left: `50%`,
        transform: `translate(-50%, -50%)`,

        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center'
    },
    canvas: {
        width: "800px",
        height: "600px",
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
    const [state, setState] = useState({open: false, resolution: {width: 320, height: 240}, anchorMenu: null});

    const handleOpen = () => {
        if (!state.open) {
            //Stop updating the game while the modal is open
            stopLoop();
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown);
        }
        setState(p => {return {...p, open: !state.open}});
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
            setGame(new Game(map.cells.length ? map : defaultMap, state.resolution.width, state.resolution.height));
        }
    }, [wasm, map, state.resolution, setEditor]);

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

    const handleMenuOpen = (event) => {
        setState(p => {return {...p, anchorMenu: event.currentTarget}})
    };

    const handleMenuClose= (ratio) => () => {
        setState(p => {return {...p, resolution: {width: 320 * ratio, height: 240 * ratio}, anchorMenu: null}})
    };

    return (
        <React.Fragment>
            <CssBaseline/>
            <AppBar name="Launch Editor" onclick={() => {props.history.push('/')}} github="https://github.com/Nhyarlathotep/Wolf3d-wasm">
                {
                    <React.Fragment>
                        <Tooltip title="Import/Export Map">
                            <IconButton color="inherit" onClick={handleOpen}>
                                <ImportExport/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Change the Game resolution">
                            <IconButton color="inherit" edge="end" onClick={handleMenuOpen}>
                                <AspectRatio/>
                            </IconButton>
                        </Tooltip>
                        <Menu id="simple-menu" anchorEl={state.anchorMenu} keepMounted open={Boolean(state.anchorMenu)} onClose={handleMenuClose}>
                            <MenuItem onClick={handleMenuClose(1)}>320x240</MenuItem>
                            <MenuItem onClick={handleMenuClose(2)}>640x480</MenuItem>
                            <MenuItem onClick={handleMenuClose(3)}>800x600</MenuItem>
                        </Menu>
                    </React.Fragment>
                }
            </AppBar>
            <div className={classes.content}>
                <div ref={fps}>
                    Loading
                </div>
                <canvas id="canvas" className={classes.canvas}/>
            </div>
            <MapModal open={state.open} onClose={handleOpen}/>
        </React.Fragment>
    );
};