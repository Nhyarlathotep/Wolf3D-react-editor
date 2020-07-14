import React, {useState} from 'react';

import {ImportExport} from '@material-ui/icons';
import {List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core';

import MapModal from "../../common/MapModal";
import SettingsMenu from "./SettingsMenu/settings";
import DrawMenu from "./DrawMenu";

export default function DrawerMenu() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <React.Fragment>
            <List component="nav">
                <ListItem button onClick={handleOpen}>
                    <ListItemIcon>
                        <ImportExport/>
                    </ListItemIcon>
                    <ListItemText primary="Import/Export"/>
                </ListItem>
                <DrawMenu/>
                <SettingsMenu/>
            </List>
            <MapModal open={open} onClose={handleOpen}/>
        </React.Fragment>
    );
}
