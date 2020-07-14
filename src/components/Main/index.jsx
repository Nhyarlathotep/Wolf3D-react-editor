import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {Drawer, CssBaseline, Divider, IconButton} from '@material-ui/core/';
import {Menu, ChevronRight} from "@material-ui/icons";

import Board from "./Board";
import DrawerMenu from "./DrawerMenu";
import BottomMenu from "./BottomMenu";

import AppBar from "../common/AppBar";

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
    '@global': {
        'html, body, #root': {
            height: '100%',
        }
    },
    root: {
        display: 'flex',
        height: "100%",
        overflowY: 'hidden',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        height: "calc(100% - 64px)",
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }
}));

export default function Main(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar name="Launch Game " onclick={() => {props.history.push('/Wolf3D-react-editor/game')}} className={clsx(classes.appBar, {[classes.appBarShift]: open})} github="https://github.com/Nhyarlathotep/Wolf3D-react-editor">
                {
                    <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={handleOpen} className={clsx(open && classes.hide)}>
                        <Menu/>
                    </IconButton>
                }
            </AppBar>
            <main className={clsx(classes.content, {[classes.contentShift]: open})}>
                <div className={classes.drawerHeader}/>
                <Board open={open}/>
                <BottomMenu drawerWidth={open * drawerWidth}/>
            </main>
            <Drawer open={open} hidden={!open} className={classes.drawer} classes={{paper: classes.drawerPaper}} variant="persistent" anchor="right">
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleOpen}>
                        <ChevronRight/>
                    </IconButton>
                </div>
                <Divider/>
                <DrawerMenu/>
            </Drawer>
        </div>
    );
}