import React, {useContext} from "react";

import {makeStyles} from '@material-ui/core/styles';
import {ButtonGroup, Tooltip, Button} from "@material-ui/core/";
import {Add, Remove, ChevronLeft, ChevronRight, ControlCamera, Create, MyLocation} from "@material-ui/icons";

import {Context} from "../../../context";

const useStyles = makeStyles((theme) => ({
    bottomMenuZoom: {
        position: 'absolute',
        bottom: 32 + theme.spacing(3),
        right: props => props.drawerWidth + theme.spacing(2),

        transition: theme.transitions.create(['right'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },

    bottomMenuLayers: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: props => props.drawerWidth + theme.spacing(2),

        transition: theme.transitions.create(['right'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },

    bottomMenuButton: {
        width: 32,
        height: 32,
        minWidth: 32
    },

    bottomMyLocation: {
        width: 32,
        height: 32,
        minWidth: 32,

        position: 'absolute',
        bottom: 3 * 32 + theme.spacing(4),
        right: props => props.drawerWidth + theme.spacing(2),

        transition: theme.transitions.create(['right'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    }
}));

export default function BottomMenu(props) {
    const classes = useStyles(props);
    const {editor, editor:{options}, setEditor} = useContext(Context);

    const handleFocus = () => {
        setEditor({...editor, options: {...options, focus: true}});
    };

    const handleZoom = (value) => () => {
        const zoom = Math.min(Math.max(options.zoom + value, options.zoomMin), options.zoomMax);

        setEditor({...editor, options: {...options, zoom}});
    };

    const handleDraw = () => {
        setEditor({...editor, options: {...options, draw: !options.draw}});
    };

    const handleLayers = (value) => () => {
        const currentLayer = Math.min(Math.max(options.currentLayer + value, 0), 9);

        setEditor({...editor, options: {...options, currentLayer}});
    };

    return (
        <React.Fragment>
            <Tooltip title={"Focus on player"} placement="left">
                <Button className={classes.bottomMyLocation} size="small" color="secondary" variant="contained" onClick={handleFocus}>
                    <MyLocation fontSize="small"/>
                </Button>
            </Tooltip>

            <ButtonGroup className={classes.bottomMenuZoom} size="small" orientation="vertical" color="secondary" variant="contained">
                <Tooltip title={"Zoom in"} placement="left">
                    <Button className={classes.bottomMenuButton} onClick={handleZoom(0.2)}>
                        <Add fontSize="small"/>
                    </Button>
                </Tooltip>

                <Tooltip title={"Zoom out"} placement="left">
                    <Button className={classes.bottomMenuButton} onClick={handleZoom(-0.2)}>
                        <Remove fontSize="small"/>
                    </Button>
                </Tooltip>
            </ButtonGroup>

            <ButtonGroup className={classes.bottomMenuLayers} size="small" color="secondary" variant="contained">
                <Tooltip title={"Previous layer"}>
                    <Button className={classes.bottomMenuButton} onClick={handleLayers(-1)}>
                        <ChevronLeft fontSize="small"/>
                    </Button>
                </Tooltip>

                <Tooltip title={"Current layer"}>
                    <Button style={{height: 32, fontFamily: "sans-serif"}}>
                        {options.currentLayer + 1}/10
                    </Button>
                </Tooltip>

                <Tooltip title={"Next layer"}>
                    <Button className={classes.bottomMenuButton} onClick={handleLayers(1)}>
                        <ChevronRight fontSize="small"/>
                    </Button>
                </Tooltip>

                <Tooltip title={"Draw/MoveCamera"}>
                    <Button className={classes.bottomMenuButton} onClick={handleDraw}>
                        {options.draw ? <ControlCamera fontSize="small"/> :  <Create fontSize="small"/>}
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </React.Fragment>
    );
}