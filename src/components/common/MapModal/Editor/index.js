import React, {useLayoutEffect, useState} from "react";

import ace from 'brace';
import 'brace/mode/json';
import 'brace/theme/sqlserver';
import 'brace/theme/clouds_midnight';

export default function Editor(props) {
    const [value, setValue] = useState("");
    const [editor, setEditor] = useState(null);

    useLayoutEffect(() => {
        const inst = ace.edit('json-editor');

        setEditor(inst);
        if (!editor) {
            return;
        }

        const createEditor = (value) => {
            editor.getSession().on("changeAnnotation", () => {
                    props.onValidate(editor.getSession().getAnnotations(), editor);
                }
            );

            editor.$blockScrolling = Infinity;
            editor.setOption('showPrintMargin', false);
            editor.getSession().setMode('ace/mode/json');
            if (props.theme) {
                editor.setTheme('ace/theme/' + props.theme);
            }

            editor.setValue(value);
            editor.clearSelection();
        };

        if (props.defaultValue && value === "") {
            setValue(props.Value);
            createEditor(props.defaultValue);
        } else if (props.Value && value !== props.Value) {
            setValue(props.Value);
            createEditor(props.Value);
        }
    }, [props, editor, value]);

    const onBlur = (evt) => {
        props.onBlur(evt, editor);
    };

    return (
        <div style={{height: '100%'}} id={'json-editor'} onBlur={onBlur}/>
    );
}