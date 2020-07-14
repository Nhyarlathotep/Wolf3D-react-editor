import React, {useContext, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';

import {ExpandLess, ExpandMore, GridOn, Layers, Settings} from "@material-ui/icons";
import Switch from "@material-ui/core/Switch";
import {List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Collapse} from '@material-ui/core';
import {Context} from "../../../../context";

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));

export default function SettingsMenu() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const {editor, editor:{options}, setEditor} = useContext(Context);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleGrid = () => {
        setEditor({...editor, options: {...options, grid: !options.grid}})
    };

    const handleLayers = () => {
        setEditor({...editor, options: {...options, layers: !options.layers}})
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleOpen}>
                <ListItemIcon>
                    <Settings/>
                </ListItemIcon>
                <ListItemText primary="Settings"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    <ListItem className={classes.nested}>
                        <ListItemIcon>
                            <GridOn/>
                        </ListItemIcon>
                        <ListItemText primary="Grid" secondary={"Display Grid"}/>
                        <ListItemSecondaryAction>
                            <Switch edge="end" color="primary" inputProps={{'aria-labelledby': 'switch-list-label-grid'}} onChange={handleGrid} checked={options.grid}/>
                        </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem className={classes.nested}>
                        <ListItemIcon>
                            <Layers/>
                        </ListItemIcon>
                        <ListItemText primary="Layers" secondary={"Display layers"}/>
                        <ListItemSecondaryAction>
                            <Switch edge="end" color="primary" inputProps={{'aria-labelledby': 'switch-list-label-layers'}} onChange={handleLayers} checked={options.layers}/>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Collapse>
        </React.Fragment>
    );
}