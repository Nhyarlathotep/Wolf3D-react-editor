import React, {useContext, useState} from "react";
import {Collapse, GridList, GridListTile, Icon, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {Context} from '../../../../../context';

function importAll(r) {
    return r.keys().map((item) => {return {src: r(item), title: item}});
}

const images = importAll(require.context('../../../../../resources/sprites/', false, /\.(png)$/));

export default function SpritesMenu(props) {
    const {classes} = props;
    const {editor, editor:{selected}, setEditor} = useContext(Context);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleSelect = (index) => () => {
        setEditor({...editor, selected: {index}, options: {...editor.options, draw: true}});
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleOpen}>
                <ListItemIcon style={{textAlign: 'center'}}>
                    <Icon className="fa fa-ghost" color={selected && selected.hasOwnProperty("index") ? "primary" : "inherit"}/>
                </ListItemIcon>
                <ListItemText primary="Sprites"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse className={classes.nested} classes={{wrapperInner: classes.wrapperInner}} in={open} timeout="auto" unmountOnExit>
                <div className={classes.gridOption}/>
                <GridList cellHeight={64} className={classes.grid}>
                    {
                        images.map((image, index) => (
                            <GridListTile key={image.title} onClick={handleSelect(index)}>
                                <React.Fragment>
                                    <img src={image.src} alt={image.title} style={{borderRadius: 4}}/>
                                    <div hidden={selected === null || !selected.hasOwnProperty("index") || selected.index !== index} className={classes.gridMarker}/>
                                </React.Fragment>
                            </GridListTile>
                        ))
                    }
                </GridList>
            </Collapse>
        </React.Fragment>
    );
}