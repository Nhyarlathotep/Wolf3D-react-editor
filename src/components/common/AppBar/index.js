import React from 'react';
import {Brightness4, Brightness7, GitHub, PlayArrow} from "@material-ui/icons";
import {AppBar as MaterialAppBar, Toolbar, Typography, Tooltip, IconButton} from '@material-ui/core/';

import {Context} from "../../../context";

export default function AppBar(props) {
    const {name, onclick, className, github, children} = props;

    return (
        <MaterialAppBar position="fixed" className={className ? className : ""}>
            <Toolbar>
                <Typography variant="h6" noWrap style={{flexGrow: 1}}>
                    {
                        name
                    }
                    <IconButton color="inherit" onClick={onclick}>
                        <PlayArrow/>
                    </IconButton>
                </Typography>

                <Tooltip title="Github Repository">
                    <IconButton color="inherit" aria-label="Github Repository" href={github}>
                        <GitHub/>
                    </IconButton>
                </Tooltip>
                <Context.Consumer>
                    {({theme, toggleTheme}) =>
                        <Tooltip title="Toggle light/dark theme">
                            <IconButton color="inherit" aria-label="Toggle light/dark theme" onClick={() => {toggleTheme()}}>
                                {theme ? <Brightness4/> : <Brightness7/>}
                            </IconButton>
                        </Tooltip>
                    }
                </Context.Consumer>
                {
                    children
                }
            </Toolbar>
        </MaterialAppBar>
    )
}