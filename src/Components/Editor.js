import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Action';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            // ->'change' ek codemirror ki event h, ->origin me operations rhta h jaise ki cut paste input+ agar value setValue h to hm code ko server pe send ni krenge -> yahan pr jb bhi code change hoga to seedha server ko request jayegi aur server baki user ko jo is room se add h unhe response send kr dega
            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                //onCodeChange ek functions h jo editor.js me as a prop pass kiya gya h ye pure code ko store krta h jb koi new user join krta h to use ye code send kiya jata h
                onCodeChange(code);
                //setvalue jb hogi tb server se data aayega is liye setvalue wale origin pe hm data server pe ni bhejenge
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);
    //yahan pr data receive ho rha aur editorRef pe jo data aaya h usko setvalue se help se set kr denge ye sbs realtime me hoga
    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }
        
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;