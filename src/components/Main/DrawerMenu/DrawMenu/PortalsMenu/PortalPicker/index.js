import React, {useContext, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Collapse, List, TextField, Typography, MenuItem} from "@material-ui/core";

import Konva from 'konva';
import {Stage, Layer, Image} from 'react-konva';

import HueSlider from "./HueSlider";
import portal from "../../../../../../resources/portal.png";
import {Context} from "../../../../../../context";

const useStyles = makeStyles((theme) => ({
    marker: {
        borderRadius: 4,
        border: `2px solid ${theme.palette.primary.main}`,
    },
    markerSelected: {
        borderRadius: 4,
        border: `2px solid ${theme.palette.primary.main}`,
        backgroundColor: `${theme.palette.primary.main}4d`,
    }
}));

function Portal(props) {
    const classes = useStyles();
    const {value, selected, onSelect, ...other} = props;
    const [img, setImg] = useState(() => {
        let img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = portal;
        img.onload = () => {
            setImg(img);
        };
        return null;
    });

    return (
        <div {...other}>
            <Stage width={64} height={64} className={selected ? classes.markerSelected : classes.marker}
                   onClick={onSelect}>
                <Layer>
                    <Image width={64} height={64} image={img} filters={[Konva.Filters.HSV]}
                           ref={(node) => {
                               if (node) {
                                   node.cache();
                                   node["hue"](value);
                                   node["saturation"](0.0);
                                   node["value"](0.5);
                                   node.getLayer().batchDraw();
                               }
                           }}/>
                </Layer>
            </Stage>
        </div>
    )
}

const directions = [
    'North',
    'South',
    'East',
    'West'
];

export default function PortalPicker(props) {
    const {index, portalPair} = props;
    const firstHue = (portalPair && portalPair.first ? portalPair.first.hue : 0);
    const firstDirection = (portalPair && portalPair.first ? portalPair.first.direction : "North");
    const secondHue = (portalPair && portalPair.second ? portalPair.second.hue : 180);
    const secondDirection = (portalPair && portalPair.second ? portalPair.second.direction : "North");
    const {editor, editor: {selected}, setEditor} = useContext(Context);
    const [value, setValue] = useState({
        first: {
            hue: firstHue > 220 ? 220 + (360 - firstHue) : 220 - firstHue,
            direction: firstDirection
        },
        second: {
            hue: secondHue > 220 ? 220 + (360 - secondHue) : 220 - secondHue,
            direction: secondDirection
        }
    });
    const isSelected = selected && selected.pair !== null && selected.pair === index;

    const convertHue = (value) => {
        const hue = 220 - value;

        return hue + (hue < 0 ? 360 : 0);
    };

    const handleSelect = (selectedPortal) => () => {
        const selected = {
            pair: index,
            selectedPortal,
            portals: {
                first: {
                    hue: convertHue(value.first.hue),
                    direction: value.first.direction
                },
                second: {
                    hue: convertHue(value.second.hue),
                    direction: value.second.direction
                }
            }
        };

        setEditor({...editor, selected, options: {...editor.options, draw: true}});
    };

    const handleChange = (event, newValue) => {
        const portals = {
            first: {
                hue: selected.selectedPortal ? convertHue(newValue) : convertHue(value.first.hue),
                direction: value.first.direction
            },
            second: {
                hue: selected.selectedPortal ? convertHue(value.second.hue) : convertHue(newValue),
                direction: value.second.direction
            }
        };

        setEditor({...editor, selected: {...selected, portals}});
        if (selected.selectedPortal) {
            if (portalPair && portalPair.first && portalPair.first.hasOwnProperty("pos")) {
                portalPair.first.hue = convertHue(newValue);
            }
            setValue({...value, first: {...value.first, hue: newValue}});
        } else {
            if (portalPair && portalPair.second && portalPair.second.hasOwnProperty("pos")) {
                portalPair.second.hue = convertHue(newValue);
            }
            setValue({...value, second: {...value.second, hue: newValue}});
        }
    };

    const handleNewDirection = ({target}) => {
        const portals = {
            first: {
                hue: convertHue(value.first.hue),
                direction: selected.selectedPortal ? target.value : value.first.direction
            },
            second: {
                hue: convertHue(value.second.hue),
                direction: selected.selectedPortal ? value.second.direction : target.value
            }
        };

        setEditor({...editor, selected: {...selected, portals}});
        if (selected.selectedPortal) {
            if (portalPair && portalPair.first && portalPair.first.hasOwnProperty("pos")) {
                portalPair.first.direction = target.value;
            }
            setValue({...value, first: {...value.first, direction: target.value}});
        } else {
            if (portalPair && portalPair.second && portalPair.second.hasOwnProperty("pos")) {
                portalPair.second.direction = target.value;
            }
            setValue({...value, second: {...value.second, direction: target.value}});
        }
    };

    return (
        <React.Fragment>
            <div style={{display: 'flex', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8}}>
                <Portal value={220 - value.first.hue} selected={isSelected && selected.selectedPortal}
                        onSelect={handleSelect(true)}/>
                <Portal style={{marginLeft: 'auto'}} value={220 - value.second.hue}
                        selected={isSelected && !selected.selectedPortal} onSelect={handleSelect(false)}/>
            </div>
            <Collapse in={isSelected} timeout="auto" unmountOnExit>
                <List>
                    <Typography>
                        Hue
                    </Typography>
                    <HueSlider value={selected && selected.selectedPortal ? value.first.hue : value.second.hue} labelValue={convertHue(selected && selected.selectedPortal ? value.first.hue : value.second.hue)} onChange={handleChange}/>
                    <TextField select value={selected && selected.selectedPortal ? value.first.direction : value.second.direction} onChange={handleNewDirection} fullWidth label="Direction" helperText="Which direction the portal is facing">
                        {directions.map((direction) => (
                            <MenuItem key={direction} value={direction}>
                                {direction}
                            </MenuItem>
                        ))}
                    </TextField>
                </List>
            </Collapse>
        </React.Fragment>
    );
}