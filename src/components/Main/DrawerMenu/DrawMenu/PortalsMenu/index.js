import React, {useState, useContext, useLayoutEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Collapse, ListItem, ListItemIcon, ListItemText, List, IconButton} from "@material-ui/core";
import {ExpandLess, ExpandMore, Add, Delete} from "@material-ui/icons";

import PortalPicker from "./PortalPicker";
import {Portal} from "../../../../../resources/icons";

import {Context} from '../../../../../context';

const useStyles = makeStyles((theme) => ({
    nested: {
        paddingLeft: theme.spacing(2),
    },

    nestedPortal: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2.3)
    },

    wrapperInner: {
        width: '100%',
        display: 'flex',
    }
}));

export default function PortalsMenu() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const {editor, editor: {selected, map: {portals}}, setEditor} = useContext(Context);
    const [portalList, setPortalList] = useState(() => {
        return portals.map(() => {
            return false
        });
    });

    useLayoutEffect(() => {
        setPortalList(portals.map(() => {
                return false
            }
        ))
    }, [editor.map, portals]);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleAdd = () => {
        const newList = [...portalList];

        newList.push(false);
        setPortalList(newList);
    };

    const handlePortalOpen = (index) => () => {
        const newList = [...portalList];

        newList[index] = !newList[index];
        setPortalList(newList);
    };

    const handleRemove = (index) => () => {
        portals.splice(index, 1);
        if (selected && selected.hasOwnProperty("portals") && selected.pair === index) {
            setEditor({...editor, map: {...editor.map, portals}, selected: null, options: {...editor.options, draw: false}});
        } else {
            setEditor({...editor, map: {...editor.map, portals}})
        }
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleOpen}>
                <ListItemIcon>
                    <Portal color={selected && selected.hasOwnProperty("portals") ? "primary" : "inherit"}/>
                </ListItemIcon>
                <ListItemText primary="Portals"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse className={classes.nested} in={open} timeout="auto" unmountOnExit>
                <List>
                    {
                        portalList.map((isOpen, index) => (
                            <React.Fragment key={index}>
                                <ListItem button onClick={handlePortalOpen(index)}>
                                    <ListItemText primary={`Pair ${index + 1}`}/>
                                    {isOpen ? <ExpandLess/> : <ExpandMore/>}
                                </ListItem>
                                <Collapse className={classes.nestedPortal} in={isOpen} timeout="auto" unmountOnExit>
                                    <PortalPicker index={index} portalPair={portals[index]}/>
                                    <IconButton size="small" style={{float: "right", marginRight: -3}} onClick={handleRemove(index)}>
                                        <Delete fontSize="small"/>
                                    </IconButton>
                                </Collapse>
                            </React.Fragment>
                        ))
                    }
                    <ListItem button onClick={handleAdd}>
                        <ListItemText primary="Add Portals"/>
                        <Add/>
                    </ListItem>
                </List>
            </Collapse>
        </React.Fragment>
    );
}
