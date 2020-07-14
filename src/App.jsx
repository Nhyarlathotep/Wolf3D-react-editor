import React, {useState} from "react";
import {Route, Switch, HashRouter} from 'react-router-dom';

import blue from "@material-ui/core/colors/blue";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import {Context} from "./context";
import Main from "./components/Main";
import Game from "./components/Game";

const lightTheme = createMuiTheme({
    palette: {
        primary: blue,
        type: 'light',
    },

    shape: {
        borderRadius: 8,
    },

    strokeStyle: {
        default: 'rgb(155,155,155)',
        bold: 'rgb(15,15,15)'
    }
});
const darkTheme = createMuiTheme({
    overrides: {
        MuiAppBar: {
            colorPrimary: {
                backgroundColor: '#333333'
            }
        },
        MuiPaper: {
            root: {
                backgroundColor: '#333333'
            }
        },
    },

    palette: {
        primary: {
            main: '#90caf9',
            light: 'rgb(166, 212, 250)',
            dark: 'rgb(100, 141, 174)',
            contrastText: '#fff'
        },
        type: 'dark'
    },

    shape: {
        borderRadius: 8,
    },

    strokeStyle: {
        default: 'rgb(100,100,100)',
        bold: 'rgb(240,240,240)'
    },
});

export default function App() {
    const [theme, setTheme] = useState(false);
    const [editor, setEditor] = useState({
            map: {
                cells: [],
                portals: [],
                sprites: []
            },
            selected: null,
            options: {
                draw: false,
                currentLayer: 0,
                zoomMin: 0.3,
                zoom: 0.5,
                zoomMax: 1.5,
                focus: false,
                grid: true,
                layers: true
            }
        });

    const toggleTheme = () => {
        setTheme(!theme);
    };

    const getContext = () => ({
        theme: theme,
        toggleTheme: toggleTheme,
        editor: editor,
        setEditor,
        handleMapAt: (pos) => {
            while (!editor.map.cells[pos.z]) {
                editor.map.cells.push([]);
            }
            let cells = editor.map.cells[pos.z];
            const portals = editor.map.portals;
            const sprites = editor.map.sprites;

            if (editor.selected === null) {
                //Erase wall
                for (const idx in cells) {
                    if (cells[idx].pos.x === pos.x && cells[idx].pos.y === pos.y) {
                        cells.splice(idx, 1);
                    }
                }
                //Erase Sprite
                for (const idx in sprites) {
                    if (sprites[idx].pos.x === pos.x && sprites[idx].pos.y === pos.y && Math.floor(sprites[idx].pos.z) === pos.z) {
                        sprites.splice(idx, 1);
                        break;
                    }
                }
                //Erase portal
                for (const idx in portals) {
                    if (portals[idx].first && portals[idx].first.pos.x === pos.x && portals[idx].first.pos.y === pos.y && portals[idx].first.pos.z === pos.z) {
                        if (portals[idx].second) {
                            //Erase first portal
                            portals[idx].first = null;
                        } else {
                            //Erase pair
                            portals.splice(idx, 1);
                        }
                    } else if (portals[idx].second && portals[idx].second.pos.x === pos.x && portals[idx].second.pos.y === pos.y && portals[idx].second.pos.z === pos.z) {
                        if (portals[idx].first) {
                            //Erase second portal
                            portals[idx].second = null;
                        } else {
                            //Erase pair
                            portals.splice(idx, 1);
                        }
                    }
                }
            } else if (editor.selected.hasOwnProperty("value")){
                //Add wall
                const wall = JSON.parse(JSON.stringify(editor.selected));

                for (const idx in cells) {
                    if (cells[idx].pos.x === pos.x && cells[idx].pos.y === pos.y) {
                        cells.splice(idx, 1);
                        break;
                    }
                }
                wall.pos = {x: pos.x, y: pos.y};
                cells.push(wall);
            } else if (editor.selected.hasOwnProperty("index")) {
                const sprite = JSON.parse(JSON.stringify(editor.selected));

                for (const idx in sprites) {
                    if (sprites[idx].pos.x === pos.x && sprites[idx].pos.y === pos.y && sprites[idx].pos.z === pos.z) {
                        sprites.splice(idx, 1);
                    } else if (sprite.index === 0 && sprites[idx].index === 0) {
                        sprites.splice(idx, 1);
                    }
                }
                for (const idx in cells) {
                    if (cells[idx].pos.x === pos.x && cells[idx].pos.y === pos.y && cells[idx] && cells[idx].height < 1) {
                        pos.z += cells[idx].height;
                        break;
                    }
                }


                sprite.pos = pos;
                sprites.push(sprite);
            } else if (editor.selected.hasOwnProperty("portals")) {
                //Add portal
                const newPair = {
                    first: portals[editor.selected.pair] ? portals[editor.selected.pair].first : null,
                    second: portals[editor.selected.pair] ? portals[editor.selected.pair].second : null
                };

                if (editor.selected.selectedPortal) {
                    newPair.first = editor.selected.portals.first;
                    newPair.first.pos = pos;
                } else {
                    newPair.second = editor.selected.portals.second;
                    newPair.second.pos = pos;
                }
                portals.splice(editor.selected.pair, 1, newPair);
            }
        }
    });

    return (
        <Context.Provider value={getContext()}>
            <MuiThemeProvider theme={theme ? lightTheme : darkTheme}>
                <HashRouter>
                    <Switch>
                        <Route exact path={'/'} render={(props) => <Main history={props.history}/>}/>
                        <Route exact path={'/game'} render={(props) => <Game history={props.history}/>}/>
                    </Switch>
                </HashRouter>
            </MuiThemeProvider>
        </Context.Provider>
    )
};