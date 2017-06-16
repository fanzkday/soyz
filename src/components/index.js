import React from 'react';
import { Setting } from './settings';

export class Main extends React.Component<{},{}> {
    render() {
        return (
            <div id="box">
                <Setting></Setting>
            </div>
        )
    }
}