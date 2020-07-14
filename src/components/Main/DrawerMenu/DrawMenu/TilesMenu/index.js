import React, {useContext, useState} from "react";
import {Collapse, GridList, GridListTile, Icon, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Switch, TextField, MenuItem, InputAdornment} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {Context} from '../../../../../context';

function importAll(r) {
    return r.keys().map((item) => {return {src: r(item), title: item}});
}

const images = importAll(require.context('../../../../../resources/tiles/', false, /\.(png)$/));

const axis = [
    'North/South',
    'East/West',
];
const cardinalPoints = [
    'North',
    'South',
    'East',
    'West'
];

export default function TilesMenu(props) {
    const {classes} = props;//useStyles();
    const {editor, editor:{selected}, setEditor} = useContext(Context);
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState({height: 100, thin: false, pushable: false, direction: 'North/South'});
    const directions = options.pushable ? cardinalPoints : axis;

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleSelect = (value) => () => {
        const {thin, pushable, direction} = options;

        if (value >= 12) {
            //Is Door or ThinWall
            if (!options.thin) {
                setOptions({...options, thin: true});
            }
            setEditor({...editor, selected: {value, thin: true, pushable, direction}, options: {...editor.options, draw: true}});
        } else if (options.thin) {
            setEditor({...editor, selected: {value, thin, pushable, direction}, options: {...editor.options, draw: true}});
        } else {
            setEditor({...editor, selected: {value, height: options.height / 100}, options: {...editor.options, draw: true}});
        }
    };

    const handleHeight = ({target:{value}}) => {
        if (value === "") {
            setOptions({...options, height: ""});
            if (editor.selected != null && selected.hasOwnProperty("value")) {
                setEditor({...editor, selected: {...selected, height: 0}});
            }
            return;
        }
        value = parseInt(value);
        if (isNaN(value) || value < 0 || value > 100) {
            if (value === 101) {
                value = 0;
            } else if (value === -1) {
                value = 100;
            } else {
                return;
            }
        }
        setOptions({...options, height: value});
        if (editor.selected != null && selected.hasOwnProperty("value")) {
            setEditor({...editor, selected: {...selected, height: value / 100}});
        }
    };

    const handleThin = () => {
        const {thin, pushable, direction} = options;
        const newThin = !thin;

        setOptions({...options, thin: newThin});
        if (selected != null && selected.hasOwnProperty("value")) {
            if (selected.value >= 13 && !newThin) {
                return;
            }
            if (newThin) {
                //Add thin, pushable && direction
                setEditor({...editor, selected: {...selected, thin: newThin, pushable, direction}})
            } else {
                //Remove thin, pushable && direction
                setEditor({...editor, selected: {height: options.height / 100, value: selected.value}})
            }
        }
    };

    const handlePushable = () => {
        const direction = !options.pushable ? 'North' : 'North/South';

        setOptions({...options, pushable: !options.pushable, direction});
        if (selected != null && selected.hasOwnProperty("value")) {
            //Change pushable
            setEditor({...editor, selected: {...selected, pushable: !options.pushable, direction}})
        }
    };

    const handleDirection = ({target:{value}}) => {
        setOptions({...options, direction: value});
        if (selected != null && selected.hasOwnProperty("value")) {
            //Change direction
            setEditor({...editor, selected: {...selected, direction: value}});
        }
    };

    return (
        <React.Fragment>
            <ListItem button onClick={handleOpen}>
                <ListItemIcon style={{textAlign: 'center'}}>
                    <Icon className="fa fa-chess-board" color={selected && selected.hasOwnProperty("value") ? "primary" : "inherit"}/>
                </ListItemIcon>
                <ListItemText primary="Tiles"/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse className={classes.nested} classes={{wrapperInner: classes.wrapperInner}} in={open} timeout="auto" unmountOnExit>
                <div className={classes.gridOption}>
                    <List>
                        <ListItem>
                            <TextField label="Height" type="number" variant="outlined" size="small" fullWidth value={options.height} onChange={handleHeight}
                                       InputProps={{
                                           startAdornment: <InputAdornment position="start">%</InputAdornment>,
                                       }}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Thin"/>
                            <ListItemSecondaryAction>
                                <Switch edge="end" color="primary" onChange={handleThin} checked={options.thin}/>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Collapse in={options.thin} timeout="auto" unmountOnExit>
                            <React.Fragment>
                                <ListItem>
                                    <ListItemText primary="Pushable"/>
                                    <ListItemSecondaryAction>
                                        <Switch edge="end" color="primary" onChange={handlePushable} checked={options.pushable}/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <div style={{paddingLeft: 16, paddingRight: 16}}>
                                    <TextField select value={options.direction} onChange={handleDirection} fullWidth label="Direction" helperText="Which direction the wall is facing">
                                        {directions.map((direction) => (
                                            <MenuItem key={direction} value={direction}>
                                                {direction}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            </React.Fragment>
                        </Collapse>
                    </List>
                </div>
                <GridList cellHeight={64} className={classes.grid}>
                    {
                        images.map((image, index) => (
                            <GridListTile key={image.title} onClick={handleSelect(index)}>
                                <React.Fragment>
                                    <img src={image.src} alt={image.title} style={{borderRadius: 4}}/>
                                    <div hidden={selected === null || !selected.hasOwnProperty("value") || selected.value !== index} className={classes.gridMarker}/>
                                </React.Fragment>
                            </GridListTile>
                        ))
                    }
                </GridList>
            </Collapse>
        </React.Fragment>
    );
}