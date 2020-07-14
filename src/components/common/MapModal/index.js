import React, {useState, useEffect, useContext} from "react";

import Alert from "@material-ui/lab/Alert";
import {makeStyles} from '@material-ui/core/styles';
import {Button, Divider, Icon, Modal, Paper} from "@material-ui/core/";

import {loadCSS} from 'fg-loadcss';
import {CopyToClipboard} from "react-copy-to-clipboard";

import Editor from "./Editor";
import {Context} from "../../../context";
import {Clip} from "../../../resources/icons";

const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,

        width: '50%',
        height: '65%',
        outline: 0,

        display: 'flex',
        flexFlow: 'column',
    },

    modalFooter: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1, 1, 1),

        '& .MuiAlert-root': {
            marginLeft: 'auto',
        },
        '& > .MuiButton-root': {
            marginRight: theme.spacing(1)
        },
    },
}));

export default function MapModal(props) {
    const classes = useStyles();
    const {editor, setEditor} = useContext(Context);
    const [json, setJson] = useState(() => {
        loadCSS('https://use.fontawesome.com/releases/v5.12.0/css/all.css', document.querySelector('#font-awesome-css'));
        return {value: null, copied: false};
    });
    const [alert, setAlert] = useState({state: 'success', message: 'Valid json input'});

    useEffect(() => {
        setJson({value: JSON.stringify(editor.map, null, 2), copied: false});
    }, [editor]);

    const onValidate = (annotations, braceEditor) => {
        if (annotations.length) {
            const error = annotations[0];
            setAlert({state: error.type, message: "Line " + (error.row + 1) + ": " + error.text});
        } else {
            setAlert({state: 'success', message: 'Valid json input'});
        }
    };

    const onBlur = (evt, braceEditor) => {
        //Apply editor modifications
        setJson({value: braceEditor.getValue(), copied: false});
    };

    const handleCopy = () => {
        setJson({...json, copied: true});
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([json.value], {type: 'text/json'});

        element.href = URL.createObjectURL(file);
        element.download = "Custom_map.json";
        document.body.appendChild(element);
        element.click();
    };

    const handleUpload = ({target: {files}}) => {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
            setJson({value: fileReader.result, copied: false});
        };
        fileReader.readAsText(files[0]);
    };

    const body = (
        <Paper className={classes.modal} elevation={3}>
            <Context.Consumer>
                {({theme}) =>
                    <Editor style={{width: '100%', flexGrow: 1}} Value={json.value} theme={theme ? "sqlserver" : "clouds_midnight"} onValidate={onValidate} onBlur={onBlur}/>
                }
            </Context.Consumer>
            <Divider/>
            <div className={classes.modalFooter}>
                <CopyToClipboard text={json.value} onCopy={handleCopy}>
                    <Button variant="contained">
                        <Clip/>
                    </Button>
                </CopyToClipboard>
                <Button variant="contained" onClick={handleDownload}>
                    <Icon className="fa fa-download"/>
                </Button>
                <Button variant="contained" component="label">
                    <Icon className="fa fa-upload"/>
                    <input hidden={true} type="file" onChange={handleUpload}/>
                </Button>
                <Alert variant="filled" severity={alert.state}>
                    {alert.message}
                </Alert>
            </div>
        </Paper>
    );

    const handleClose = () => {
        if (alert.state === "success" && json.value.length !== 0) {
            setEditor({...editor, map: JSON.parse(json.value)});
        } else {
            //Reset
            setJson({value: JSON.stringify(editor.map, null, 2), copied: false});
        }
        props.onClose();
    };

    return (
        <Modal open={props.open} onClose={handleClose}>
            {body}
        </Modal>
    );
}
