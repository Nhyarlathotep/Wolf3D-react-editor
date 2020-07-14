import React, {useState, useContext} from "react";
import {makeStyles} from '@material-ui/core/styles';

import {ExpandLess, ExpandMore, Create, Delete} from "@material-ui/icons";
import {List, ListItem, ListItemText, ListItemIcon, Collapse} from '@material-ui/core';

import TilesMenu from "./TilesMenu";
import PortalsMenu from "./PortalsMenu";
import {Context} from "../../../../context";
import {Eraser} from '../../../../resources/icons';
import SpritesMenu from "./SpritesMenu";

const gridWidth = 128 + 20;

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(2),
    },

    wrapperInner: {
        width: '100%',
        display: 'flex',
    },

    container: {
        display: 'flex',
    },

    gridOption: {
        width: `calc(100% - ${gridWidth}px)`
    },

    grid: {
        width: gridWidth,
        height: 256 + theme.spacing(2),
    },

    gridMarker: {
        position: 'absolute',
        top: 0,

        width: '100%',
        height: '100%',

        backgroundColor: `${theme.palette.primary.main}4d`,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 4,
    }
}));

export default function DrawMenu() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const {editor, editor: {selected, options}, setEditor} = useContext(Context);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleErase = () => {
        setEditor({...editor, selected: null, options: {...options, draw: selected ? options.draw : !options.draw}});
    };

    const handleClear = () => {
        setEditor({...editor, map: {cells: [], portals: [], sprites: []}});
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleOpen}>
                <ListItemIcon>
                    <Create/>
                </ListItemIcon>
                <ListItemText primary="Draw"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse className={classes.nested} in={open} timeout="auto">
                <List component="div" disablePadding>
                    <TilesMenu classes={classes}/>
                    <SpritesMenu classes={classes}/>
                    <PortalsMenu/>
                    <ListItem button onClick={handleErase}>
                        <ListItemIcon style={{textAlign: 'center'}}>
                            <Eraser color={options.draw && selected === null ? "primary" : "inherit"}/>
                        </ListItemIcon>
                        <ListItemText primary="Erase"/>
                    </ListItem>
                    <ListItem button onClick={handleClear}>
                        <ListItemIcon>
                            <Delete/>
                        </ListItemIcon>
                        <ListItemText primary="Clear"/>
                    </ListItem>
                </List>
            </Collapse>
        </React.Fragment>
    );
}
